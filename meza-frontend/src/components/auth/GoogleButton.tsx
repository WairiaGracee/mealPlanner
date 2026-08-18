import { useEffect, useRef } from "react";
import { useAuth } from "../../context/authContext";

interface GoogleButtonProps {
  label?: string;
  onError?: (message: string) => void;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export default function GoogleButton({
  label = "Continue with Google",
  onError,
  onSuccess,
}: GoogleButtonProps) {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);

  // loginWithGoogle/onError/onSuccess are likely new references on every
  // render (context value, inline prop), so we read them via refs inside
  // the callback instead of listing them as effect deps — otherwise GSI's
  // initialize() gets called again on every render (see the "initialize()
  // is called multiple times" console warning this was producing).
  const loginWithGoogleRef = useRef(loginWithGoogle);
  const onErrorRef = useRef(onError);
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    loginWithGoogleRef.current = loginWithGoogle;
    onErrorRef.current = onError;
    onSuccessRef.current = onSuccess;
  }, [loginWithGoogle, onError, onSuccess]);

  // Guards against React.StrictMode's dev-only double-invoke of effects
  // (mount → cleanup → mount, same component instance, same ref) calling
  // initialize() twice. This is per-instance rather than module-level so
  // GoogleButton still works correctly when both LoginPage and
  // RegisterPage mount their own instance with their own callbacks.
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    function render() {
      if (!window.google || !buttonRef.current || initializedRef.current) return;
      initializedRef.current = true;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: { credential: string }) => {
          try {
            await loginWithGoogleRef.current(response.credential);
            onSuccessRef.current?.();
          } catch {
            onErrorRef.current?.("Google sign-in failed. Please try again.");
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current!, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "pill",
        width: buttonRef.current!.offsetWidth || 320,
        text: label.toLowerCase().startsWith("sign up") ? "signup_with" : "signin_with",
      });
    }

    if (window.google) {
      render();
      return;
    }

    // The GSI <script> tag in index.html loads with async/defer, so on
    // first mount (or a slow connection) window.google may not exist
    // yet — without this poll the effect above would just no-op once
    // and the button would silently never appear. Bounded at 10s so we
    // don't poll forever if the script fails to load (e.g. blocked by
    // an ad blocker or offline).
    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);
        render();
      }
    }, 100);
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
    // Intentionally run once per mount + label change — see comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="rounded-full border border-line bg-white px-6 py-3 text-center text-xs text-inkMuted">
        Google sign-in isn&rsquo;t configured yet.
      </p>
    );
  }

  return <div ref={buttonRef} className="flex w-full justify-center" />;
}
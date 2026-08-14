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
    if (!GOOGLE_CLIENT_ID || !window.google || !buttonRef.current) return;
    if (initializedRef.current) return;
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

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "pill",
      width: buttonRef.current.offsetWidth || 320,
      text: label.toLowerCase().startsWith("sign up") ? "signup_with" : "signin_with",
    });
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
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import GoogleButton from "../components/auth/GoogleButton";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";
import { useAuth, ApiError } from "../context/authContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// At least 8 characters, with at least one letter, one number, and one special character
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!agreed) {
      setError("Please agree to the Privacy Policy and Terms to continue.");
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!PASSWORD_PATTERN.test(password)) {
      setError(
        "Password must be at least 8 characters and include a letter, a number, and a special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await register({ fullName, email, password });
      navigate("/onboarding");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message || "Couldn't create your account."
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Takes about a minute — then we'll personalize your plan."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-forest hover:text-forest-deep">
            Log in
          </Link>
        </>
      }
    >
      <label className="mb-5 flex items-start gap-3 text-sm text-inkMuted">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            if (e.target.checked) setError("");
          }}
          className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-line text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
        />
        <span>
          I've read and agree to the{" "}
          <Link
            to="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest underline hover:text-forest-deep"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            to="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest underline hover:text-forest-deep"
          >
            Terms of Agreement
          </Link>
          .
        </span>
      </label>

      <div
        className={!agreed ? "pointer-events-none opacity-50" : ""}
        aria-disabled={!agreed}
      >
        <GoogleButton label="Sign up with Google" onError={setError} onSuccess={() => navigate("/onboarding")} />
      </div>
      {!agreed && (
        <p className="mt-2 text-xs text-inkMuted">
          Check the box above to continue with Google.
        </p>
      )}

      <div className="my-6 flex items-center gap-3 font-mono text-xs uppercase tracking-wide text-muted">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          id="fullName"
          label="Full name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jane Wanjiru"
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          required
          pattern={EMAIL_PATTERN.source}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <TextField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          hint="At least 8 characters, with a letter, a number, and a special character."
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-inkMuted transition-colors hover:text-forest"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <TextField
          id="confirmPassword"
          label="Confirm password"
          type={showConfirmPassword ? "text" : "password"}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
          endAdornment={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="text-inkMuted transition-colors hover:text-forest"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        {error && <p className="text-sm text-clay">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          className="mt-2 justify-center"
          disabled={submitting || !agreed}
        >
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
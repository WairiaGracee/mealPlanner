import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import GoogleButton from "../components/auth/GoogleButton";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";
import { useAuth, ApiError } from "../context/authContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

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
      <GoogleButton label="Sign up with Google" onError={setError} onSuccess={() => navigate("/onboarding")} />

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />
        <TextField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
        />

        {error && <p className="text-sm text-clay">{error}</p>}

        <Button type="submit" variant="primary" className="mt-2 justify-center" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
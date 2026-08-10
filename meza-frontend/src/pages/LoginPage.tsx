import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import GoogleButton from "../components/auth/GoogleButton";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: replace with a real POST /api/auth/login/ call once the
    // Django backend exists. For now this just confirms the flow works.
    navigate("/dashboard");
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see this week's plan."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link to="/register" className="text-forest hover:text-forest-deep">
            Create one
          </Link>
        </>
      }
    >
      <GoogleButton />

      <div className="my-6 flex items-center gap-3 font-mono text-xs uppercase tracking-wide text-muted">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          placeholder="••••••••"
        />

        <Button type="submit" variant="primary" className="mt-2 justify-center">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}
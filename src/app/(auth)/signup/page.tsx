"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpWithEmail, signInWithGoogle } from "@/lib/auth/actions";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [emailCheckedFor, setEmailCheckedFor] = useState<string | null>(null);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    try {
      // Normalize email for lookup
      const normalizedEmail = email.trim().toLowerCase();

      // Call server-side endpoint to check email existence (bypasses RLS using service role key)
      const lookupResp = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!lookupResp.ok) {
        const body = await lookupResp.json().catch(() => ({}));
        console.error("Email lookup failed:", lookupResp.status, body);
        setError(body?.error || "Unable to verify email uniqueness. Please try again later.");
        setLoading(false);
        return;
      }

      const lookupJson = await lookupResp.json();
      if (lookupJson.exists) {
        setError("An account with that email already exists. Please log in or use a different email.");
        setLoading(false);
        return;
      }

      // Proceed with signup since email is not present
      await signUpWithEmail(normalizedEmail, password, firstName, lastName);
      setSuccess(true);

      // Show success message then redirect
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      console.error("Signup error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to sign up";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");
    
    try {
      await signInWithGoogle();
      // User will be redirected to Google, then back via callback
    } catch (err: unknown) {
      console.error("Google signup error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to sign up with Google";
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Created!</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please check your email to verify your account. You will be redirected to login shortly...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Signup Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign Up</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Create your account</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            fullWidth
          />

          <Input
            label="Last Name"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            fullWidth
          />
        </div>

        <Input
          id="signup-email"
          label="Email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // Reset inline check if user edits after a previous check
            if (emailCheckedFor && e.target.value.trim().toLowerCase() !== emailCheckedFor) {
              setEmailExists(null);
              setEmailCheckedFor(null);
            }
          }}
          onBlur={async () => {
            const val = email.trim().toLowerCase();
            if (!val) return;
            if (emailCheckedFor === val) return; // already checked

            setEmailChecking(true);
            setEmailExists(null);
            try {
              const resp = await fetch('/api/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: val }),
              });

              if (!resp.ok) {
                const body = await resp.json().catch(() => ({}));
                console.error('Email lookup failed (blur):', resp.status, body);
                // mark as unchecked but don't block user
                setEmailExists(null);
                setEmailCheckedFor(val);
                setEmailChecking(false);
                return;
              }

              const json = await resp.json();
              setEmailExists(Boolean(json.exists));
              setEmailCheckedFor(val);
            } catch (err) {
              console.error('Email lookup error (blur):', err);
              setEmailExists(null);
              setEmailCheckedFor(val);
            } finally {
              setEmailChecking(false);
            }
          }}
          required
          fullWidth
          error={emailExists ? 'An account with that email already exists.' : undefined}
          helperText={
            emailChecking
              ? 'Checking email…'
              : emailExists === false
              ? 'Email is available'
              : undefined
          }
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          helperText="Must be at least 6 characters"
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={loading}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Google Signup Button */}
      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={loading}
        className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-md font-medium border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="text-base">
          Continue with Google
        </span>
      </button>

      {/* Login Link */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline font-medium"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Stratifyr" },
      { name: "description", content: "Sign in or create your Stratifyr account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useStore();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setUser({ name: name || email.split("@")[0], email });
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 radial-fade" />

      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-xl font-semibold">Stratifyr</span>
          </Link>
        </div>

        <div className="glass rounded-2xl p-8 shadow-soft">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-muted/50 mb-6">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative rounded-md py-2 text-sm font-medium transition ${
                  mode === m ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {mode === m && (
                  <motion.div
                    layoutId="auth-tab"
                    className="absolute inset-0 bg-gradient-brand rounded-md shadow-glow"
                  />
                )}
                <span className="relative">{m === "login" ? "Sign in" : "Sign up"}</span>
              </button>
            ))}
          </div>

          <h1 className="font-display text-2xl font-semibold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "Sign in to continue planning." : "Start planning in minutes."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="mt-1.5 h-11"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-brand hover:opacity-90 shadow-glow"
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-5">
            By continuing you agree to our terms and privacy policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
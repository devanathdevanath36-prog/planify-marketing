import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import logo from "@/assets/stratifyr-logo.jpg";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-xl bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Stratifyr logo"
            className="h-8 w-8 rounded-lg object-cover shadow-glow"
          />
          <span className="font-display text-lg font-semibold tracking-tight">
            Stratifyr
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
            Features
          </a>
          <a href="#how" className="text-sm text-muted-foreground hover:text-foreground transition">
            How it works
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild size="sm" className="bg-gradient-brand hover:opacity-90 shadow-glow">
              <Link to="/dashboard">Open dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-brand hover:opacity-90 shadow-glow">
                <Link to="/auth">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
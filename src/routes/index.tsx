import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Wallet,
  CalendarRange,
  Sparkles,
  Check,
  PieChart,
  Compass,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import heroBg from "@/assets/hero-bg.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stratifyr — Turn marketing spend into a clear, actionable plan" },
      {
        name: "description",
        content:
          "Stratifyr is the marketing planner for small businesses. Allocate budgets, schedule campaigns, and generate strategy in minutes.",
      },
      { property: "og:title", content: "Stratifyr — Marketing planning for small business" },
      {
        property: "og:description",
        content: "Allocate budgets, schedule campaigns, and generate a clear monthly strategy.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-36 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur mb-6">
            <Sparkles className="h-3 w-3 text-primary" />
            Marketing planning, made simple
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            Turn marketing spend into a{" "}
            <span className="text-gradient">clear, actionable plan</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Stratifyr helps small businesses allocate budgets, schedule campaigns, and
            generate a monthly strategy — without spreadsheets or guesswork.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-brand hover:opacity-90 shadow-glow text-base h-12 px-6">
              <Link to="/dashboard">
                Open the planner <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base h-12 px-6">
              <a href="#how">See how it works</a>
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> No credit card</div>
            <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> 5-minute setup</div>
            <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Cancel anytime</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="hidden lg:block"
        />
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Wallet,
      title: "Budget Planner",
      desc: "Set a monthly budget and split it across the channels that matter — Instagram, Google, Email, SEO and more.",
    },
    {
      icon: CalendarRange,
      title: "Campaign Scheduler",
      desc: "Plan campaigns on a clean calendar. Track status, dates, and spend at a glance.",
    },
    {
      icon: Compass,
      title: "Strategy Generator",
      desc: "Answer three questions and get a monthly marketing plan tailored to your goals.",
    },
    {
      icon: PieChart,
      title: "Visual Overview",
      desc: "See exactly where your money goes with simple, beautiful breakdowns.",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-sm font-medium text-primary mb-3">Features</p>
        <h2 className="font-display text-4xl lg:text-5xl font-bold">
          Everything you need.{" "}
          <span className="text-muted-foreground">Nothing you don't.</span>
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-6 hover:shadow-glow transition-shadow"
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-brand/10 flex items-center justify-center mb-4 border border-primary/20">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-1.5">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Set your budget", d: "Tell Stratifyr how much you can spend this month." },
    { n: "02", t: "Plan your campaigns", d: "Drop campaigns onto the calendar by channel and date." },
    { n: "03", t: "Generate your strategy", d: "Get a clear monthly plan you can execute today." },
  ];
  return (
    <section id="how" className="bg-card/30 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-medium text-primary mb-3">How it works</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold">From zero to plan in 3 steps</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl border border-border/60 bg-background/40 p-7"
            >
              <span className="font-display text-5xl font-bold text-gradient opacity-90">{s.n}</span>
              <h3 className="font-display text-xl font-semibold mt-3">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      sub: "Get started",
      features: ["1 monthly budget", "Up to 3 campaigns", "Basic strategy generator"],
      cta: "Start free",
      featured: false,
    },
    {
      name: "Pro",
      price: "$19",
      sub: "/ month",
      features: ["Unlimited campaigns", "Advanced strategy AI", "Channel analytics", "Email support"],
      cta: "Start Pro",
      featured: true,
    },
    {
      name: "Premium",
      price: "$49",
      sub: "/ month",
      features: ["Everything in Pro", "Multi-business workspace", "Priority support", "Custom reporting"],
      cta: "Start Premium",
      featured: false,
    },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-sm font-medium text-primary mb-3">Pricing</p>
        <h2 className="font-display text-4xl lg:text-5xl font-bold">Simple plans that grow with you</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-2xl p-7 border ${
              t.featured
                ? "border-primary/40 bg-gradient-to-b from-primary/10 to-transparent shadow-glow"
                : "border-border/60 bg-card/40"
            }`}
          >
            {t.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-brand px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                Most popular
              </div>
            )}
            <h3 className="font-display text-xl font-semibold">{t.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold">{t.price}</span>
              <span className="text-sm text-muted-foreground">{t.sub}</span>
            </div>
            <ul className="mt-6 space-y-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={`mt-7 w-full ${t.featured ? "bg-gradient-brand hover:opacity-90" : ""}`}
              variant={t.featured ? "default" : "outline"}
            >
              <Link to="/auth">{t.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-12 lg:p-16 text-center">
        <div className="absolute inset-0 radial-fade opacity-60" />
        <div className="relative">
          <Rocket className="h-10 w-10 text-primary mx-auto mb-5" />
          <h2 className="font-display text-4xl lg:text-5xl font-bold max-w-2xl mx-auto">
            Stop guessing. Start <span className="text-gradient">planning</span>.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Join the small businesses using Stratifyr to bring structure to their marketing.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gradient-brand hover:opacity-90 shadow-glow h-12 px-7">
            <Link to="/dashboard">
              Open the planner <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Stratifyr</p>
        <p>Crafted for small businesses that mean business.</p>
      </div>
    </footer>
  );
}

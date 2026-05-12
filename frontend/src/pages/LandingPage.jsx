import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Zap,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  Check,
  Star,
  DollarSign,
  Target,
  Bell,
  CreditCard,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";

/* ─── Floating Badge ─── */
const FloatingBadge = ({ className, children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
    className={`absolute hidden md:flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl shadow-xl border border-slate-100 text-sm font-semibold z-10 ${className}`}
  >
    {children}
  </motion.div>
);

/* ─── Dashboard Preview ─── */
const DashboardMockup = () => (
  <div className="rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/40 overflow-hidden">
    {/* Chrome bar */}
    <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center gap-3">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-rose-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-emerald-400" />
      </div>
      <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs text-slate-400 text-center max-w-xs mx-auto">
        app.wealthly.io/dashboard
      </div>
    </div>

    {/* Dashboard body */}
    <div className="p-6 bg-slate-50/50">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Balance</p>
          <p className="text-3xl font-black text-slate-900 mt-0.5">$24,830.00</p>
        </div>
        <div className="flex gap-2">
          {["1W", "1M", "3M", "1Y"].map((t, i) => (
            <button
              key={t}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                i === 1
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Income", value: "+$6,200", color: "emerald", icon: TrendingUp },
          { label: "Expenses", value: "-$3,840", color: "rose", icon: CreditCard },
          { label: "Savings Rate", value: "38%", color: "indigo", icon: Target },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500 font-medium mb-2">{label}</p>
            <p
              className={`text-lg font-black ${
                color === "emerald"
                  ? "text-emerald-600"
                  : color === "rose"
                  ? "text-rose-500"
                  : "text-primary"
              }`}
            >
              {value}
            </p>
            <div
              className={`mt-2 w-8 h-8 rounded-xl flex items-center justify-center ${
                color === "emerald"
                  ? "bg-emerald-50 text-emerald-600"
                  : color === "rose"
                  ? "bg-rose-50 text-rose-500"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="grid grid-cols-5 gap-3">
        {/* Sparkline */}
        <div className="col-span-3 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-700 mb-3">Spending Overview</p>
          <div className="flex items-end gap-1.5 h-24">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
                <div
                  className={`rounded-t-md transition-all ${
                    i === 10
                      ? "bg-primary"
                      : i === 11
                      ? "bg-primary/80"
                      : "bg-slate-100"
                  }`}
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>Jan</span><span>Apr</span><span>Jul</span><span>Dec</span>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="col-span-2 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-700 mb-3">Categories</p>
          <div className="space-y-2.5">
            {[
              { name: "Housing", pct: 42, color: "bg-primary" },
              { name: "Food", pct: 28, color: "bg-emerald-400" },
              { name: "Transport", pct: 18, color: "bg-amber-400" },
              { name: "Other", pct: 12, color: "bg-slate-200" },
            ].map(({ name, pct, color }) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{name}</span>
                  <span className="text-slate-400">{pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Hero ─── */
const HeroSection = () => (
  <section className="relative pt-16 pb-28 overflow-hidden max-w-7xl mx-auto">
    {/* Ambient glows */}
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/8 blur-[140px] rounded-full" />
      <div className="absolute top-[30%] right-[-5%] w-[350px] h-[350px] bg-indigo-400/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] bg-emerald-400/8 blur-[100px] rounded-full" />
    </div>

    <div className="container mx-auto px-4">
      {/* Pill badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Wealth Management
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="mt-6 text-center text-5xl md:text-[72px] font-bold text-text-main tracking-tight leading-[1.05]"
      >
        Your money,{" "}
        <span className="relative inline-block">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-violet-500">
            finally
          </span>
        </span>{" "}
        under control.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="mt-7 text-center text-lg text-text-muted max-w-xl mx-auto leading-relaxed"
      >
        Track income, manage expenses, and hit your savings goals — all in one beautiful
        dashboard built for people who take their finances seriously.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <Link
          to="/signup"
          className="group w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-base shadow-xl shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
        >
          Start for Free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          to="/login"
          className="group w-full sm:w-auto px-8 py-4 bg-white text-text-main border border-slate-200 rounded-2xl font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          See Live Demo
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </motion.div>

      {/* Social proof row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-15 flex items-center justify-center gap-6 flex-wrap"
      >
        <div className="flex -space-x-2">
          {["bg-violet-400", "bg-sky-400", "bg-emerald-400", "bg-amber-400", "bg-rose-400"].map(
            (c, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full border-2 border-white ${c} flex items-center justify-center text-white text-[10px] font-bold`}
              >
                {String.fromCharCode(65 + i)}
              </div>
            )
          )}
        </div>
        <p className="text-sm text-text-muted">
          Trusted by <span className="font-bold text-text-main">12,400+</span> users
        </p>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-sm font-bold text-text-main ml-1">4.9</span>
        </div>
      </motion.div>

      {/* Dashboard mockup with floating badges */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16 relative max-w-4xl mx-auto"
      >
        <FloatingBadge className="-top-4 -left-6">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-700">Saved $340 this month</span>
        </FloatingBadge>
        <FloatingBadge className="-top-4 -right-6">
          <Bell className="w-4 h-4 text-primary" />
          <span className="text-slate-700">Budget alert: Food 80%</span>
        </FloatingBadge>
        <FloatingBadge className="-bottom-4 left-8">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-slate-700">Net worth +12.4% YTD</span>
        </FloatingBadge>

        <DashboardMockup />
      </motion.div>
    </div>
  </section>
);

/* ─── Stats Band ─── */
const StatsBand = () => (
  <section className="py-14 border-y border-slate-100 bg-white">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-slate-100">
        {[
          { value: "$2.1B+", label: "Tracked by users" },
          { value: "12,400+", label: "Active members" },
          { value: "38%", label: "Avg. savings increase" },
          { value: "4.9★", label: "App store rating" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center px-4">
            <p className="text-3xl md:text-4xl font-bold text-text-main">{value}</p>
            <p className="text-sm text-text-muted mt-1.5 font-medium">{label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Feature Card ─── */
const FeatureCard = ({ icon: Icon, title, desc, badge, delay, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ delay, duration: 0.55, ease: "easeOut" }}
    className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/15 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
  >
    {/* Subtle hover glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/3 group-hover:to-indigo-500/3 transition-all duration-500 rounded-3xl" />
    
    {badge && (
      <span className="absolute top-6 right-6 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
        {badge}
      </span>
    )}
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-primary bg-primary/8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300`}>
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-xl font-bold text-text-main mb-3">{title}</h3>
    <p className="text-text-muted leading-relaxed text-sm">{desc}</p>
  </motion.div>
);

/* ─── Features ─── */
const Features = () => (
  <section className="py-28 bg-slate-50/60 max-w-7xl mx-auto">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest border border-primary/15">
          Features
        </span>
        <h2 className="mt-5 text-3xl md:text-5xl font-bold text-text-main leading-tight">
          Everything your wallet <br className="hidden md:block" /> has been asking for.
        </h2>
        <p className="mt-4 text-text-muted max-w-lg mx-auto">
          Powerful tools that turn financial confusion into confident clarity.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={TrendingUp}
          title="Smart Tracking"
          desc="Log transactions in seconds and let AI auto-categorize them. No more manual sorting — just instant clarity."
          badge="AI"
          delay={0.05}
        />
        <FeatureCard
          icon={PieChart}
          title="Budget Planner"
          desc="Set spending caps per category. Get proactive alerts before you overspend, not after."
          delay={0.15}
        />
        <FeatureCard
          icon={BarChart3}
          title="Rich Insights"
          desc="Interactive charts reveal spending patterns over time. Spot trends, cut waste, build wealth."
          delay={0.25}
        />
        <FeatureCard
          icon={Target}
          title="Savings Goals"
          desc="Define milestones — emergency fund, dream vacation, new car — and track your progress in real time."
          delay={0.1}
        />
        <FeatureCard
          icon={Bell}
          title="Smart Alerts"
          desc="Customizable notifications keep you on track — weekly summaries, bill reminders, budget warnings."
          delay={0.2}
        />
        <FeatureCard
          icon={ShieldCheck}
          title="Bank-Level Security"
          desc="256-bit encryption, two-factor auth, and read-only bank connections. Your data is always yours."
          delay={0.3}
        />
      </div>
    </div>
  </section>
);

/* ─── How It Works ─── */
const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Connect your accounts",
      desc: "Securely link bank accounts, cards, and wallets in minutes. We support 10,000+ institutions.",
    },
    {
      num: "02",
      title: "Transactions auto-organize",
      desc: "Our AI categorizes every transaction instantly. Edit with one tap whenever needed.",
    },
    {
      num: "03",
      title: "Set goals & budgets",
      desc: "Define what you're saving for and set category spending limits. We'll keep you on track.",
    },
    {
      num: "04",
      title: "Watch your wealth grow",
      desc: "Review weekly reports, fine-tune habits, and hit your targets faster than you thought possible.",
    },
  ];

  return (
    <section className="py-28 bg-white ">
      <div className="container mx-auto px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest border border-primary/15">
            How It Works
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-bold text-text-main">
            Up and running in minutes.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-primary/8 border border-primary/15 flex items-center justify-center mx-auto mb-5 relative">
                <span className="text-2xl font-black text-primary">{step.num}</span>
              </div>
              <h3 className="text-base font-bold text-text-main mb-2">{step.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Testimonials ─── */
const testimonials = [
  {
    quote: "I finally stopped living paycheck to paycheck. Within 3 months I had a $2,000 emergency fund.",
    name: "Sarah K.",
    role: "Graphic Designer",
    initials: "SK",
    color: "bg-violet-100 text-violet-700",
  },
  {
    quote: "The budget alerts are game-changing. I used to overspend on dining out every single month.",
    name: "Marcus T.",
    role: "Software Engineer",
    initials: "MT",
    color: "bg-sky-100 text-sky-700",
  },
  {
    quote: "Cleaner UI than any finance app I've tried. The dashboard actually makes me excited to check my money.",
    name: "Priya M.",
    role: "Product Manager",
    initials: "PM",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const Testimonials = () => (
  <section className="py-28 bg-slate-50/60 max-w-7xl mx-auto">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-text-main">
          People are saving more. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">
            A lot more.
          </span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map(({ quote, name, role, initials, color }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.55 }}
            className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm"
          >
            <div className="flex mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-text-main leading-relaxed font-medium mb-6">"{quote}"</p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${color}`}>
                {initials}
              </div>
              <div>
                <p className="font-bold text-text-main text-sm">{name}</p>
                <p className="text-xs text-text-muted">{role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── CTA ─── */
const CtaSection = () => (
  <section className="py-24 px-4 max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto max-w-7xl"
    >
      <div className="relative bg-primary rounded-[40px] p-12 md:p-20 text-center text-white overflow-hidden shadow-2xl shadow-primary/40">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute top-6 right-8 opacity-30">
          <ArrowUpRight className="w-28 h-28" />
        </div>

        <span className="relative z-10 inline-block px-4 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 mb-7">
          Limited Time — No Credit Card Required
        </span>

        <h2 className="relative z-10 text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Your best financial year <br /> starts today.
        </h2>
        <p className="relative z-10 text-white/70 mb-10 text-lg max-w-md mx-auto">
          Join 12,400+ people building real wealth with smarter spending habits.
        </p>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-primary rounded-2xl font-black text-lg hover:bg-slate-100 transition-all active:scale-95 shadow-xl"
          >
            Join Free — Start Now
            <Zap className="w-5 h-5 fill-current" />
          </Link>
          <Link to="/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
            View live demo →
          </Link>
        </div>
      </div>
    </motion.div>
  </section>
);


/* ─── Root ─── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      
      <HeroSection />
      <StatsBand />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
    </div>
  );
}
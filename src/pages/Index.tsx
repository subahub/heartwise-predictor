import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Activity, BarChart3, MapPin, Bell, ArrowRight, CheckCircle2, Users, Stethoscope, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const stats = [
  { value: '70,000+', label: 'Patient Records Analyzed' },
  { value: '93.5%', label: 'Prediction Accuracy' },
  { value: '11', label: 'Risk Factors Tracked' },
  { value: '24/7', label: 'Health Monitoring' },
];

const features = [
  { icon: Brain, title: 'AI-Powered Prediction', desc: 'Gradient Boosting model trained on 70K+ patient records for reliable risk assessment.' },
  { icon: Activity, title: 'Real-Time Analysis', desc: 'Enter your health metrics and receive instant cardiovascular risk scoring.' },
  { icon: BarChart3, title: 'Health Tracking', desc: 'Monitor your heart health trends over time with interactive visualizations.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your health data is encrypted and never shared with third parties.' },
  { icon: MapPin, title: 'Hospital Finder', desc: 'Locate nearby cardiac care centers with directions and contact info.' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Get notified about risk changes and personalized health recommendations.' },
];

const steps = [
  { num: '01', title: 'Enter Your Health Data', desc: 'Provide basic health metrics like blood pressure, cholesterol, and lifestyle info.' },
  { num: '02', title: 'AI Analyzes Your Risk', desc: 'Our trained ML model evaluates 11 risk factors to generate your CVD risk score.' },
  { num: '03', title: 'Get Actionable Insights', desc: 'Receive personalized recommendations and track your progress over time.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 pt-28 pb-16 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card border border-primary/30 text-primary-foreground text-sm">
                <Heart className="h-4 w-4 text-primary fill-primary" />
                17.9 million lives lost every year — let's change that
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                Your Heart Speaks.
                <span className="block gradient-text">We Help You Listen.</span>
              </h1>
              <p className="text-lg text-primary-foreground/70 max-w-lg">
                CardioGuard uses machine learning trained on 70,000+ patient records to assess your cardiovascular risk — helping you take action before it's too late.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/register">
                  <Button size="lg" className="gap-2 text-base px-6">
                    Start Free Assessment <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-base px-6 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                    Sign In
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-2 text-sm text-primary-foreground/60">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Free to use</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> No credit card</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> HIPAA aware</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:block">
              <div className="relative">
                <img src={heroImage} alt="Cardiovascular health visualization" className="rounded-2xl shadow-2xl w-full heartbeat-glow" />
                <div className="absolute -bottom-4 -left-4 glass-card rounded-xl px-4 py-3 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-risk-low/20 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-risk-low" />
                    </div>
                    <div>
                      <p className="text-xs text-primary-foreground/60">Risk Score</p>
                      <p className="font-heading font-bold text-primary-foreground">Low — 23/100</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="font-heading text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Comprehensive Heart Health Platform</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Everything you need to monitor, predict, and improve your cardiovascular health — powered by advanced machine learning.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }}
                className="bg-card rounded-xl p-6 card-glow border border-border hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground mt-3">Three simple steps to understand your heart health.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading text-xl font-bold mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Trusted by Healthcare Professionals</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Dr. Sarah Mitchell', role: 'Cardiologist', quote: 'CardioGuard helps me identify at-risk patients earlier. The prediction accuracy is impressive for a screening tool.' },
              { name: 'James Rodriguez', role: 'Patient, Age 52', quote: 'This tool flagged my elevated risk before I had any symptoms. My doctor confirmed the findings and we started preventive treatment.' },
              { name: 'Dr. Priya Sharma', role: 'Family Medicine', quote: 'I recommend CardioGuard to all my patients over 40. It makes cardiovascular screening accessible and understandable.' },
            ].map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border card-glow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {i === 0 || i === 2 ? <Stethoscope className="h-5 w-5 text-primary" /> : <Users className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">"{t.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-6">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">Take Control of Your Heart Health Today</h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto">Early detection saves lives. Get your free cardiovascular risk assessment in under 2 minutes.</p>
            <Link to="/register">
              <Button size="lg" className="gap-2 text-base px-8 mt-2">
                Start Free Assessment <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

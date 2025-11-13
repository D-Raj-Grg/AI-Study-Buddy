"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Brain, BookOpen, Lightbulb, Sparkles, ArrowRight, CheckCircle2, Zap, Target, TrendingUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { Logo } from "@/components/logo"

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: "AI Quiz Generator",
      description: "Transform any topic into comprehensive quizzes with multiple choice, true/false, and short answer questions. Instant feedback and detailed explanations.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: BookOpen,
      title: "Smart Flashcards",
      description: "Auto-generate interactive flashcards with spaced repetition. Track your progress and master concepts faster with intelligent learning algorithms.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Lightbulb,
      title: "Concept Explainer",
      description: "Get crystal-clear explanations for complex topics with examples, analogies, and visual breakdowns. Adjustable complexity levels for any learner.",
      gradient: "from-emerald-500 to-teal-500",
    },
  ]

  const stats = [
    { label: "Learning Sessions", value: "10,000+", icon: Target },
    { label: "Study Accuracy", value: "95%", icon: TrendingUp },
    { label: "User Satisfaction", value: "4.9/5", icon: Star },
  ]

  const steps = [
    {
      step: "01",
      title: "Enter Your Topic",
      description: "Type any subject you want to learn - from quantum physics to ancient history.",
    },
    {
      step: "02",
      title: "AI Generates Content",
      description: "Our AI instantly creates quizzes, flashcards, or explanations tailored to your needs.",
    },
    {
      step: "03",
      title: "Learn & Master",
      description: "Study at your own pace with interactive tools and track your progress in real-time.",
    },
  ]

  const testimonials = [
    {
      quote: "This tool transformed my study routine. I went from struggling to acing my exams!",
      author: "Sarah Chen",
      role: "Medical Student",
      rating: 5,
    },
    {
      quote: "The AI-generated quizzes are incredibly accurate and help me learn faster than ever.",
      author: "Marcus Johnson",
      role: "Software Engineer",
      rating: 5,
    },
    {
      quote: "Finally, a study tool that actually understands how I learn. Game changer!",
      author: "Emily Rodriguez",
      role: "High School Teacher",
      rating: 5,
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-950/30 opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-100/50 via-transparent to-transparent dark:from-purple-950/30 opacity-60" />

      {/* Header */}
      <header className="relative z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Logo size={32} />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Study Buddy
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                How It Works
              </Link>
              <Link href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                Testimonials
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ModeToggle />
              <Link href="/dashboard">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-purple-500/20"
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Powered by Advanced AI
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                Learn Smarter,
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Not Harder
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Transform any topic into interactive quizzes, flashcards, and crystal-clear explanations.
              Your AI-powered study companion for mastering any subject.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/30 dark:shadow-blue-900/50 group"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/quiz/new">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Try a Quiz
                </Button>
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 text-sm text-slate-600 dark:text-slate-400"
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{stat.value}</span>
                    <span>{stat.label}</span>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Everything You Need to Excel
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Powerful AI tools designed to make learning more effective and enjoyable
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-8 h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 group">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="container mx-auto px-4 py-20 bg-gradient-to-br from-slate-100/50 to-transparent dark:from-slate-900/50 dark:to-transparent">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Get started in three simple steps
              </p>
            </motion.div>

            <div className="space-y-8">
              {steps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">
                          {item.title}
                        </h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <CheckCircle2 className="flex-shrink-0 w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Loved by Students Worldwide
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Join thousands who&apos;ve transformed their learning
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.author[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 border-0 text-white text-center shadow-2xl">
              <Zap className="w-16 h-16 mx-auto mb-6 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of students achieving their goals with AI-powered study tools
              </p>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-slate-100 shadow-xl"
                >
                  Start Learning for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <p className="text-sm mt-4 text-blue-100">
                No credit card required · Get started in seconds
              </p>
            </Card>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Logo size={28} />
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Study Buddy
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your AI-powered study companion for mastering any subject.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><Link href="/quiz/new" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Quiz Generator</Link></li>
                  <li><Link href="/flashcards/new" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Flashcards</Link></li>
                  <li><Link href="/explain" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Explainer</Link></li>
                  <li><Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Dashboard</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><Link href="#how-it-works" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">How It Works</Link></li>
                  <li><Link href="#features" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Features</Link></li>
                  <li><Link href="#testimonials" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Testimonials</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><Link href="https://github.com/D-Raj-Grg/AI-Study-Buddy" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">GitHub</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-600 dark:text-slate-400">
              <p>© 2025 Study Buddy. Built with AI to make learning more effective and engaging.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

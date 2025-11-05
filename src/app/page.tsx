"use client";

import { Button } from "@/components/ui/homeButton";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/homeCard";
import { ArrowRight, Zap, Shield, Palette, Star } from "lucide-react";

const HomePage = () => {
  const router = useRouter();
  const year = new Date().getFullYear();

  const handleClick = () => {
    router.push("/administrator");
  };

  return (
    <div className="min-h-screen bg-gradient-hero bg-black">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent select-none tracking-wide">
            Doomshell
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClick}
              className="text-white/80 rounded-lg hover:bg-gradient-to-r from-[#230045] to-cyan-400  hover:text-white transition-all duration-300 rounded-lg px-4 py-2"
            >
              My Dashboards
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:bg-gradient-to-r from-[#230045] to-cyan-400  hover:text-white transition-all duration-300 rounded-lg px-4 py-2"
            >
              Pricing
            </Button>
            <Button
              variant="hero"
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold hover:scale-105 transition-transform duration-300 shadow-md"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32 relative">
        <div className="text-center max-w-4xl mx-auto animate-fade-in relative z-10">
          {/* Gradient Glow Background */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/30 via-cyan-400/20 to-pink-500/0 rounded-full animate-glow-pulse pointer-events-none z-0" />

          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
            Premium Dashboards
            <br />
            <span className="bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 bg-clip-text text-transparent font-extrabold tracking-wide">
              Built for Excellence
            </span>
          </h1>

          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Discover stunning, production-ready dashboard designs that elevate your SaaS products.
            Built with modern tech, optimized for performance.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Button
              variant="hero"
              size="lg"
              className="text-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Browse Dashboards <ArrowRight className="ml-2" />
            </Button>
            <Button
              variant="glass"
              size="lg"
              className="text-white/80 border border-white/30 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              View Pricing
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-5xl mx-auto animate-scale-in">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-400 opacity-20 blur-3xl rounded-3xl" />
            <img
              src="./assest/hero-dashboard.jpg"
              alt="Dashboard Preview"
              className="relative rounded-2xl border border-white/20 shadow-[0_0_80px_rgba(139,92,246,0.5)] w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 text-white">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-white">Why Choose Doomshell?</h2>
          <p className="text-muted-foreground text-lg text-gray-800 ">
            Professional dashboards designed for modern applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all animate-fade-in">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <Zap className="text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Optimized for performance with modern frameworks and best practices.
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all animate-fade-in">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <Palette className="text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Beautiful Design</h3>
            <p className="text-muted-foreground">
              Stunning visuals with attention to detail and modern aesthetics.
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all animate-fade-in">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <Shield className="text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Production Ready</h3>
            <p className="text-muted-foreground">
              Enterprise-grade code that's ready to deploy and scale.
            </p>
          </Card>
        </div>
      </section>

      {/* Dashboard Showcase */}
      <section className="container mx-auto px-4 py-20 text-white">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-white ">Featured Dashboards</h2>
          <p className="text-muted-foreground text-lg">
            Handcrafted designs for every use case
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all cursor-pointer animate-fade-in">
            <div className="relative overflow-hidden">
              <img
                src={"./assest/dashboard-preview-1.jpg"}
                alt="Analytics Dashboard"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-secondary fill-secondary" />
                <span className="text-sm text-muted-foreground">4.9 / 5.0</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Pro</h3>
              <p className="text-muted-foreground mb-4">
                Complete analytics solution with charts, metrics, and insights.
              </p>
              <Button variant="hero" className="w-full">
                View Details
              </Button>
            </div>
          </Card>

          <Card className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all cursor-pointer animate-fade-in">
            <div className="relative overflow-hidden">
              <img
                src={"./assest/dashboard-preview-2.jpg"}
                alt="Sales Dashboard"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-secondary fill-secondary" />
                <span className="text-sm text-muted-foreground">5.0 / 5.0</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sales Command</h3>
              <p className="text-muted-foreground mb-4">
                E-commerce dashboard with revenue tracking and metrics.
              </p>
              <Button variant="hero" className="w-full">
                View Details
              </Button>
            </div>
          </Card>

          <Card className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all cursor-pointer animate-fade-in">
            <div className="relative overflow-hidden">
              <img
                src={"./assest/dashboard-preview-3.jpg"}
                alt="Project Dashboard"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-secondary fill-secondary" />
                <span className="text-sm text-muted-foreground">4.8 / 5.0</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Project Nexus</h3>
              <p className="text-muted-foreground mb-4">
                Team collaboration dashboard for project management.
              </p>
              <Button variant="hero" className="w-full">
                View Details
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-white">
        <Card className="relative overflow-hidden bg-gradient-primary p-12 lg:p-20 text-center animate-fade-in">
          <div className="absolute inset-0 bg-gradient-radial opacity-30" />
          <div className="relative">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
              Ready to Transform Your Dashboard?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and companies building exceptional products with Doomshell.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="secondary" size="lg" className="text-lg">
                Start Free Trial <ArrowRight className="ml-2" />
              </Button>
              <Button variant="glass" size="lg" className="text-lg text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent select-none tracking-wide">
                Doomshell
              </div>
              <p className="text-muted-foreground text-sm text-white">
                Premium dashboard designs for modern applications.
              </p>
            </div>
            <div>
              <h2 className="font-semibold mb-4 text-white">Product</h2>
              <ul className="space-y-2 text-sm text-muted-foreground text-white">
                <li className="hover:text-foreground cursor-pointer transition-colors">Dashboards</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Documentation</li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold mb-4 text-white">Company</h2>
              <ul className="space-y-2 text-sm text-muted-foreground text-white">
                <li className="hover:text-foreground cursor-pointer transition-colors">About</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold mb-4 text-white ">Legal</h2>
              <ul className="space-y-2 text-sm text-muted-foreground text-white">
                <li className="hover:text-foreground cursor-pointer transition-colors">Privacy</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Terms</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">License</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground text-[#c4c4c4]">
            © {year} Doomshell Dashboards. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
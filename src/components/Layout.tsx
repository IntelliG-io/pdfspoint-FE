
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full glass border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          <Link 
            to="/" 
            className="flex items-center gap-2 smooth-transition hover:opacity-80"
          >
            <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              <span>P</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-primary"></span>
            </div>
            <span className="font-medium text-lg">PaperFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary smooth-transition">Home</Link>
            <Link to="/tools" className="text-sm font-medium hover:text-primary smooth-transition">All Tools</Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary smooth-transition">Pricing</Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary smooth-transition">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-primary smooth-transition hidden md:block">
              Sign In
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-primary/90 smooth-transition">
              Sign Up Free
            </button>
          </div>
        </div>
      </header>

      <main className={cn("flex-1", className)}>
        {children}
      </main>

      <footer className="w-full border-t border-border/40 py-6 md:py-12 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">About</Link></li>
                <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">Contact</Link></li>
                <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Products</h3>
              <ul className="space-y-2">
                <li><Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">All Tools</Link></li>
                <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">Pricing</Link></li>
                <li><Link to="/enterprise" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">Blog</Link></li>
                <li><Link to="/help" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">Help Center</Link></li>
                <li><Link to="/developers" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">Developers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">Privacy</Link></li>
                <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">Terms</Link></li>
                <li><Link to="/security" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">
                <span>P</span>
              </div>
              <span className="text-sm font-medium">PaperFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PaperFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground smooth-transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground smooth-transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground smooth-transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground smooth-transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

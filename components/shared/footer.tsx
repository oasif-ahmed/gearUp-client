import Link from 'next/link';
import { Rocket, GitBranch, MessageSquare, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#d8d2c6] dark:border-zinc-800 bg-[#ede8df] dark:bg-[#1a1918] text-[#6b655f] dark:text-zinc-400 py-12 transition-colors duration-300 font-mono">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-none bg-[#2c2a29] dark:bg-zinc-100 text-[#f4f1ea] dark:text-zinc-900">
                <Rocket className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold tracking-tight text-[#2c2a29] dark:text-white font-serif">
                Gear Up Client
              </span>
            </div>
            
            <p className="text-xs text-[#6b655f] dark:text-zinc-400 max-w-sm leading-relaxed font-mono">
              The ultimate platform for gear rental. Find, rent, and return equipment with confidence and precision.
            </p>

            {/* Social / Link Icons */}
            <div className="flex space-x-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-none border border-[#d8d2c6] dark:border-zinc-700 bg-[#f4f1ea] dark:bg-zinc-900 flex items-center justify-center text-[#6b655f] dark:text-zinc-400 hover:text-[#2c2a29] dark:hover:text-white hover:border-[#2c2a29] dark:hover:border-zinc-100 transition-colors"
                aria-label="GitHub"
              >
                <GitBranch className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-none border border-[#d8d2c6] dark:border-zinc-700 bg-[#f4f1ea] dark:bg-zinc-900 flex items-center justify-center text-[#6b655f] dark:text-zinc-400 hover:text-[#2c2a29] dark:hover:text-white hover:border-[#2c2a29] dark:hover:border-zinc-100 transition-colors"
                aria-label="Community"
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-none border border-[#d8d2c6] dark:border-zinc-700 bg-[#f4f1ea] dark:bg-zinc-900 flex items-center justify-center text-[#6b655f] dark:text-zinc-400 hover:text-[#2c2a29] dark:hover:text-white hover:border-[#2c2a29] dark:hover:border-zinc-100 transition-colors"
                aria-label="Website"
              >
                <Globe className="h-3.5 w-3.5" />
              </a>
              <a
                href="mailto:contact@gearuclient.com"
                className="h-8 w-8 rounded-none border border-[#d8d2c6] dark:border-zinc-700 bg-[#f4f1ea] dark:bg-zinc-900 flex items-center justify-center text-[#6b655f] dark:text-zinc-400 hover:text-[#2c2a29] dark:hover:text-white hover:border-[#2c2a29] dark:hover:border-zinc-100 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#2c2a29] dark:text-white font-semibold mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#2c2a29] dark:hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/gear-items" className="hover:text-[#2c2a29] dark:hover:text-white transition-colors">Browse Gear</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#2c2a29] dark:hover:text-white transition-colors">Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#2c2a29] dark:hover:text-white transition-colors">Register</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#2c2a29] dark:text-white font-semibold mb-3">
              Support
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-[#2c2a29] dark:hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2c2a29] dark:hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2c2a29] dark:hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2c2a29] dark:hover:text-white transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[#d8d2c6] dark:border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs font-mono text-[#a39c94] dark:text-zinc-500">
            <p>© {new Date().getFullYear()} Gear Up Client. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Engineered for gear enthusiasts.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
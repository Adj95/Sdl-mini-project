'use client';

import Link from 'next/link';
import { Zap, Smartphone, BarChart3, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">EnergyHub</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-white hover:bg-slate-700 rounded">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Smart Energy Management
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Control your devices, monitor energy usage, and optimize your home with intelligent automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold">
              Go to Dashboard
            </Link>
            <Link href="/register" className="px-8 py-3 border border-slate-600 text-white hover:bg-slate-800 rounded-lg text-lg font-semibold">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose EnergyHub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-700/50 p-8 rounded-lg border border-slate-600/50 hover:border-blue-500/50 transition">
              <Smartphone className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Smart Control</h3>
              <p className="text-slate-300">Control all your devices from one unified dashboard. Real-time updates and instant feedback.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-700/50 p-8 rounded-lg border border-slate-600/50 hover:border-blue-500/50 transition">
              <BarChart3 className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Energy Analytics</h3>
              <p className="text-slate-300">Detailed analytics and insights into your energy consumption patterns to save costs.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-700/50 p-8 rounded-lg border border-slate-600/50 hover:border-blue-500/50 transition">
              <Lock className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-slate-300">Enterprise-grade security to keep your data and devices safe at all times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-blue-500 mb-2">50K+</div>
            <p className="text-slate-300">Active Users</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-green-500 mb-2">40%</div>
            <p className="text-slate-300">Energy Saved</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-purple-500 mb-2">24/7</div>
            <p className="text-slate-300">Support Available</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-y border-slate-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 mb-8">Join thousands of users who are already saving energy and money.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold">
              Get Started Free
            </Link>
            <Link href="/login" className="px-8 py-3 border border-slate-600 text-white hover:bg-slate-800 rounded-lg text-lg font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} EnergyHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

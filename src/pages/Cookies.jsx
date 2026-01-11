import React from 'react';
import { TrendingUp, ArrowLeft } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <a href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </a>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
          </div>
          <p className="text-slate-400">Last updated: January 11, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">1. What Are Cookies?</h2>
            <p className="text-slate-300 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and analyze how you use the site. B2B Data Tracker uses cookies to enhance your experience and understand how our Service is used.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">2. Types of Cookies We Use</h2>
            
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-green-400 mb-3">Essential Cookies</h3>
              <p className="text-slate-300 leading-relaxed mb-3">
                <strong>Purpose:</strong> Remember your cookie consent preference
              </p>
              <p className="text-slate-300 leading-relaxed mb-3">
                <strong>Duration:</strong> Permanent (until you clear browser data)
              </p>
              <p className="text-slate-300 leading-relaxed mb-3">
                <strong>Can you decline?</strong> No - Required for the cookie consent system to function
              </p>
              <p className="text-slate-300 leading-relaxed">
                <strong>Stored:</strong> Locally in your browser (localStorage)
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">Analytics Cookies (Optional)</h3>
              <p className="text-slate-300 leading-relaxed mb-3">
                <strong>Provider:</strong> Self-hosted (B2B Data Tracker)
              </p>
              <p className="text-slate-300 leading-relaxed mb-3">
                <strong>Purpose:</strong> Understand website usage, feature popularity, and user behavior to improve the tool
              </p>
              <p className="text-slate-300 leading-relaxed mb-3">
                <strong>Data collected:</strong> Anonymous session ID, feature usage (snapshots created, comparisons made), browser info, language, referral source
              </p>
              <p className="text-slate-300 leading-relaxed mb-3">
                <strong>Duration:</strong> Session-based (expires when you close your browser)
              </p>
              <p className="text-slate-300 leading-relaxed mb-3">
                <strong>Third-party sharing:</strong> None - all data stays on our servers
              </p>
              <p className="text-slate-300 leading-relaxed">
                <strong>Can you decline?</strong> Yes - Decline or accept via the cookie banner
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">3. Why We Use Cookies</h2>
            <p className="text-slate-300 leading-relaxed mb-3">We use cookies to:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Remember your cookie preferences</li>
              <li>Understand which features are most popular</li>
              <li>Identify areas for improvement</li>
              <li>Measure website performance</li>
              <li>Track usage trends over time</li>
              <li>Plan future features based on user behavior</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">4. Third-Party Cookies</h2>
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-3">Good News!</h3>
              <p className="text-slate-300 leading-relaxed">
                We do NOT use any third-party cookies or tracking services. All analytics are processed on our own servers, giving you complete privacy and control over your data.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">5. Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-4">On Our Website</h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              You can change your cookie preferences at any time by:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Clicking the cookie banner when you first visit</li>
              <li>Clearing your browser's local storage (this resets your preference)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">In Your Browser</h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              You can also control cookies through your browser settings:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-3 text-sm italic">
              Note: Blocking all cookies may impact website functionality on some sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">6. Do Not Track (DNT)</h2>
            <p className="text-slate-300 leading-relaxed">
              Some browsers have a "Do Not Track" (DNT) feature. When you enable DNT and decline cookies, we respect your choice and will not track your activity with analytics cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">7. What Happens If You Decline Cookies?</h2>
            <p className="text-slate-300 leading-relaxed">
              If you decline analytics cookies, the core functionality of B2B Data Tracker remains fully available. You can still:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Create and download snapshots</li>
              <li>Compare snapshots</li>
              <li>Use all features without limitations</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-3">
              Declining cookies only prevents us from collecting anonymous usage statistics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">8. Updates to This Cookie Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. The "Last updated" date at the top indicates when changes were last made.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">9. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have questions about our use of cookies, please contact us at b2bdata.net or review our Privacy Policy for more information.
            </p>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <span className="font-semibold">B2B Data Tracker</span>
            </div>
            <div className="text-slate-500 text-sm space-y-1">
              <p>© 2025 B2B Data Tracker. All rights reserved.</p>
              <p>Created by Georgios Trochidis</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CookiePolicy;
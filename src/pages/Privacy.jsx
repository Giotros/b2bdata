import React from 'react';
import { TrendingUp, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-slate-400">Last updated: January 11, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">1. Introduction</h2>
            <p className="text-slate-300 leading-relaxed">
              B2B Data Tracker ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard information when you use our Service at b2bdata.net.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">2. Data We Collect</h2>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-4">2.1 Analytics Data</h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              When you consent to cookies, we collect privacy-friendly analytics data through our own self-hosted analytics system, including:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Pages visited and features used (snapshots created, comparisons made)</li>
              <li>Anonymous session identifiers (no personal data)</li>
              <li>Browser type and device information (user agent, screen resolution)</li>
              <li>Language preference</li>
              <li>Referral source (how you found our site)</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-3">
              <strong>Important:</strong> We do NOT use third-party analytics services like Google Analytics. All analytics are processed on our own servers and are never shared with external parties.
            </p>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">2.2 XML Data</h3>
            <p className="text-slate-300 leading-relaxed">
              <strong>Important:</strong> All XML data you input (via URL, file upload, or paste) is processed entirely in your browser. We do NOT store, transmit, or have access to your XML data or generated snapshots on our servers.
            </p>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">2.3 Technical Data</h3>
            <p className="text-slate-300 leading-relaxed">
              Our hosting provider (Vercel) may collect standard server logs including IP addresses, timestamps, and request details for security and performance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">3. How We Use Your Data</h2>
            <p className="text-slate-300 leading-relaxed mb-3">We use collected data to:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Understand how users interact with our Service</li>
              <li>Improve website functionality and user experience</li>
              <li>Analyze usage patterns and trends</li>
              <li>Maintain and optimize website performance</li>
              <li>Detect and prevent technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">4. Legal Basis for Processing (GDPR)</h2>
            <p className="text-slate-300 leading-relaxed mb-3">
              For users in the European Economic Area, we process your data based on:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Consent:</strong> For analytics cookies and tracking</li>
              <li><strong>Legitimate Interest:</strong> For essential website functionality and security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">5. Data Sharing and Third Parties</h2>
            <p className="text-slate-300 leading-relaxed mb-3">
              We share minimal data with the following service:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Vercel:</strong> Our hosting provider (for infrastructure and performance)</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-3">
              We do NOT use third-party analytics services. We do NOT sell, rent, or trade your personal data to third parties for any purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-slate-300 leading-relaxed mb-3">
              We use cookies for:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Essential Cookies:</strong> To remember your cookie consent preference (stored locally in your browser)</li>
              <li><strong>Analytics Session ID:</strong> Anonymous session identifier for tracking usage patterns (only if you accept cookies)</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-3">
              You can decline cookies at any time. Declining will only affect analytics tracking; the core functionality of the Service will remain fully available.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">7. Data Retention</h2>
            <p className="text-slate-300 leading-relaxed">
              Analytics data is retained for operational purposes only and automatically purged when storage limits are reached. Your XML data and snapshots are NEVER stored on our servers—they remain only in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">8. Your Rights (GDPR & CCPA)</h2>
            <p className="text-slate-300 leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Access:</strong> Request what data we have about you</li>
              <li><strong>Deletion:</strong> Request deletion of your data</li>
              <li><strong>Opt-Out:</strong> Decline or revoke cookie consent at any time</li>
              <li><strong>Portability:</strong> Request a copy of your data</li>
              <li><strong>Object:</strong> Object to data processing</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-3">
              To exercise these rights, contact us at b2bdata.net.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">9. Children's Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              Our Service is not intended for children under 16. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">10. International Data Transfers</h2>
            <p className="text-slate-300 leading-relaxed">
              Our Service is hosted on servers that may be located outside your country. By using the Service, you consent to the transfer of your data to these locations. We ensure appropriate safeguards are in place.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">11. Changes to This Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last updated" date and, where appropriate, by email or notice on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">12. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              For questions about this Privacy Policy or your data, please contact us at b2bdata.net.
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

export default PrivacyPolicy;
import React from 'react';
import { TrendingUp, ArrowLeft } from 'lucide-react';

const TermsOfUse = () => {
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
            <h1 className="text-4xl font-bold">Terms of Use</h1>
          </div>
          <p className="text-slate-400">Last updated: January 11, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing and using B2B Data Tracker ("the Service"), you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">2. Description of Service</h2>
            <p className="text-slate-300 leading-relaxed mb-3">
              B2B Data Tracker is a free tool that allows users to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Create snapshots of supplier XML product feeds</li>
              <li>Compare snapshots to track pricing and inventory changes</li>
              <li>Analyze trends in supplier data over time</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-3">
              All processing is performed in your browser. We do not store your XML data or snapshots on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">3. User Responsibilities</h2>
            <p className="text-slate-300 leading-relaxed mb-3">You agree to:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Use the Service only for lawful purposes</li>
              <li>Not use the Service to violate any applicable laws or regulations</li>
              <li>Not attempt to gain unauthorized access to the Service or its systems</li>
              <li>Not use the Service in any way that could damage, disable, or impair it</li>
              <li>Ensure you have the right to access and use any XML feeds you provide to the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">4. Intellectual Property</h2>
            <p className="text-slate-300 leading-relaxed">
              The Service and its original content, features, and functionality are owned by Georgios Trochidis and are protected by international copyright, trademark, and other intellectual property laws. You retain all rights to the data you input into the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">5. Privacy and Data</h2>
            <p className="text-slate-300 leading-relaxed">
              Your use of the Service is also governed by our Privacy Policy. We process XML data entirely in your browser and do not store your product data on our servers. For more information, please review our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">6. Disclaimers and Limitations</h2>
            <p className="text-slate-300 leading-relaxed mb-3">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Accuracy, reliability, or completeness of data analysis</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Fitness for a particular purpose</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-3">
              We are not responsible for any business decisions made based on data analyzed through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">7. Limitation of Liability</h2>
            <p className="text-slate-300 leading-relaxed">
              In no event shall B2B Data Tracker or Georgios Trochidis be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">8. Changes to Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes by updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">9. Contact Information</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have questions about these Terms, please contact us through our website at b2bdata.net.
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

export default TermsOfUse;
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, UserCheck, ArrowLeft, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - LostFound',
  description: 'Learn how LostFound collects, protects, and handles personal data and listing information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="border-b border-slate-200 pb-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Privacy Policy</h1>
              <p className="text-sm text-slate-500">Effective Date: September 28, 2026</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mt-2">
            This Privacy Policy describes how LostFound (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, protects, and discloses personal information when you use our platform to report, browse, or claim lost and found items.
          </p>
        </div>

        <div className="space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              1. Information We Collect
            </h2>
            <p className="mb-3">
              We collect only the essential information necessary to facilitate the safe recovery of personal belongings:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>
                <strong className="text-slate-900">Account Information:</strong> First name, last name, email address, and contact phone number provided during account registration.
              </li>
              <li>
                <strong className="text-slate-900">Item Listings:</strong> Item title, category (Lost or Found), detailed description, optional photographs, and a custom secret verification question set by the poster.
              </li>
              <li>
                <strong className="text-slate-900">Claim Submissions:</strong> Answers submitted by community members in response to an item&apos;s secret verification question.
              </li>
              <li>
                <strong className="text-slate-900">Security & Operational Logs:</strong> Client IP addresses and request timestamps collected temporarily for sliding-window rate limiting, DDoS defense, and malicious abuse prevention.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-blue-600" />
              2. Strict Contact Number Privacy (Zero Public Disclosure)
            </h2>
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 mb-3">
              <p className="text-slate-800 font-medium text-sm">
                Your phone number is never displayed publicly or shared with unauthorized callers.
              </p>
            </div>
            <p className="text-slate-600">
              To prevent harassment, spam, and predatory behavior:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 mt-2">
              <li>Phone numbers are completely inaccessible from public feeds, listings, or search endpoints.</li>
              <li>A claimant can only view an item poster&apos;s contact number after submitting an answer to the secret verification question, and only after the item poster explicitly approves that answer.</li>
              <li>Unapproved or unauthorized inquiries for contact numbers are rejected by backend access controls with a 403 Forbidden status code.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              3. Data Security and Cryptographic Protections
            </h2>
            <p className="mb-3 text-slate-600">
              We apply defense-in-depth engineering practices to safeguard your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>
                <strong className="text-slate-900">Salted Bcrypt Password Hashing:</strong> Passwords are hashed using 12 salt rounds before being stored. Plaintext passwords are never saved, logged, or accessible to system administrators.
              </li>
              <li>
                <strong className="text-slate-900">Cryptographic JWT Sessions:</strong> User authentication is managed through RFC 7519 JSON Web Tokens signed with HS256 encryption. Tokens expire automatically after 7 days.
              </li>
              <li>
                <strong className="text-slate-900">Input Sanitization & Injection Defense:</strong> All form submissions are sanitized to neutralize cross-site scripting (XSS) and NoSQL operator injection attacks.
              </li>
              <li>
                <strong className="text-slate-900">Hardened HTTP Transport:</strong> We enforce Strict-Transport-Security (HSTS), Content-Security-Policy (CSP), and anti-clickjacking headers (X-Frame-Options: DENY).
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              4. Cookies and Local Storage
            </h2>
            <p className="text-slate-600">
              LostFound uses browser local storage strictly for essential session persistence (storing your authenticated login token so you remain signed in). We do not use third-party tracking pixels, advertising cookies, or behavioral trackers.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              5. Third-Party Sharing
            </h2>
            <p className="text-slate-600">
              We do not sell, rent, monetize, or trade your personal information to third parties or marketing platforms under any circumstances. Data is utilized exclusively for the operational functionality of the Lost and Found system.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              6. Your Rights & Data Retention
            </h2>
            <p className="text-slate-600 mb-2">
              You retain full control over your listings and personal details:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>You may edit or delete any item listing you created directly through the application interface.</li>
              <li>You may deactivate or reactivate your listings at any time.</li>
              <li>To request complete removal of your user account and historical claims, contact the administration using the information below.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="pt-4 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              7. Contact Us
            </h2>
            <p className="text-slate-600">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our security practices, please contact us at:
            </p>
            <p className="mt-2 font-mono text-sm text-blue-600">
              privacy@lostfound.org
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

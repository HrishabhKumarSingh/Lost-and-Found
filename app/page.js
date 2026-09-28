import Link from 'next/link';
import { Search, UserPlus, ClipboardList, ShieldCheck } from 'lucide-react';

export default function Home() {
  const steps = [
    {
      icon: <UserPlus className="w-6 h-6 text-blue-600" />,
      title: '1. Create an Account',
      description: 'Register with your verified email and contact number to report or claim belongings.',
      image: '/login-1.svg',
    },
    {
      icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
      title: '2. Post Details & Secret Question',
      description: 'Describe the item and define a secret verification question that only the true owner would know.',
      image: '/list-item.svg',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      title: '3. Verify & Exchange Contact',
      description: 'Review claim answers privately. Phone numbers are unlocked only after you approve a correct answer.',
      image: '/notification.svg',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-xs font-medium text-slate-300 mb-6">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                Community Directory
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                Community Lost and Found Directory
              </h1>
              <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                Report lost personal belongings, browse recovered items, and safely verify rightful ownership through private security questions before exchanging contact details.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Create an Account
                </Link>
                <Link
                  href="/feed"
                  className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Browse Directory
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="p-8 bg-slate-800/60 rounded-xl border border-slate-700/80">
                <img src="/lost-2.svg" alt="Lost and Found System" className="w-full max-w-md mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">How the System Works</h2>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
              A structured three-step workflow designed to prevent fraudulent claims and protect user privacy.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{step.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <img src={step.image} alt={step.title} className="w-full h-32 object-contain mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct CTA */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Report or Search for an Item</h2>
          <p className="text-slate-400 text-sm md:text-base mb-8 max-w-lg mx-auto">
            Access the community feed to view reported items or submit a listing with verified security questions.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

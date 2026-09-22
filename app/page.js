import Link from 'next/link';
import { Search, UserPlus, ClipboardList, Bell } from 'lucide-react';

export default function Home() {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: 'Create an Account',
      description: 'Sign up in seconds and join the community.',
      image: '/login-1.svg',
    },
    {
      icon: <ClipboardList className="w-8 h-8" />,
      title: 'List Lost / Found Item',
      description: 'Post details about items you\'ve lost or found.',
      image: '/list-item.svg',
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Get Notified',
      description: 'Receive updates when someone responds to your listing.',
      image: '/notification.svg',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.3),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-primary-200 mb-6">
                <Search className="w-4 h-4" />
                Lost & Found System
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Lost it? <br />
                <span className="text-primary-300">List it. Find it.</span>
              </h1>
              <p className="text-lg text-primary-200 mb-8 max-w-lg">
                A simple platform to report lost items and help reunite people with their belongings through a secure verification system.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-3 bg-white text-primary-900 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
                >
                  Get Started
                </Link>
                <a
                  href="#how-it-works"
                  className="px-8 py-3 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  How it works
                </a>
              </div>
            </div>
            <div className="relative z-10 hidden md:block">
              <img src="/lost-2.svg" alt="Lost and Found" className="w-full max-w-md mx-auto drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How it Works</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Three simple steps to find what you&apos;ve lost or return what you&apos;ve found.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white text-sm font-bold rounded-full flex items-center justify-center mx-auto" style={{ left: 'calc(50% + 20px)' }}>
                    {i + 1}
                  </span>
                </div>
                <img src={step.image} alt={step.title} className="w-48 h-36 object-contain mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-primary-200 text-lg mb-8">Join the community and help reunite people with their lost belongings.</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
          >
            Create an Account
          </Link>
        </div>
      </section>
    </div>
  );
}

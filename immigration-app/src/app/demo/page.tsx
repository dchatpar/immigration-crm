import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="text-2xl font-bold text-blue-700 hover:text-blue-800">
                  ImmigrationCRM
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/" className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
                    Home
                  </Link>
                  <Link href="/demo" className="rounded-md px-3 py-2 text-sm font-medium bg-blue-100 text-blue-700">
                    Demo
                  </Link>
                  <Link href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
                    Features
                  </Link>
                  <Link href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
                    Pricing
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            See Our Platform in Action
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of our Immigration CRM with an interactive demo.
            See how our platform can transform your case management workflow.
          </p>
        </div>

        {/* Demo Content */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Demo Video/Images */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-64 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="text-2xl font-bold">Interactive Demo</div>
                <div className="mt-4 text-lg">
                  Platform demonstration will appear here
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Platform Overview</h3>
              <p className="text-gray-600 mb-6">
                This demo showcases the key features of our Immigration CRM platform.
                You&apos;ll see how easy it is to manage cases, track documents, and communicate with clients.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Case management dashboard</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Document tracking and approval workflow</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Appointment scheduling and reminders</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Client communication portal</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Schedule Demo Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule a Personalized Demo</h3>
            <p className="text-gray-600 mb-8">
              Fill out the form below to schedule a personalized demo with one of our specialists.
              We&apos;ll show you exactly how our platform can meet your specific needs.
            </p>

            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Smith & Associates Law Firm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="cases" className="block text-sm font-medium text-gray-700 mb-2">
                  Average Monthly Cases
                </label>
                <select
                  id="cases"
                  name="cases"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an option</option>
                  <option value="1-10">1-10 cases</option>
                  <option value="11-50">11-50 cases</option>
                  <option value="51-100">51-100 cases</option>
                  <option value="100+">100+ cases</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Needs or Questions
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your specific challenges or requirements..."
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full py-3 text-lg"
                >
                  Schedule Your Demo
                </Button>
              </div>

              <p className="text-sm text-gray-500 text-center">
                By scheduling a demo, you agree to our{' '}
                <Link href="#" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
                . We&apos;ll contact you within 24 hours.
              </p>
            </form>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            See What Our Customers Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">John Davies</h4>
                  <p className="text-gray-600 text-sm">Immigration Law Firm</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;This platform has reduced our case management time by 40%. The document tracking system alone is worth the investment.&quot;
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">SR</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Roberts</h4>
                  <p className="text-gray-600 text-sm">Legal Services Inc.</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;The automated reminders and client portal have dramatically improved our client satisfaction scores.&quot;
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">MC</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                  <p className="text-gray-600 text-sm">Global Immigration Solutions</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;Finally, a CRM built specifically for immigration professionals. The workflow automation has been a game-changer for our team.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        < div className="mt-16 text-center" >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="px-8 py-3 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
                Contact Sales
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-gray-600">
            Need help deciding?{' '}
            <Link href="#" className="text-blue-600 hover:text-blue-500 font-medium">
              Compare our plans
            </Link>
          </p>
        </div >
      </main >
    </div >
  )
}
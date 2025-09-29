import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import Link from 'next/link'
import { CheckCircle, Sparkles, ArrowRight, Mail } from 'lucide-react'

export default async function Success({searchParams}: {searchParams: {session_id?: string}}) {
  const { session_id } = searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_details,
    line_items
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  const credits = line_items?.data[0]?.quantity || 0;

  if (status === 'open') {
    return redirect('/dashboard')
  }

  if (status === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Success Icon Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-6 shadow-2xl">
                <CheckCircle className="w-20 h-20 text-emerald-500" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Payment Successful!
              </h1>
              <p className="text-lg text-gray-600">
                Thank you for your purchase, <span className="font-semibold text-gray-900">{customer_details?.name}</span>
              </p>
            </div>

            {/* Credits Badge */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-6 h-6" />
                <p className="text-sm font-medium uppercase tracking-wide">Credits Purchased</p>
              </div>
              <p className="text-5xl font-bold">{credits}</p>
              <p className="text-emerald-100 mt-1">RepoMind Credits</p>
            </div>

            {/* Benefits List */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-3">
              <p className="text-gray-700 font-medium">{`What's next?`}</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Your credits are now active and ready to use</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Access premium features on RepoMind instantly</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Upload Repository and ask query questions.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/dashboard"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl px-6 py-4 font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/pricing"
                className="flex-1 bg-gray-100 text-gray-700 rounded-xl px-6 py-4 font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                View Plans
              </Link>
            </div>

            {/* Support Section */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p>
                  Need help or have questions? Our support team is here for you at{' '}
                  <Link 
                    href="mailto:orders@example.com"
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline decoration-emerald-200 hover:decoration-emerald-400 transition-colors"
                  >
                    orders@example.com
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Your payment was processed securely through Stripe
          </p>
        </div>
      </div>
    )
  }
}
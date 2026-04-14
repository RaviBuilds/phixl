export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="mb-8 text-gray-400">Last updated: April 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Data Collection
            </h2>
            <p className="leading-relaxed">
              When you use Phixl AI, we collect your email address for
              authentication and billing purposes via Google OAuth. We also
              securely store the images you explicitly upload for restoration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Image Processing & AI
            </h2>
            <p className="leading-relaxed">
              Your images are processed securely using third-party AI APIs (such
              as Replicate). We strictly ensure that your personal family photos
              are <strong>never</strong> used to train public AI models.
              Uploaded and restored images are stored in secure cloud buckets
              and can be deleted from your dashboard at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Payment Information
            </h2>
            <p className="leading-relaxed">
              All financial transactions are handled securely through our
              payment processors (Stripe/Razorpay). Phixl AI does not directly
              store your credit card details on our servers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

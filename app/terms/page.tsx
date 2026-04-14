export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <p className="mb-8 text-gray-400">Last updated: April 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using Phixl AI, you accept and agree to be bound
              by the terms and provision of this agreement. If you do not agree
              to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. AI Generation & Credits
            </h2>
            <p className="leading-relaxed">
              Phixl AI utilizes advanced artificial intelligence models to
              restore images. Due to the unpredictable nature of AI, we cannot
              guarantee flawless results for every image. Credits consumed for
              generations are non-refundable unless a system error prevents the
              generation from completing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. User Uploads & Content
            </h2>
            <p className="leading-relaxed">
              You retain all rights to the images you upload. By uploading an
              image, you grant Phixl AI a temporary license to process the image
              solely for the purpose of returning the restored result. You agree
              not to upload illegal, explicit, or copyrighted material without
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Account Termination
            </h2>
            <p className="leading-relaxed">
              We reserve the right to terminate or suspend access to our service
              immediately, without prior notice or liability, for any reason
              whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

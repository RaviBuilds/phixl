import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Phixl AI protects your personal information. We guarantee 100% privacy and never train public AI models on your memories.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="mb-8 text-gray-400">Last updated: April 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Data Collection & Purpose
            </h2>
            <p className="leading-relaxed">
              When you use Phixl AI, we collect essential data required to
              provide our service: your email address (via Google OAuth) for
              account authentication, billing identifiers, and the specific
              photos you upload for restoration. We do not collect or track
              unnecessary personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Image Processing, Storage & AI Training
            </h2>
            <p className="leading-relaxed">
              Your privacy is our highest priority. Uploaded images are
              temporarily stored securely on our Supabase cloud infrastructure
              and processed via our AI partners (such as Replicate).
              <br />
              <br />
              <strong>
                We strictly guarantee that your personal family photos are NEVER
                used to train public or private AI models.
              </strong>{" "}
              You have full control over your data and can delete your uploaded
              and restored images permanently from your dashboard at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Payment Information & Third Parties
            </h2>
            <p className="leading-relaxed">
              All financial transactions are handled securely through our
              PCI-compliant payment processor, <strong>Razorpay</strong>. Phixl
              AI does not directly collect, process, or store your credit card
              numbers, bank details, or sensitive financial information on our
              servers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

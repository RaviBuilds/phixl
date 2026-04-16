import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms and conditions for using Phixl AI's historical photo restoration services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <p className="mb-8 text-gray-400">Last updated: April 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Business Identity & Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              Phixl AI is developed and operated by Ravindra Kamble, based in
              Telangana, India. By accessing and using Phixl AI, you accept and
              agree to be bound by the terms and provision of this agreement. If
              you do not agree to abide by these terms, please do not use this
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Refund & Cancellation Policy
            </h2>
            <p className="leading-relaxed">
              Phixl AI operates on a digital credit system used to access
              cloud-based artificial intelligence processing.{" "}
              <strong>
                Due to the non-returnable nature of digital credits and the
                immediate computing costs incurred upon generation, all sales
                are final and non-refundable
              </strong>{" "}
              once credits are added to your account.
              <br />
              <br />
              <strong>Exception:</strong> If a technical error on our platform
              consumes credits without delivering the restored image, users must
              contact support within 7 days for a manual review and credit
              reinstatement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Pricing & International Payments
            </h2>
            <p className="leading-relaxed">
              While prices may be displayed in your local currency (e.g., USD,
              EUR), the final transaction is processed securely through
              Razorpay. Your bank or credit card issuer may apply international
              transaction fees or currency conversion rates, which are solely
              your responsibility.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. User Uploads, Deepfakes & Acceptable Use
            </h2>
            <p className="leading-relaxed">
              Phixl AI is strictly a historical photo restoration tool. You
              retain all rights to the images you upload. However, you
              explicitly agree <strong>not</strong> to use this service to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-400">
              <li>Upload illegal, explicit, or highly sensitive material.</li>
              <li>
                Create "deepfakes," non-consensual imagery, or misleading
                content.
              </li>
              <li>
                Upload copyrighted material for which you do not own the rights
                or possess explicit permission to modify.
              </li>
            </ul>
            <p className="leading-relaxed mt-4">
              Violating these terms will result in immediate account termination
              without a refund.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

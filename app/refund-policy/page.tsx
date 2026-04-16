import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Review the refund and cancellation policies for Phixl AI digital credits.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Refund & Cancellation Policy
        </h1>
        <p className="mb-8 text-gray-400">Last updated: April 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. General Policy
            </h2>
            <p className="leading-relaxed">
              Phixl AI provides digital photo restoration services using a
              pay-as-you-go credit system. Because our services involve the
              immediate consumption of high-cost cloud computing resources (GPU
              processing) to generate your restorations,{" "}
              <strong>
                all sales of digital credits are final and non-refundable.
              </strong>
            </p>
            <p className="leading-relaxed mt-4">
              By purchasing credits, you acknowledge that you are purchasing a
              non-tangible, digital service that begins immediately upon
              generation, and therefore the standard right of withdrawal or
              cancellation does not apply once a generation has been initiated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Exceptions & System Failures
            </h2>
            <p className="leading-relaxed">
              We strive for a flawless user experience, but we understand that
              technical errors can occasionally occur. We will issue a manual
              credit refund (reinstating the consumed credits back to your
              account balance) strictly under the following condition:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
              <li>
                A system error or API timeout occurs on our end that consumes
                your credit, but the restored image fails to generate or does
                not appear in your dashboard.
              </li>
            </ul>
            <p className="leading-relaxed mt-4">
              <strong>Note:</strong> We do not offer refunds or credit
              reinstatements if you are simply unsatisfied with the artistic or
              aesthetic outcome of the AI restoration, as AI outputs can vary
              based on the quality of the original uploaded image.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. How to Request a Review
            </h2>
            <p className="leading-relaxed">
              If you believe you have experienced a technical failure as
              described in Section 2, you must contact our support team within{" "}
              <strong>7 days</strong> of the incident.
            </p>
            <p className="leading-relaxed mt-4">
              Please email us at{" "}
              <a
                href="mailto:support@phixl.online"
                className="text-red-brand hover:text-red-brand-light transition-colors"
              >
                support@phixl.online
              </a>{" "}
              and include:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-400">
              <li>The email address associated with your account.</li>
              <li>The date and time of the failed generation.</li>
              <li>A brief description of the issue.</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Our engineering team will review the logs for that specific
              transaction. If a system failure is confirmed, we will reinstate
              the lost credits to your account within 2-3 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Chargebacks and Disputes
            </h2>
            <p className="leading-relaxed">
              If a chargeback or dispute is filed with your bank or credit card
              issuer without first contacting our support team, your Phixl AI
              account will be immediately suspended pending an investigation.
              Fraudulent chargebacks will result in permanent account
              termination and a ban from the platform.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400">
              For any questions regarding this policy, please visit our{" "}
              <Link
                href="/contact"
                className="text-white hover:text-red-brand transition-colors font-medium"
              >
                Contact Page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

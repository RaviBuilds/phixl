import { Mail, MapPin, MessageSquare } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Phixl AI team for support, billing questions, or feedback.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Have questions about Phixl AI, need help with billing, or want to
            report an issue? Drop us a message and we'll get back to you as soon
            as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Contact Info Sidebar */}
          <div className="col-span-1 space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-xl">
                <Mail className="w-6 h-6 text-red-brand-light" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Email Us</h3>
                <p className="text-gray-400 mt-1">support@phixl.online</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-red-brand-light" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Location</h3>
                <p className="text-gray-400 mt-1">Available globally.</p>
              </div>
            </div>
          </div>

          {/* Contact Form UI */}
          <div className="col-span-1 md:col-span-2 bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-brand transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-brand transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-brand transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="button"
                className="bg-red-brand hover:bg-red-brand-light text-white px-8 py-3 rounded-full font-bold transition-all drop-shadow-[0px_0px_1px_#fff] flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Mail, MapPin, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Phixl AI team for support, billing questions, or feedback.",
};

// THIS IS THE LINE NEXT.JS WAS MISSING:
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
                <h3 className="text-white font-semibold text-lg">
                  Operational Address
                </h3>
                <p className="text-gray-400 mt-1">
                  Telangana, India
                  <br />
                  Available globally.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form UI */}
          <div className="col-span-1 md:col-span-2 bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-xl">
            <form
              action="https://api.web3forms.com/submit"
              method="POST"
              className="space-y-6"
            >
              {/* IMPORTANT: Put your Web3Forms access key here */}
              <input
                type="hidden"
                name="access_key"
                value="036afd26-0854-4206-820c-4f15d3bc90e4"
              />
              <input
                type="hidden"
                name="redirect"
                value="https://phixl.online/contact?success=true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
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
                    name="email"
                    required
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
                  name="message"
                  rows={5}
                  required
                  placeholder="How can we help you?"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-brand transition-colors resize-none"
                ></textarea>
              </div>

              {/* Web3Forms Zero-Config hCaptcha */}
              <div className="h-captcha" data-captcha="true"></div>

              <button
                type="submit"
                className="bg-red-brand hover:bg-red-brand-light text-white px-8 py-3 rounded-full font-bold transition-all drop-shadow-[0px_0px_1px_#fff] flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Next.js optimized script loading for the Captcha */}
      <Script
        src="https://web3forms.com/client/script.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
// import { Mail, MapPin, MessageSquare } from "lucide-react";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Contact Us",
//   description:
//     "Get in touch with the Phixl AI team for support, billing questions, or feedback.",
// };

// export default function ContactPage() {
//   return (
//     <div className="min-h-screen bg-[#0a0a0a] py-20 px-6">
//       <div className="max-w-5xl mx-auto">
//         <div className="text-center mb-16">
//           <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
//           <p className="text-gray-400 max-w-xl mx-auto">
//             Have questions about Phixl AI, need help with billing, or want to
//             report an issue? Drop us a message and we'll get back to you as soon
//             as possible.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//           {/* Contact Info Sidebar */}
//           <div className="col-span-1 space-y-8">
//             <div className="flex items-start gap-4">
//               <div className="bg-gray-800 p-3 rounded-xl">
//                 <Mail className="w-6 h-6 text-red-brand-light" />
//               </div>
//               <div>
//                 <h3 className="text-white font-semibold text-lg">Email Us</h3>
//                 <p className="text-gray-400 mt-1">support@phixl.online</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-4">
//               <div className="bg-gray-800 p-3 rounded-xl">
//                 <MapPin className="w-6 h-6 text-red-brand-light" />
//               </div>
//               <div>
//                 <h3 className="text-white font-semibold text-lg">
//                   Operational Address
//                 </h3>
//                 <p className="text-gray-400 mt-1">
//                   Telangana, India
//                   <br />
//                   Available globally.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Contact Form UI */}
//           <div className="col-span-1 md:col-span-2 bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-xl">
//             <form
//               action="https://api.web3forms.com/submit"
//               method="POST"
//               className="space-y-6"
//             >
//               {/* Replace with the key sent to your email */}
//               <input
//                 type="hidden"
//                 name="access_key"
//                 value="036afd26-0854-4206-820c-4f15d3bc90e4"
//               />

//               {/* Optional: Redirects the user back to your site after sending */}
//               <input
//                 type="hidden"
//                 name="redirect"
//                 value="https://phixl.online/contact?success=true"
//               />

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-400 mb-2">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     required
//                     placeholder="John"
//                     className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-brand transition-colors"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-400 mb-2">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     required
//                     placeholder="john@example.com"
//                     className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-brand transition-colors"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">
//                   Message
//                 </label>
//                 <textarea
//                   name="message"
//                   rows={5}
//                   required
//                   placeholder="How can we help you?"
//                   className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-brand transition-colors resize-none"
//                 ></textarea>
//               </div>

//               <button
//                 type="submit"
//                 className="bg-red-brand hover:bg-red-brand-light text-white px-8 py-3 rounded-full font-bold transition-all drop-shadow-[0px_0px_1px_#fff] flex items-center gap-2"
//               >
//                 <MessageSquare className="w-5 h-5" />
//                 Send Message
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

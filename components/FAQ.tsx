
interface FaqTypes {
  question: string;
  answer:string;
}
  const faqs: FaqTypes[] = [
    {
      question: "Is Phixl AI Free?",
      answer:
        "Phixl AI uses a freemium model. You can restore images for free with limited quality and watermarks. We also give you 3 PRO credits to try out our high-resolution AI restoration. No subscriptions—just one-time credit purchases based on your needs.",
    },
    {
      question: "How does Phixl AI work?",
      answer:
        "Phixl AI uses cutting-edge artificial intelligence to restore, colorize, and enhance old or damaged photos. Our proprietary restoration model detects faces, removes scratches, and rebuilds missing details without manual editing, all in a few seconds.",
    },
    {
      question: "Are my images stored or shared?",
      answer:
        "No, your images are never stored or shared. We process your uploads temporarily to generate the restored version, and then all data is automatically deleted. Your privacy is our priority, and all processing is done anonymously.",
    },
    {
      question: "What’s the difference between Free, Pro, and API?",
      answer:
        "The Free version includes basic restoration with some limitations like lower resolution and watermarks. The PRO version gives access to ultra-HD results, faster processing, and watermark-free images. The API is for developers who want to integrate Phixl AI's restoration engine into their own apps or platforms at a reduced cost per image.",
    },
  ];


export default function FAQ(): React.ReactElement {
  return (
    <section id="bg-color-background">
      <div className="px-6 max-w-full py-15 md:py-25 md:max-w-[724px] md:mx-auto lg:max-w-full">
        <div className="mb-8">
          <h2 className="text-center text-3xl font-bold mb-4 text-color-white-fresh">FAQs</h2>
          <p className="text-center text-lg text-color-gray">
            Questions about Phixl AI? Here are the answers!
          </p>
        </div>
        <div className="mt-5 max-w-full lg:max-w-[724px] mx-auto">
          <div>
            <ul>
              {faqs.map((faq) => (
                <li key={faq.question} className="mt-6">
                  <h2 className="text-xl font-bold mb-3 text-color-white-fresh">
                    {faq.question}
                  </h2>
                  <p className="text-[1rem] text-color-white">{faq.answer}</p>
                  <hr className="text-color-gray mt-6" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

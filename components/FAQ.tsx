
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
    <section id="faq-section">
      <div className="section-wrapper">
        <div className="section-heading">
          <h2 className="section-title">FAQs</h2>
          <p className="section-subtitle">
            Questions about Phixl AI? Here are the answers!
          </p>
        </div>
        <div className="faq-section-contents">
          <div className="faq-block">
            <ul>
              {faqs.map((faq) => (
                    <li key={faq.question}>
                      <h2 className="faq-heading">{faq.question}</h2>
                      <p className="faq-para">{faq.answer}</p>
                      <hr />
                    </li>
                  ))
              }
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

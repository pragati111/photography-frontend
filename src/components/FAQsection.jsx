import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How far in advance should we book you?",
    answer:
      "We recommend booking 6–12 months in advance, especially for weddings during peak season. However, if your date is available, we'd love to be part of your celebration.",
  },
  {
    question: "Do you travel for destination weddings?",
    answer:
      "Absolutely! We love traveling and documenting weddings across India and internationally. Travel costs are discussed separately depending on the location.",
  },
  {
    question: "How many photos will we receive?",
    answer:
      "Every wedding is unique, but you can typically expect between 600–1000 carefully edited high-resolution images.",
  },
  {
    question: "When will we receive our photos?",
    answer:
      "Your complete gallery is usually delivered within 6–8 weeks after your wedding. Sneak peeks are shared within a few days.",
  },
  {
    question: "Do you provide wedding films as well?",
    answer:
      "Yes! Along with photography, we create cinematic wedding films that beautifully capture every emotion and moment of your special day.",
  },
];

export default function FAQsection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className=" py-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="uppercase tracking-[6px] text-amber-700 text-sm font-semibold mb-3">
            Frequently Asked Questions
          </p>

          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-[#3a2720] leading-tight">
            Answers made simple for your luxury wedding journey.
          </h2>

          <p className="text-[#5d4a3f] mt-5 max-w-2xl mx-auto text-base md:text-lg leading-8">
            Browse the most common questions and discover how we create elevated experiences with every celebration.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_32px_70px_rgba(71,41,15,0.12)] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between px-9 py-6 text-left bg-white transition hover:bg-amber-50"
                >
                  <h3 className="text-lg md:text-xl font-semibold text-[#422a1e]">
                    {faq.question}
                  </h3>

                  <div className="ml-4 flex-shrink-0 text-amber-600">
                    {isOpen ? (
                      <Minus
                        size={24}
                        className="transition-transform duration-300"
                      />
                    ) : (
                      <Plus
                        size={24}
                        className="transition-transform duration-300"
                      />
                    )}
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-9 pb-8 text-[#5d4a3f] leading-8 text-base md:text-lg bg-[#fff8f1] rounded-b-[2rem]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-[2rem] bg-[#3a2720] p-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
          <p className="text-3xl md:text-4xl font-semibold text-[#f6e7d5] leading-tight">
            Still curious? We’re here to answer everything.
          </p>

          <p className="mt-4 text-[#d8c2a6] text-lg max-w-2xl mx-auto">
            Explore the full FAQ collection and discover how our luxury wedding services work.
          </p>

          <Link
            to="/faq"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-amber-200 px-10 py-4 text-sm font-semibold text-[#3a2720] transition hover:bg-amber-300"
          >
            Know More
          </Link>
        </div>
      </div>
     
    </section>
  );
}
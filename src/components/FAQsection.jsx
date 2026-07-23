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
    <section className="bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="uppercase tracking-[4px] text-gray-500 text-sm">
            Frequently Asked Questions
          </p>


          <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
            Have questions? We've answered some of the most common ones below.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-1">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between px-9 py-5 text-left hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    {faq.question}
                  </h3>

                  <div className="ml-4 flex-shrink-0">
                    {isOpen ? (
                      <Minus
                        size={22}
                        className="text-gray-700 transition-transform duration-300"
                      />
                    ) : (
                      <Plus
                        size={22}
                        className="text-gray-700 transition-transform duration-300"
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
                    <div className="px-6 pb-5 text-gray-600 leading-7">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
<div className="mt-16 text-center">
  <p className="text-lg md:text-xl text-gray-600">
    Have more questions?
  </p>

  <p className="mt-2 text-gray-500">
    Head over to our FAQs page for everything you need to know.
  </p>

  <Link
    to="/faq"
    className="mt-8 inline-flex items-center rounded-full border border-gray-900 px-8 py-3 text-sm font-medium tracking-[2px] uppercase transition-all duration-300 hover:bg-gray-900 hover:text-white"
  >
    Know More
  </Link>
</div>
      </div>
     
    </section>
  );
}
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, Search, Languages } from "lucide-react";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";
import PremiumFooter from "./PremiumFooter";
import Sidebar from "./SideBar";
import BottomBar from "./BottomBar";

const content = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about getting the perfect print.",
    backBtn: "Back",
    data: [
      {
        category: "General",
        questions: [
          {
            q: "Why should I choose you over other printing companies?",
            a: "We provide premium quality with high-end finishing and rapid turnaround times.",
          },
          {
            q: "Can I place an order over the phone?",
            a: "Yes, you can call our support line to discuss custom requirements and place orders.",
          },
          {
            q: "What are your working hours?",
            a: "We are open Monday to Saturday, 9:00 AM to 7:00 PM.",
          },
        ],
      },
      {
        category: "Company",
        questions: [
          {
            q: "Do you offer same-day or urgent printing services?",
            a: "Yes, we offer express printing for select items if ordered before 11 AM.",
          },
          {
            q: "What payment methods do you offer?",
            a: "We accept all major credit cards, UPI, and bank transfers.",
          },
        ],
      },
    ],
  },
  hi: {
    title: "सामान्यतः पूछे जाने वाले प्रश्न",
    subtitle: "परफेक्ट प्रिंट पाने के लिए आपको जो कुछ भी जानने की जरूरत है।",
    backBtn: "अकाउंट पर वापस जाएं",
    data: [
      {
        category: "सामान्य प्रश्न",
        questions: [
          {
            q: "मुझे अन्य प्रिंटिंग कंपनियों के बजाय आपको क्यों चुनना चाहिए?",
            a: "हम हाई-एंड फिनिशिंग के साथ प्रीमियम क्वालिटी और बहुत कम समय में डिलीवरी प्रदान करते हैं।",
          },
          {
            q: "क्या मैं फोन पर ऑर्डर दे सकता हूँ?",
            a: "हाँ, आप अपनी विशिष्ट आवश्यकताओं पर चर्चा करने के लिए हमारी सहायता टीम को कॉल कर सकते हैं।",
          },
          {
            q: "आपके काम करने के घंटे क्या हैं?",
            a: "हम सोमवार से शनिवार, सुबह 9:00 बजे से शाम 7:00 बजे तक खुले रहते हैं।",
          },
        ],
      },
      {
        category: "कंपनी",
        questions: [
          {
            q: "क्या आप तत्काल प्रिंटिंग सेवाएँ प्रदान करते हैं?",
            a: "हाँ, यदि सुबह 11 बजे से पहले ऑर्डर दिया जाता है, तो हम एक्सप्रेस प्रिंटिंग की सुविधा देते हैं।",
          },
          {
            q: "आप भुगतान के कौन से तरीके स्वीकार करते हैं?",
            a: "हम सभी प्रमुख क्रेडिट कार्ड, UPI और बैंक ट्रांसफर स्वीकार करते हैं।",
          },
        ],
      },
    ],
  },
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  return (
    <div className="border-b border-gray-100">
      <button
        className="w-full py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors px-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[15px] font-semibold text-gray-800">
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-300 transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px] pb-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm text-gray-600 px-2 leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function FAQPage({ onBack }) {
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentContent = content[lang];

  return (
    <>
      <TopHeader />

      <div className="w-full lg:w-[calc(100%-240px)] lg:ml-[240px] pt-[80px] bg-gray-100 min-h-screen font-sans">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* HEADER SECTION */}
          <div className=" pb-16 px-6  shadow-sm relative overflow-hidden text-center">
            <Search
              size={180}
              className="absolute -right-10 -top-5 text-gray-100 opacity-50 rotate-12 pointer-events-none"
            />

            {/* Back Button - Kept at the top left for standard navigation */}
            <div className="flex justify-start relative z-10 mb-5">
              <button
                onClick={() => {
                  if (typeof onBack === "function") {
                    onBack();
                  } else {
                    navigate(-1);
                  }
                }}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition font-medium"
              >
                <ChevronLeft size={20} />
                <span>{currentContent.backBtn}</span>
              </button>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {/* LANGUAGE SELECTION BAR - Now centered above the Heading */}
              <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200 shadow-inner mb-6 w-fit">
                <button
                  onClick={() => setLang("en")}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    lang === "en"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang("hi")}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    lang === "hi"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* MAIN HEADING */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                {currentContent.title}
              </h1>

              <p className="text-gray-500 text-sm max-w-[280px] mx-auto leading-relaxed">
                {currentContent.subtitle}
              </p>
            </div>
          </div>

          {/* FAQ CONTENT CARDS */}
          <div className="px-4 md:px-10 -mt-8 relative z-20 pb-16">
            <div className="bg-white rounded-3xl shadow-xl p-5 md:p-8 border border-gray-50">
              {currentContent.data.map((section, idx) => (
                <div
                  key={`${lang}-section-${idx}`}
                  className={idx !== 0 ? "mt-10" : ""}
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
                    {section.category}
                  </h2>
                  <div className="divide-y divide-gray-50">
                    {section.questions.map((item, qIdx) => (
                      <FAQItem
                        key={`${lang}-q-${idx}-${qIdx}`}
                        question={item.q}
                        answer={item.a}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <PremiumFooter />
        </div>
      </div>
      <BottomBar/>
    </>
  );
}

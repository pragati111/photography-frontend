import React, { useEffect, useState } from "react";
import TopHeader from "../components/TopHeader";
import Sidebar from "../components/SideBar";
import BottomBar from "../components/BottomBar";
import PremiumFooter from "../components/PremiumFooter";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
// 👉 Add this import at the top of your global CSS or index.html for premium font:
// <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

const content = {
  en: {
    title: "Privacy Policy",
    updated: "Last Updated: November 2025",
    backBtn: "Back",
    intro: "Your privacy is important to us. We are committed to protecting your personal information and ensuring transparency in how we collect, use, and safeguard your data.",
    sections: [
      {
        heading: "Information We Collect",
        items: [
          {
            title: "Personal Information",
            text: "Includes your name, email, phone number, and any details you provide while placing orders or contacting us.",
          },
          {
            title: "Usage Data",
            text: "Includes pages visited, time spent, interactions, and browsing behavior to improve our platform experience.",
          },
        ],
      },
      {
        heading: "How We Use Your Information",
        items: [
          "To provide and maintain our services",
          "To improve user experience and personalization",
          "To communicate updates, offers, and support",
          "To ensure security and prevent fraud",
        ],
      },
      {
        heading: "Data Security",
        text: "We implement industry-standard security measures to protect your data. However, no system is completely secure, and we encourage users to take precautions when sharing sensitive information.",
      },
      {
        heading: "Your Rights",
        text: "You have the right to access, update, or delete your personal information. You can contact us anytime for such requests.",
      },
      {
        heading: "Contact Us",
        text: "If you have any questions regarding this Privacy Policy, feel free to reach out to us via email or phone.",
      },
    ],
  },
  hi: {
    title: "गोपनीयता नीति",
    updated: "अंतिम अपडेट: नवंबर 2025",
    backBtn: "वापस",
    intro: "आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। हम आपकी व्यक्तिगत जानकारी की सुरक्षा और इसे कैसे एकत्रित, उपयोग और सुरक्षित किया जाता है, इसमें पारदर्शिता के लिए प्रतिबद्ध हैं।",
    sections: [
      {
        heading: "हम कौन सी जानकारी एकत्र करते हैं",
        items: [
          {
            title: "व्यक्तिगत जानकारी",
            text: "इसमें आपका नाम, ईमेल, फोन नंबर और कोई भी विवरण शामिल है जो आप ऑर्डर देते समय या हमसे संपर्क करते समय प्रदान करते हैं।",
          },
          {
            title: "उपयोग डेटा",
            text: "इसमें पेज विज़िट, बिताया गया समय, इंटरैक्शन और ब्राउज़िंग व्यवहार शामिल हैं ताकि हम अपने प्लेटफ़ॉर्म अनुभव में सुधार कर सकें।",
          },
        ],
      },
      {
        heading: "हम आपकी जानकारी का कैसे उपयोग करते हैं",
        items: [
          "अपनी सेवाओं को प्रदान और बनाए रखने के लिए",
          "उपयोगकर्ता अनुभव और व्यक्तिगतकरण में सुधार करने के लिए",
          "अपडेट, ऑफ़र और समर्थन संचार करने के लिए",
          "सुरक्षा सुनिश्चित करने और धोखाधड़ी को रोकने के लिए",
        ],
      },
      {
        heading: "डेटा सुरक्षा",
        text: "हम आपके डेटा की रक्षा के लिए उद्योग-मानक सुरक्षा उपाय लागू करते हैं। हालांकि, कोई भी प्रणाली पूरी तरह से सुरक्षित नहीं है, और हम उपयोगकर्ताओं को संवेदनशील जानकारी साझा करते समय सावधानी बरतने के लिए प्रोत्साहित करते हैं।",
      },
      {
        heading: "आपके अधिकार",
        text: "आपके पास अपनी व्यक्तिगत जानकारी तक पहुँचने, उसे अपडेट करने या हटाने का अधिकार है। आप ऐसे अनुरोधों के लिए कभी भी हमसे संपर्क कर सकते हैं।",
      },
      {
        heading: "हमसे संपर्क करें",
        text: "यदि आपके पास इस गोपनीयता नीति के संबंध में कोई प्रश्न हैं, तो बेझिझक हमें ईमेल या फोन के माध्यम से संपर्क करें।",
      },
    ],
  },
};

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const currentContent = content[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <TopHeader />
    <div className="w-full lg:w-[calc(100%-240px)] lg:ml-[240px] pt-[60px] bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fdf2f8] min-h-screen font-[Inter]">
      {/* Sidebar */}
      <Sidebar />
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        

        <main className="px-6 md:px-12 py-10 max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="mb-10">
            <div className="flex justify-start relative z-10 mb-5">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition font-medium"
              >
                <ChevronLeft size={20} />
                {currentContent.backBtn}
              </button>
            </div>

            <div className="relative z-10 flex flex-col items-start sm:items-center">
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

              <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight font-[Playfair_Display]">
                {currentContent.title}
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                {currentContent.updated}
              </p>
            </div>
          </div>

          {/* Card Container */}
          <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 md:p-10 shadow-lg space-y-10">

            {/* Intro */}
            <section className="text-base md:text-lg leading-relaxed text-gray-700">
              <p>{currentContent.intro}</p>
            </section>

            {currentContent.sections.map((section, idx) => (
              <section key={`policy-section-${idx}`}>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 font-[Playfair_Display]">
                  {section.heading}
                </h2>

                {Array.isArray(section.items) ? (
                  <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.items.map((item, itemIdx) =>
                      typeof item === "string" ? (
                        <p key={`item-${itemIdx}`}>{item}</p>
                      ) : (
                        <div
                          key={`item-${itemIdx}`}
                          className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
                        >
                          <p className="font-medium text-gray-900 mb-1">{item.title}</p>
                          <p>{item.text}</p>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {section.text}
                  </p>
                )}
              </section>
            ))}
          </div>
        </main>

        <PremiumFooter />
        <BottomBar />
      </div>
    </div>
    </>
  );
}

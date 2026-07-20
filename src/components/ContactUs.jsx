import React, { useEffect } from "react";
import { Mail, Phone, MapPin, ChevronLeft } from "lucide-react";
import TopHeader from "./TopHeader";
import PremiumFooter from "./PremiumFooter";
import Sidebar from "./SideBar";
import BottomBar from "./BottomBar";
import { useNavigate } from "react-router-dom";

export default function ContactUs() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <TopHeader />

      <div className="w-full lg:w-[calc(100%-240px)] lg:ml-[240px] pt-[80px] bg-gray-100 min-h-screen">
        <Sidebar />

        <div className="flex flex-col min-h-screen">
          {/* ================= PAGE CONTENT ================= */}
          <div className="px-4 md:px-8 lg:px-10 py-6 flex-1">
            
            {/* BACK BUTTON */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition font-medium mb-6"
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>

            {/* MAIN CARD */}
            <div className="w-full bg-white rounded-[32px] shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 p-6 md:p-14">
                
                {/* ================= LEFT SECTION ================= */}
                <div className="flex flex-col justify-center">
                  <h1 className="text-4xl md:text-5xl font-semibold text-black mb-12">
                    Contact Us
                  </h1>

                  {/* CONTACT INFO */}
                  <div className="space-y-8">
                    
                    {/* ADDRESS */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <MapPin className="w-6 h-6 text-indigo-400" />
                      </div>

                      <div>
                        <p className="text-gray-800 text-base md:text-lg font-medium">
                          Physical Address
                        </p>

                        <p className="text-gray-500 text-sm md:text-base mt-1 leading-relaxed">
                          123 Creative Studio,
                          <br />
                          Business District, Phase II, Jaipur
                          <br />
                          Rajasthan, India
                        </p>
                      </div>
                    </div>

                    {/* PHONE */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <Phone className="w-6 h-6 text-indigo-400" />
                      </div>

                      <div>
                        <p className="text-gray-800 text-base md:text-lg font-medium">
                          Phone Number
                        </p>

                        <p className="text-gray-500 text-sm md:text-base mt-1">
                          +91 9876543210
                        </p>
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <Mail className="w-6 h-6 text-indigo-400" />
                      </div>

                      <div>
                        <p className="text-gray-800 text-base md:text-lg font-medium">
                          Email ID
                        </p>

                        <p className="text-gray-500 text-sm md:text-base mt-1">
                          support@printsy.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= RIGHT IMAGE ================= */}
                <div className="flex items-center justify-center">
                  <img
                    src="/images/high-res-contactus.jpg"
                    alt="Contact Us"
                    className="w-full max-w-[650px] object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <PremiumFooter />
        </div>
      </div>

      <BottomBar />
    </>
  );
}
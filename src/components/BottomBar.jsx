import { Phone, Mail } from "lucide-react";

export default function BottomBar() {
  return (
    <div className="fixed bottom-20 md:bottom-0 left-0 w-full z-50 bg-white flex items-center justify-between px-4 md:px-8 py-2 md:py-4 border-t gap-4">
        <div className="flex flex-col md:flex-row gap-1 md:gap-6 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <Phone size={16} /> +91 98765 43210
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} /> info@example.com
          </div>
        </div>

        <button className="bg-orange-500 text-white px-3 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm">
          Quick Inquiry
        </button>

        <div className="hidden md:flex gap-3">
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
        </div>
      </div>
  );
}
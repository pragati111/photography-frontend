import React from 'react';
import { Phone, Mail, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumFooter = () => {
  const links = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "FAQs", path: "/faqs" },
  { name: "Privacy", path: "/privacy" },
  { name: "Contact Us", path: "/contact" },
];
  return (
    /* Reduced vertical padding from py-16 to py-10 and added mb-12 for bottom margin */
    <footer className="bg-[#0f172a] text-slate-300 py-10 pb-24 px-6 font-sans ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Section 1: Contact Us */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide uppercase text-xs border-b border-slate-700 pb-2 inline-block">
            Contact Us
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-1.5 bg-slate-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                <Phone size={16} className="text-blue-400 group-hover:text-white" />
              </div>
              <span className="hover:text-white transition-colors text-sm">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-1.5 bg-slate-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                <Mail size={16} className="text-blue-400 group-hover:text-white" />
              </div>
              <span className="hover:text-white transition-colors text-sm">hello@yourbrand.com</span>
            </div>
          </div>
        </div>

        {/* Section 2: Working Hours & 24/7 Support */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide uppercase text-xs border-b border-slate-700 pb-2 inline-block">
            Working Hours
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <Clock size={16} className="text-slate-500" />
              <p>Mon - Sat: 09:00 AM - 07:00 PM</p>
            </div>
            
            {/* Reduced size of 24/7 Logo/Badge */}
            <div className="mt-4 flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700 w-fit">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-[10px]">
                  24x7
                </div>
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0f172a] animate-pulse"></div>
              </div>
              <div>
                <p className="text-white font-medium text-xs">Always Online</p>
                <p className="text-[10px] text-slate-500">Live Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Quick Links */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide uppercase text-xs border-b border-slate-700 pb-2 inline-block">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
  {links.map((link) => (
    <li key={link.name} className="flex items-center gap-2 group cursor-pointer">
      <ChevronRight size={12} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all -ml-3 group-hover:ml-0" />
      
      <Link to={link.path} className="hover:text-white transition-colors">
        {link.name}
      </Link>
    </li>
  ))}
</ul>
        </div>

        {/* Section 4: Address */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide uppercase text-xs border-b border-slate-700 pb-2 inline-block">
            Our Office
          </h3>
          <div className="flex gap-3 text-sm">
            <MapPin size={20} className="text-blue-400 shrink-0" />
            <p className="leading-snug">
              123 Creative Studio, <br />
              Business District, Phase II, <br />
              Jaipur, RJ 302001
            </p>
          </div>
        </div>

      </div>

      {/* Tighter Bottom Copyright section */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800 text-center text-[12px] text-slate-300">
        <p className="opacity-90">© {new Date().getFullYear()} Your Print Studio. All Rights Reserved. Unauthorized reproduction, distribution, or theft of website design and content is strictly prohibited and constitutes a punishable legal offense under the Copyright Act. </p>
      </div>
    </footer>
  );
};

export default PremiumFooter;
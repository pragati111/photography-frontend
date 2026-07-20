import React from 'react';
import { Mail, ClipboardList, CreditCard, Image as ImageIcon, Printer, Truck } from 'lucide-react';

const OrderProcess = () => {
  const steps = [
    { icon: <Mail className="w-4 h-4 lg:w-7 lg:h-7" />, title: "Inquiry", desc: "Inquire with your requirements" },
    { icon: <ClipboardList className="w-4 h-4 lg:w-7 lg:h-7" />, title: "Quotation", desc: "Approve provided quotation" },
    { icon: <CreditCard className="w-4 h-4 lg:w-7 lg:h-7" />, title: "Payment", desc: "Make payment to proceed" },
    { icon: <ImageIcon className="w-4 h-4 lg:w-7 lg:h-7" />, title: "Mock UP", desc: "Confirm mock-up" },
    { icon: <Printer className="w-4 h-4 lg:w-7 lg:h-7" />, title: "Production", desc: "We fulfill your order" },
    { icon: <Truck className="w-4 h-4 lg:w-7 lg:h-7" />, title: "Delivery", desc: "Receive or collect" },
  ];

  return (
    <section  className="py-12 lg:py-20 bg-[#fdfdfd] max-w-[900px] mx-auto px-4 md:px-8 lg:px-12">
      {/* Very compact header */}
      <h2 className="text-lg lg:text-2xl font-bold text-[#333333] text-center mb-4 lg:mb-6 uppercase tracking-wide">
        Order Process
      </h2>

      {/* 3 columns on mobile, 6 on desktop */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-1 lg:gap-x-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              
              {/* Ultra-small icons for mobile */}
              <div className="w-9 h-9 lg:w-14 lg:h-14 rounded-full border-[1px] lg:border-2 border-black flex items-center justify-center mb-1 lg:mb-3">
                {step.icon}
              </div>
              
              {/* Title: x-small on mobile, base on desktop */}
              <h3 className="font-extrabold text-[#1a1a1a] text-[10px] lg:text-[15px] leading-tight uppercase">
                {step.title}
              </h3>
              
              {/* Description: Tiny text to keep height low */}
              <p className="text-[#444444] text-[9px] lg:text-[12px] leading-tight mt-0.5 opacity-90 max-w-[85px] lg:max-w-[140px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
    </section>
  );
};

export default OrderProcess;
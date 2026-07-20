import React from 'react';
import { MessageSquare, FileText, CreditCard, Layout, Package, Truck } from 'lucide-react';

const steps = [
  { 
    id: 1, 
    title: 'Inquiry', 
    desc: 'Inquire with your requirements', 
    color: '#1a73e8', 
    icon: <MessageSquare size={24} className="md:w-10 md:h-10" />, 
    pos: 'bottom' 
  },
  { 
    id: 2, 
    title: 'Quotation', 
    desc: 'Approve provided quotation', 
    color: '#f59e0b', 
    icon: <FileText size={24} className="md:w-10 md:h-10" />, 
    pos: 'top' 
  },
  { 
    id: 3, 
    title: 'Payment', 
    desc: 'Make payment to proceed', 
    color: '#0d9488', 
    icon: <CreditCard size={24} className="md:w-10 md:h-10" />, 
    pos: 'bottom' 
  },
  { 
    id: 4, 
    title: 'Mock UP', 
    desc: 'Confirm mock-up before production', 
    color: '#7c3aed', 
    icon: <Layout size={24} className="md:w-10 md:h-10" />, 
    pos: 'top' 
  },
  { 
    id: 5, 
    title: 'Production', 
    desc: 'We fulfill your order', 
    color: '#db2777', 
    icon: <Package size={24} className="md:w-10 md:h-10" />, 
    pos: 'bottom' 
  },
  { 
    id: 6, 
    title: 'Delivery', 
    desc: 'Receive via delivery or collect', 
    color: '#65a30d', 
    icon: <Truck size={24} className="md:w-10 md:h-10" />, 
    pos: 'top' 
  },
];

const InfographicTimeline = () => {
  return (
    <>
    <div className="px-4 md:px-8 lg:px-12">
          <h2 className="text-xl md:text-2xl font-semibold">
            Order Process
          </h2>
          <div className="w-10 h-[3px] bg-orange-500 mt-1"></div>
       
    </div>
    <div className="w-full bg-white py-4 md:py-16 px-2 md:px-4 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-[1200px] flex items-center justify-between relative px-2 md:px-10">
        
        {/* The Dashed Connector Line */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 -z-0 px-[6%]">
          <svg width="100%" height="40" viewBox="0 0 1000 40" preserveAspectRatio="none" fill="none" className="opacity-40">
            <path 
              d="M0,20 Q100,-10 200,20 T400,20 T600,20 T800,20 T1000,20" 
              stroke="#94a3b8" 
              strokeWidth="2" 
              strokeDasharray="6 4"
            />
          </svg>
        </div>

        {steps.map((step, index) => (
          <div key={step.id} className="relative flex flex-col items-center z-10 flex-1">
            
            {/* Top Label Layer */}
            <div className={`absolute -top-10 md:-top-20 min-h-[40px] md:h-16 flex flex-col items-center justify-end text-center transition-opacity ${step.pos === 'top' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="font-bold text-[9px] md:text-[15px] leading-none uppercase mb-1" style={{ color: step.color }}>
                {step.title}
              </span>
              <span className="hidden md:block text-[11px] text-gray-500 max-w-[120px] leading-tight">
                {step.desc}
              </span>
            </div>

            {/* The Main Circle */}
            <div 
              className="w-10 h-10 sm:w-14 sm:h-14 md:w-28 md:h-28 rounded-full border-[2px] md:border-[6px] bg-white flex items-center justify-center relative shadow-md transition-transform hover:scale-110 duration-300"
              style={{ borderColor: step.color, color: step.color }}
            >
              {step.icon}

              {/* Decorative Side Nodes */}
              {index !== 0 && (
                <div 
                  className="absolute -left-1 md:-left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 md:w-5 md:h-5 rounded-full border md:border-2 bg-white"
                  style={{ borderColor: step.color }}
                />
              )}
              {index !== steps.length - 1 && (
                <div 
                  className="absolute -right-1 md:-right-2.5 top-1/2 -translate-y-1/2 w-2 h-2 md:w-5 md:h-5 rounded-full border md:border-2 bg-white flex items-center justify-center"
                  style={{ borderColor: step.color }}
                >
                    <div className="w-0.5 h-0.5 md:w-2 md:h-2 rounded-full" style={{ backgroundColor: step.color }}></div>
                </div>
              )}
            </div>

            {/* Bottom Label Layer */}
            <div className={`absolute -bottom-10 md:-bottom-20 min-h-[40px] md:h-16 flex flex-col items-center justify-start text-center transition-opacity ${step.pos === 'bottom' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="font-bold text-[9px] md:text-[15px] leading-none uppercase mt-1 mb-1" style={{ color: step.color }}>
                {step.title}
              </span>
              <span className="hidden md:block text-[11px] text-gray-500 max-w-[120px] leading-tight">
                {step.desc}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default InfographicTimeline;
import React from 'react';

const EcoBackdropBanner = () => {
  return (
    /* Added padding wrapper to match other sections */
    <section className="px-4 md:px-8 lg:px-12">
      <div className="relative w-full max-w-[1400px] mx-auto min-h-[260px] bg-gradient-to-r from-[#a1afce] to-[#bcc9e4] flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-8 md:py-4 overflow-hidden shadow-md  md:rounded-none">
      
      {/* Text Container */}
      <div className="flex-1 z-10 text-center md:text-left py-4">
        <h1 className="text-white font-black text-4xl md:text-5xl lg:text-6xl leading-[0.85] tracking-tight uppercase mb-5 drop-shadow-sm">
          Eco<br />Friendly<br />Backdrops
        </h1>
        
        <button className="group inline-flex items-center bg-[#eb4d27] hover:bg-[#d14322] text-white text-[11px] md:text-xs font-extrabold py-2 px-6 rounded-full transition-all shadow-lg hover:shadow-[#eb4d27]/20">
          DISCOVER 
          <span className="ml-3 bg-white text-[#eb4d27] rounded-full w-5 h-5 flex items-center justify-center text-[10px] group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>

      {/* Image Gallery */}
      <div className="flex-[1.5] flex items-end justify-center md:justify-end relative w-full h-full pt-12 md:pt-0">
        
        {/* Left Backdrop */}
        <div className="relative z-10 w-[28%] md:w-[22%] transition-transform hover:-translate-y-1 duration-300">
          <img 
            src="images/1.jpg" 
            alt="Backdrop Left" 
            className="w-full h-auto drop-shadow-[0_15px_15px_rgba(0,0,0,0.25)]"
          />
        </div>

        {/* Center Backdrop */}
        <div className="relative z-20 w-[32%] md:w-[26%] -ml-[8%] md:-ml-[5%] mb-1 transition-transform hover:-translate-y-1 duration-300">
          <img 
            src="images/2.jpg" 
            alt="Backdrop Center" 
            className="w-full h-auto drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]"
          />
        </div>

        {/* Right Backdrop */}
        <div className="relative z-30 w-[30%] md:w-[24%] -ml-[8%] md:-ml-[5%] transition-transform hover:-translate-y-1 duration-300">
          <img 
            src="images/3.jpg" 
            alt="Backdrop Right" 
            className="w-full h-auto drop-shadow-[0_15px_15px_rgba(0,0,0,0.25)]"
          />
        </div>
      </div>
      </div>
    </section>
  );
};

export default EcoBackdropBanner;
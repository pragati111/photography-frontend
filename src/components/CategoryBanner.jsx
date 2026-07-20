import React from "react";

const CategoryBanner = () => {
  const categories = [
    {
      title: "Lifestyle",
      items: [
        { name: "Scarf", rating: 4.5, img: "images/1.jpg" },
        { name: "Pillows", rating: 5, img: "images/2.jpg" },
        { name: "Blanket", rating: 5, img: "images/3.jpg" },
        { name: "Bean Bag", rating: 4.5, img: "images/4.jpg" },
      ],
      bannerClass: "bg-gradient-to-br from-teal-100 via-purple-100 to-orange-100",
    },
    {
      title: "Just for You",
      items: [
        { name: "Bottle", rating: 5, img: "images/5.jpg" },
        { name: "PU Notebook", rating: 5, img: "images/6.jpg" },
        { name: "Wax Seal", rating: 4.5, img: "images/7.jpg" },
        { name: "Tote Bag", rating: 5, img: "images/1.jpg" },
      ],
      bannerClass: "bg-gradient-to-br from-green-100 via-blue-100 to-orange-100",
    },
    {
      title: "Décor",
      items: [
        { name: "Home Wallpaper", rating: 5, img: "images/2.jpg" },
        { name: "Dining Table Cloth", rating: 5, img: "images/3.jpg" },
        { name: "Name Plate", rating: 4.5, img: "images/4.jpg" },
        { name: "Balloon Décor", rating: 5, img: "images/5.jpg" },
      ],
      bannerClass: "bg-gradient-to-br from-orange-100 via-yellow-100 to-teal-100",
    },
  ];

  return (
    <div className="px-4 md:px-8 lg:px-12 py-10 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex flex-col">
            {/* Desktop Header */}
            <div className="hidden md:block mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">{cat.title}</h2>
              <div className="w-10 h-1 bg-orange-600 mt-1"></div>
            </div>

            {/* Content Card */}
            <div className="bg-gray-100 rounded-xl p-3 md:p-4 border border-gray-200 shadow-sm">
              <div className="grid grid-cols-2 md:flex md:flex-col gap-x-2 gap-y-4 md:gap-4">
                
                {/* Mobile Banner */}
                <div className={`md:hidden col-span-1 row-span-2 rounded-lg flex items-center justify-center p-2 text-center ${cat.bannerClass}`}>
                  <h3 className="text-white text-xl font-bold drop-shadow-md leading-tight">
                    {cat.title}
                  </h3>
                </div>

                {/* Items List */}
                {cat.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 md:gap-3 bg-transparent">
                    {/* Reduced Image Size on Mobile: w-12 h-12 */}
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex flex-col justify-center min-w-0">
                      {/* Reduced Font Size on Mobile: text-[11px] */}
                      <h4 className="text-[11px] md:text-base font-medium text-gray-700 leading-tight break-words">
                        {item.name}
                      </h4>
                      {/* Reduced Star Size on Mobile: text-[8px] */}
                      <div className="flex text-orange-400 text-[8px] md:text-xs mt-0.5 md:mt-1">
                        {"★".repeat(Math.floor(item.rating))}
                        {item.rating % 1 !== 0 && "½"}
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBanner;
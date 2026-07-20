import { useState } from "react";
import { categories } from "../data/categories";

export default function Navbar() {
  const [active, setActive] = useState(null);

  return (
    <div className="hidden md:block bg-white shadow">
      <div className="flex gap-6 px-6 py-4">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="cursor-pointer font-medium">
              {cat.name}
            </span>

            {active === i && cat.children.length > 0 && (
              <div className="absolute top-full left-0 bg-white shadow-xl p-6 grid grid-cols-3 gap-8 w-[700px] z-50">
                {cat.children.map((sub, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold mb-2">
                      {sub.name}
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {sub.items.map((item, id) => (
                        <li
                          key={id}
                          className="hover:text-black cursor-pointer"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
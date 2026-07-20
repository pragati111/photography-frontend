export default function CategoryList({ category }) {
  return (
    <div className="mb-6">
      
      {/* Main Category */}
      <h2 className="text-lg font-semibold mb-2">
        {category.name}
      </h2>

      {/* Subcategories */}
      <div className="ml-3 space-y-3">
        {category.children?.map((sub, i) => (
          <div key={i}>
            
            {/* Sub Category */}
            <h3 className="text-sm font-medium text-gray-800 mb-1">
              {sub.name}
            </h3>

            {/* Sub-Sub Categories */}
            <ul className="ml-3 text-xs text-gray-600 space-y-1">
              {sub.items?.map((item, idx) => (
                <li key={idx} className="cursor-pointer">
                  • {item.name} {/* ✅ FIXED */}
                </li>
              ))}
            </ul>

          </div>
        ))}
      </div>

    </div>
  );
}
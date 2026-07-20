export default function ProductShimmer() {
  return (
    <div className="flex">
      {/* ❌ REMOVED fake sidebar space */}
      <div className="hidden lg:block w-[240px] fixed top-[72px] left-0 h-[calc(100vh-72px)] bg-gray-100 border-r overflow-y-auto text-xs animate-pulse">
        {/* HOME */}
        <div className="px-3 py-3 border-b bg-white">
          <div className="h-3 w-20 bg-gray-300 rounded"></div>
        </div>

        {/* CATEGORY LIST */}
        {[1, 2, 3, 4, 5].map((_, i) => (
          <div key={i} className="border-b">
            {/* CATEGORY HEADER */}
            <div className="px-3 py-3 flex justify-between items-center">
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
              <div className="h-3 w-3 bg-gray-300 rounded"></div>
            </div>

            {/* EXPANDED MOCK */}
            {i === 0 && (
              <div className="px-2 py-2 space-y-3 bg-white">
                {[1, 2].map((_, j) => (
                  <div key={j}>
                    {/* SUBCATEGORY NAME */}
                    <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>

                    {/* ITEMS GRID */}
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((_, k) => (
                        <div key={k} className="bg-gray-50 p-2 rounded-md">
                          <div className="h-[45px] bg-gray-300 rounded mb-1"></div>
                          <div className="h-2 bg-gray-300 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full lg:ml-[240px] pt-[100px] px-4 lg:px-6 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT IMAGE SECTION */}
          <div className="w-full lg:w-[420px]">
            <div className="h-[320px] lg:h-[420px] bg-gray-300 rounded"></div>

            <div className="mt-4 flex gap-3 overflow-x-auto">
              {[1, 2, 3, 4].map((_, i) => (
                <div
                  key={i}
                  className="w-[70px] h-[70px] bg-gray-300 rounded flex-shrink-0"
                ></div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 space-y-4">
            {/* TITLE */}
            <div className="h-6 bg-gray-300 w-3/4 rounded"></div>

            {/* PRICE ROW */}
            <div className="flex gap-3">
              <div className="h-6 w-24 bg-gray-300 rounded"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 w-5/6 rounded"></div>
            </div>

            {/* CUSTOMIZATION BLOCK */}
            <div className="mt-6 space-y-3">
              <div className="h-5 w-40 bg-gray-300 rounded"></div>

              {[1, 2].map((_, i) => (
                <div key={i} className="border p-4 rounded space-y-3">
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-4">
              <div className="h-12 bg-gray-300 w-full rounded"></div>
              <div className="h-12 bg-gray-300 w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

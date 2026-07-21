import img1 from "../assets/blogs/1.png";
import img2 from "../assets/blogs/2.png";
import img3 from "../assets/blogs/3.png";
import img4 from "../assets/blogs/4.png";

const blogs = [
  {
    image: img1,
    title: "Emily & Daniel",
    date: "May 1, 2026",
  },
  {
    image: img2,
    title: "Reva & Zach",
    date: "October 7, 2024",
  },
  {
    image: img3,
    title: "Olivia & James",
    date: "August 25, 2024",
  },
  {
    image: img4,
    title: "Alia & Ranbir, Mumbai",
    date: "August 8, 2024",
  },
];

export default function PhotographyBlogSection() {
  return (
    <section className=" py-24">

      <div className="max-w-[1650px] mx-auto px-8">

        {/* Cards */}

        <div className="grid grid-cols-4 gap-4">

          {blogs.map((blog, index) => (
            <div key={index}>

              {/* Image */}

              <div className="group relative overflow-hidden cursor-pointer">

                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full aspect-[4/5] object-cover"
                />

                {/* Gray Overlay */}

                <div className="absolute inset-0 bg-[#6f6f6f]/0 group-hover:bg-[#6f6f6f]/25 transition-all duration-500"></div>

                {/* View More Button */}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">

                  <button className="border border-white bg-transparent text-white px-8 py-3 text-sm uppercase tracking-[2px] font-medium transition-all duration-300 hover:bg-white hover:text-black">
  View More
</button>

                </div>

              </div>

              {/* Text */}

              <div className="mt-5">

                <h3
                  className="text-[36px] leading-none"
                  style={{
                    fontFamily: "Cormorant Garamond",
                    fontWeight: 600,
                  }}
                >
                  {blog.title}
                </h3>

                <p
                  className="mt-2 text-[20px] text-[#555]"
                  style={{
                    fontFamily: "Cormorant Garamond",
                  }}
                >
                  {blog.date}
                </p>

              </div>

            </div>
          ))}

        </div>

        {/* Bottom Button */}

        <div className="flex justify-center mt-20">

          <button className="bg-[#B89A55] hover:bg-[#A88C4C] text-white px-10 py-4 rounded-sm transition-all duration-300 tracking-wide">
            Photography Blog
          </button>

        </div>

      </div>

    </section>
  );
}
import { ChevronDown } from "lucide-react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function TopNavbar() {
  return (
    <header className="absolute left-0 top-0 z-30 w-full">
      <div className="mx-auto flex h-24 max-w-[1600px] items-center justify-between px-12">
        {/* Logo */}
        <div className="text-3xl font-serif text-white">
          LOGO
        </div>

        {/* Menu */}
        <nav className="hidden lg:flex items-center gap-10 text-white">
          <a href="#">Photography</a>

          <a href="#">Films</a>

          <a href="#">Contact Us</a>

          <a href="#">Editorial</a>

          <button className="flex items-center gap-1">
            More
            <ChevronDown size={18} />
          </button>
        </nav>

        <div className="hidden lg:flex items-center gap-5 text-white">
  <FaInstagram className="cursor-pointer text-lg hover:opacity-80" />
  <FaFacebookF className="cursor-pointer text-lg hover:opacity-80" />
  <FaXTwitter className="cursor-pointer text-lg hover:opacity-80" />

  <button className="rounded-full border border-white px-6 py-3 transition hover:bg-white hover:text-black">
    Get In Touch
  </button>
</div>
      </div>
    </header>
  );
}
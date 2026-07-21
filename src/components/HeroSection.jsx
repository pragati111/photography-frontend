import heroImage from "../assets/hero.jpg";

export default function HeroSection({ children }) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Hero"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Navbar */}
      {children}

      {/* Hero Text */}
      <div className="relative z-20 flex h-full items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-light tracking-wide">
            Capturing Beautiful Stories
          </h1>

          <p className="mt-6 text-lg">
            Wedding • Editorial • Lifestyle • Baby Shower
          </p>
        </div>
      </div>
    </section>
  );
}
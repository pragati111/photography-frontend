import video from "../assets/video.mp4";

export default function VideoSection() {
  return (
    <section className=" py-24">

      <div className="max-w-[1800px] mx-auto">

        <div
          className="relative overflow-hidden"
          style={{
  clipPath:
    "polygon(0% 0%, 75% 10%, 100% 0%, 100% 92%, 85% 88%, 18% 100%, 0% 92%)",
}}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-[800px] object-cover"
          >
            <source src={video} type="video/mp4" />
          </video>

          {/* Dark Overlay */}

          <div className="absolute inset-0 "></div>

          {/* Content */}

          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-8">

            <h2
              style={{
                fontFamily: "Baskerville Old Face, Baskerville, 'Times New Roman', serif",
                fontSize: "70px",
                fontWeight: 500,
                letterSpacing: "-2px",
              }}
            >
              MOMENTS IN MOTION
            </h2>

            <p
              className="mt-12 max-w-[500px]"
              style={{
                fontFamily: "Cormorant Garamond",
                fontSize: "18px",
                lineHeight: "1.9",
              }}
            >
              Every wedding is unique and so are our films.
              For past 8 years HOTC has set new benchmarks
              of storytelling within wedding realm and beyond.
              We are fortunate to have experienced cultures
              across the globe and document stories that
              continuously overwhelm us.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
import img1 from "../assets/iconic/1.png";
import img2 from "../assets/iconic/2.png";
import img3 from "../assets/iconic/3.png";
import img4 from "../assets/iconic/4.png";
import img5 from "../assets/iconic/5.png";
import img6 from "../assets/iconic/6.png";
import img7 from "../assets/iconic/7.png";
import img8 from "../assets/iconic/8.png";
import img9 from "../assets/iconic/9.png";
import img10 from "../assets/iconic/10.png";
import img11 from "../assets/iconic/11.png";
import img12 from "../assets/iconic/12.png";
import img13 from "../assets/iconic/13.png";
import img14 from "../assets/iconic/14.png";

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,

  img6,
  img7,
  null,
  img8,
  img9,

  img10,
  img11,
  img12,
  img13,
  img14,
];

export default function IconicImagesSection() {
  return (
    <section className="w-full bg-white">

      <div className="grid grid-cols-5 gap-[2px] bg-white">

        {images.map((img, index) => {

          if (img === null) {
            return (
              <div
                key={index}
                className="aspect-square flex flex-col items-center justify-center bg-white px-8 text-center"
              >

                <p
                  className="text-[#4c4038]"
                  style={{
                    fontFamily: "Cormorant Garamond",
                    fontSize: "28px",
                    fontWeight: 400,
                  }}
                >
                  some of the most
                </p>

                <h2
                  className="italic"
                  style={{
                    fontFamily: "Baskerville Old Face, Baskerville, 'Times New Roman', serif",
                    fontSize: "62px",
                    lineHeight: ".9",
                    fontWeight: 400,
                    color: "#2f2a28",
                  }}
                >
                  “ICONIC”
                </h2>

                <p
                  style={{
                    fontFamily: "Cormorant Garamond",
                    fontSize: "28px",
                    color: "#4c4038",
                  }}
                >
                  wedding images
                </p>

              </div>
            );
          }

          return (
            <div
              key={index}
              className="aspect-square overflow-hidden"
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          );
        })}

      </div>

    </section>
  );
}
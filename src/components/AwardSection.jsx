import award1 from "../assets/awards/1.png";
import award2 from "../assets/awards/2.png";
import award3 from "../assets/awards/3.png";
import award4 from "../assets/awards/4.png";

const awards = [
  award1,
  award2,
  award3,
  award4,
];

export default function AwardSection() {
  return (
    <section>

      <div className="max-w-[1700px] mx-auto px-8">

        {/* Heading */}

        <h2
          className="text-center text-[#444]"
          style={{
            fontFamily: "Cormorant Garamond",
            fontSize: "48px",
            fontWeight: 300,
            letterSpacing: "-1px",
            marginBottom: "10px",
          }}
        >
          AWARD WINNING FILMS
        </h2>

        {/* Awards */}

        <div className="flex justify-center items-center flex-wrap gap-12">

          {awards.map((award, index) => (
            <div
              key={index}
              className="flex justify-center items-center"
            >
              <img
                src={award}
                alt={`Award ${index + 1}`}
                className="h-[160px] object-contain transition-transform duration-500 "
              />
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}
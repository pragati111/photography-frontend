import brideImg from "../assets/1.jpg";
import landscapeImg from "../assets/2.jpg";

import vogue from "../assets/logos/5.png";
import cosmopolitan from "../assets/logos/6.png";
import hello from "../assets/logos/7.png";
import brides from "../assets/logos/8.png";
import travel from "../assets/logos/9.png";

export default function AboutSection() {
  return (
    <div className="mx-10">
      <section className="bg-transparent py-20 overflow-hidden">
        <div className="relative max-w-[1700px] mx-auto min-h-[1050px] px-10">

        {/* ====================== HEADING ====================== */}

        <div
          className="absolute z-30"
          style={{
            left: "380px",
            top: "220px",
            width: "780px",
          }}
        >
          <h1
            style={{
              fontFamily: "Cormorant Garamond",
              fontSize: "56px",
              fontWeight: 300,
              lineHeight: "1",
              letterSpacing: "-1px",
              color: "#232323",
            }}
          >
            A MODERN APPROACH
            <br />
            <span
              style={{
                fontStyle: "italic",
                fontSize: "36px",
                fontWeight: 300,
                marginRight: "8px",
              }}
            >
              to an
            </span>
            <span style={{ whiteSpace: "nowrap" }}>AGE OLD TRADITION</span>
          </h1>
        </div>

        {/* ================= LEFT IMAGE ================= */}

        <img
          src={brideImg}
          alt=""
          className="absolute left-[40px] top-[320px] w-[380px] h-[520px] object-cover"
        />

        {/* ================= RIGHT IMAGE ================= */}

        <img
          src={landscapeImg}
          alt=""
          className="absolute right-[40px] top-[80px] w-[440px] h-[540px] object-cover"
        />

        {/* ================= TEXT ================= */}

        <div
          className="absolute"
          style={{
            left: "420px",
            right: "480px",
            top: "360px",
            fontFamily: "Cormorant Garamond",
            fontSize: "16px",
            lineHeight: "1.8",
            fontWeight: "700",
            color: "#222",
            paddingRight: "16px",
            paddingLeft: "8px",
          }}
        >
          Considered to be the epitome of Modern Photography and
          Filmmaking, HOTC has transformed the Indian Wedding
          landscape on a regular basis. For almost a decade House On
          The Clouds has been creating photographs and films which are
          timeless and have been etched in memories of thousands of
          people forever.
          <br />
          <br />
          Awarded as the Wedding Filmmaker of the year for four
          consecutive years at the Weddingsutra Awards along with
          numerous other awards, HOTC is the only company listed on
          IMDB for its award-winning films.
        </div>

        {/* ================= LOGOS ================= */}

        <div
          className="absolute flex items-center justify-center gap-6"
          style={{ left: "500px", top: "720px" }}
        >
          <img src={vogue} alt="" className="h-10 object-contain" />
          <img src={cosmopolitan} alt="" className="h-10 object-contain" />
          <img src={hello} alt="" className="h-10 object-contain" />
          <img src={brides} alt="" className="h-10 object-contain" />
          <img src={travel} alt="" className="h-10 object-contain" />
        </div>

        </div>
      </section>
    </div>
  );
}
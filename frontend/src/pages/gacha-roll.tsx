import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GachaRollPage() {
  const [flipped, setFlipped] = useState(false);
  const [rarity, setRarity] = useState("");
  const [result, setResult] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const r = Math.random();

    let item = "";
    let rare = "";

    if (r < 0.6) {
      rare = "R";
      item = "メイド服セット";
    } else if (r < 0.9) {
      rare = "SR";
      item = "アイドル衣装セット";
    } else {
      rare = "SSR";
      item = "天使セット";
    }

    setRarity(rare);
    setResult(item);

    setTimeout(() => setFlipped(true), 500);
    setTimeout(() => navigate("/gacha"), 2500);

  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "24px",
        position: "relative",

        background:
          "linear-gradient(0deg, rgba(179,229,252,0.7) 50%, transparent 50%), " +
          "linear-gradient(90deg, rgba(179,229,252,0.7) 50%, transparent 50%), #FFFFFF",

        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 20px 20px",
        backgroundBlendMode: "multiply",

        padding: "24px",
        borderRadius: "20px",
        border: "3px solid #333",

        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => navigate("/gacha")}
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          border: "none",
          background: "none",
          cursor: "pointer",
        }}
      >
        ← 戻る
      </button>

      <div className={`card ${flipped ? "flipped" : ""}`}>
        <div className="card-back">Drama Doll</div>

        <div className="card-front">
          <p>{rarity}</p>

          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color:
                rarity === "SSR"
                  ? "#f59e0b"
                  : rarity === "SR"
                  ? "#ec4899"
                  : "#333",
            }}
          >
            {result}
          </p>
        </div>
      </div>

      <style>{`
        .card {
          width: 220px;
          height: 300px;
          transform-style: preserve-3d;
          transition: transform 0.5s;
          position: relative;
        }

        .flipped {
          transform: rotateY(180deg);
        }

        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          border: 3px solid #333;
          background: white;

          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          backface-visibility: hidden;
        }

        .card-front {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
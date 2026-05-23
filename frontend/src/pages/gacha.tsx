import { useNavigate } from "react-router-dom";

export default function GachaPage() {
  const navigate = useNavigate();

  const points = Number(localStorage.getItem("points") || 0);

  const handleGacha = () => {
    if (points < 30) {
      alert("ポイントが足りない！");
      return;
    }

    // ✅ ここで消費
    const newPoints = points - 30;
    localStorage.setItem("points", String(newPoints));

    navigate("/gacha/roll");
  };

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
        boxShadow: "4px 4px 0 rgba(0,0,0,0.1)",

        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* ✅ ポイント表示 */}
      <p style={{ fontWeight: "bold" }}>
        所持ポイント: {points}
      </p>

      <div
        style={{
          width: "220px",
          height: "300px",
          background: "#fff",
          border: "3px solid #333",
          borderRadius: "20px",

          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <h3 style={{ margin: 0 }}>ガチャ</h3>

        <button
          onClick={handleGacha}
          disabled={points < 30} // ✅ 押せなくする
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "2px solid #333",
            background: points < 30 ? "#ccc" : "#fff",
            cursor: points < 30 ? "not-allowed" : "pointer",
            fontWeight: "bold",
            boxShadow: points < 30 ? "none" : "2px 2px 0 #333",
          }}
        >
          引く
          30pt
        </button>

        {/* ✅ 足りない時メッセージ */}
        {points < 30 && (
          <p style={{ color: "red", fontSize: "12px" }}>
            ポイント不足
          </p>
        )}
      </div>
    </div>
  );
}
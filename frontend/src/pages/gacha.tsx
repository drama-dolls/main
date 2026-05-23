import { useNavigate } from "react-router-dom";

export default function GachaPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "24px",
        position: "relative",

        // ✅ 完全修正チェック柄（ズレ修正版）
        background:
          "linear-gradient(0deg, rgba(179,229,252,0.7) 50%, transparent 50%), " +
          "linear-gradient(90deg, rgba(179,229,252,0.7) 50%, transparent 50%), #FFFFFF",

        backgroundSize: "40px 40px",

        // ✅ ←これが今回の本命（位置ズレ修正）
        backgroundPosition: "0 0, 20px 20px",

        // ✅ 濃くする
        backgroundBlendMode: "multiply",

        padding: "24px",
        borderRadius: "20px",
        border: "3px solid #333",
        boxShadow: "4px 4px 0 rgba(0,0,0,0.1)",

        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* ✅ 中央カード */}
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
          onClick={() => navigate("/gacha/roll")}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "2px solid #333",
            background: "#fff",
            cursor: "pointer",
            boxShadow: "2px 2px 0 #333",
            fontWeight: "bold",
          }}
        >
          引く
        </button>
      </div>
    </div>
  );
}
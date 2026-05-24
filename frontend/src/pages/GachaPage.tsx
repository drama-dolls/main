import { useState } from "react";
import { api } from "../api/client";

const getCharacterVideoUrl = (characterName: string) => {
  const prefixMap: Record<string, string> = {
    "デフォルト": "",
    "ギャル": "gal",
    "シッソ": "sisso",
    "天使": "tensi_",
  };
  const prefix = prefixMap[characterName] ?? "";
  return `/videos/${prefix}futsu.mp4`;
};

export default function GachaPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState<any>(null);
  const [showCharacter, setShowCharacter] = useState(false);

  const handleGacha = async () => {
    const data = await api.pullGacha();
    if (data.detail) {
      setError(data.detail);
    } else {
      setError("");
      setResult(null);
      setShowCharacter(false);
      setPending(data);
      setPlaying(true);
    }
  };

  const handleGachaVideoEnd = () => {
    setPlaying(false);
    setResult(pending);
    setPending(null);
    setShowCharacter(true);
  };

  return (
    <div>
      <button onClick={handleGacha} disabled={playing}>
        ガチャを引く（30PT）
      </button>
      {error && <p>{error}</p>}

      {playing && (
        <video
          src="/videos/gacha.mp4"
          autoPlay
          muted
          onEnded={handleGachaVideoEnd}
        />
      )}

      {result && !playing && (
        <div>
          <p>{result.costume_name}（{result.rarity}）</p>
          <p>残りPT: {result.allowance_pt}</p>
          {showCharacter && result.character_name && (
            <video
              src={getCharacterVideoUrl(result.character_name)}
              autoPlay
              loop
              muted
            />
          )}
        </div>
      )}
    </div>
  );
}

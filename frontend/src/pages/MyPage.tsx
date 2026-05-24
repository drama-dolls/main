import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function MyPage() {
  const [characters, setCharacters] = useState<any[]>([]);

  useEffect(() => {
    api.getMyCharacters().then(setCharacters);
  }, []);

  const handleSelect = async (character_id: number) => {
    await api.updateSelection(character_id);
    alert('キャラクターを変更しました');
  };

  return (
    <div>
      <h2>所持キャラクター</h2>
      {characters.map((c) => (
        <div key={c.character_id}>
          <span>{c.name}</span>
          <button onClick={() => handleSelect(c.character_id)}>選択</button>
        </div>
      ))}
    </div>
  );
}

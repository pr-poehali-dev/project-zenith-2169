import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/57246603-008a-4886-9f6e-ae7bca848967";

interface Props {
  onClose: () => void;
  onUploaded: () => void;
}

export default function UploadModal({ onClose, onUploaded }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileB64, setFileB64] = useState("");
  const [contentType, setContentType] = useState("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Только изображения: JPG, PNG, GIF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Файл слишком большой. Максимум 5 МБ");
      return;
    }
    setError("");
    setContentType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setFileB64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !fileB64) {
      setError("Заполни название и выбери изображение");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch(`${API}?action=upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), author: author.trim() || "Аноним", tags, image: fileB64, content_type: contentType }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setDone(true);
      onUploaded();
    } else {
      setError("Ошибка загрузки. Попробуй ещё раз.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4" onClick={onClose}>
      <div
        className="bg-[#111] border border-[#222] rounded-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>

        {!done ? (
          <>
            <h2 className="text-white font-black text-xl mb-1 uppercase tracking-tight">Добавить мем</h2>
            <p className="text-neutral-500 text-sm mb-5">Твой мем увидят все посетители</p>

            {/* Дроп-зона */}
            <div
              className={`border-2 border-dashed rounded-xl mb-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                preview ? "border-burgundy p-2" : "border-[#2a2a2a] hover:border-burgundy p-8"
              }`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-full max-h-52 object-contain rounded-lg" />
              ) : (
                <>
                  <Icon name="ImagePlus" size={32} className="text-neutral-600 mb-2" />
                  <p className="text-neutral-500 text-sm text-center">Перетащи или <span className="text-burgundy-light">выбери файл</span></p>
                  <p className="text-neutral-700 text-xs mt-1">JPG, PNG, GIF · до 5 МБ</p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
              />
            </div>

            {preview && (
              <button
                onClick={(e) => { e.stopPropagation(); setPreview(null); setFileB64(""); }}
                className="text-neutral-600 hover:text-white text-xs flex items-center gap-1 mb-4 transition-colors"
              >
                <Icon name="X" size={12} /> Удалить фото
              </button>
            )}

            <div className="flex flex-col gap-3 mb-4">
              <input
                type="text"
                placeholder="Название мема *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2.5 placeholder:text-neutral-600 focus:outline-none focus:border-burgundy transition-colors"
              />
              <input
                type="text"
                placeholder="Твой ник (необязательно)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2.5 placeholder:text-neutral-600 focus:outline-none focus:border-burgundy transition-colors"
              />
              <input
                type="text"
                placeholder="Теги через запятую: коты, юмор, работа"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2.5 placeholder:text-neutral-600 focus:outline-none focus:border-burgundy transition-colors"
              />
            </div>

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || !fileB64 || !title.trim()}
              className="w-full bg-burgundy hover:bg-burgundy-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Icon name="Loader2" size={16} className="animate-spin" /> Загружаю...</>
              ) : (
                <><Icon name="Upload" size={16} /> Опубликовать мем</>
              )}
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <Icon name="CheckCircle" size={48} className="text-burgundy mx-auto mb-3" />
            <h2 className="text-white font-black text-xl mb-1">Мем опубликован!</h2>
            <p className="text-neutral-500 text-sm mb-6">Он уже в ленте — иди смотри 👀</p>
            <button onClick={onClose} className="bg-burgundy hover:bg-burgundy-light text-white font-semibold px-6 py-2 rounded-lg transition-colors">
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

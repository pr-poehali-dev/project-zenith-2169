import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/57246603-008a-4886-9f6e-ae7bca848967";

interface Meme {
  id: number;
  title: string;
  author: string;
  image_url: string;
  tags: string[];
  avg_rating: number;
  review_count: number;
}

interface Review {
  id: number;
  author_name: string;
  body: string;
  rating: number;
  created_at: string;
}

function ReviewModal({ meme, onClose, onSubmitted }: { meme: Meme; onClose: () => void; onSubmitted: () => void }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    fetch(`${API}?action=reviews&meme_id=${meme.id}`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
      .finally(() => setLoadingReviews(false));
  }, [meme.id]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    await fetch(`${API}?action=review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meme_id: meme.id, rating, body: review, author_name: "Аноним" }),
    });
    setLoading(false);
    setSubmitted(true);
    onSubmitted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4" onClick={onClose}>
      <div
        className="bg-[#111] border border-[#222] rounded-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>

        <img src={meme.image_url} alt={meme.title} className="w-full h-48 object-cover rounded-lg mb-4" />

        <div className="flex items-start justify-between mb-1">
          <h2 className="text-white font-bold text-lg pr-6">{meme.title}</h2>
          {meme.avg_rating > 0 && (
            <span className="flex items-center gap-1 text-yellow-400 font-bold text-sm shrink-0">
              <Icon name="Star" size={14} className="fill-yellow-400" />
              {meme.avg_rating}
            </span>
          )}
        </div>
        <p className="text-neutral-500 text-sm mb-4">@{meme.author} · {meme.review_count} рецензий</p>

        <button
          className="w-full flex items-center justify-center gap-2 bg-burgundy hover:bg-burgundy-light text-white text-sm font-semibold py-2 rounded-lg transition-colors mb-5"
          onClick={() => {
            const a = document.createElement("a");
            a.href = meme.image_url;
            a.download = `${meme.title}.jpg`;
            a.click();
          }}
        >
          <Icon name="Download" size={16} />
          Скачать мем
        </button>

        {!submitted ? (
          <>
            <p className="text-neutral-400 text-xs uppercase tracking-widest mb-2">Ваша оценка</p>
            <div className="flex gap-1 mb-3 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(n)}
                  className={`w-8 h-8 text-xs font-bold rounded transition-colors ${
                    n <= (hovered || rating)
                      ? "bg-burgundy text-white"
                      : "bg-[#1e1e1e] text-neutral-500 hover:bg-burgundy-dark hover:text-white"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Напишите рецензию (необязательно)..."
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg p-3 resize-none h-24 placeholder:text-neutral-600 focus:outline-none focus:border-burgundy transition-colors mb-3"
            />
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || loading}
              className="w-full bg-burgundy hover:bg-burgundy-light disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-lg transition-colors"
            >
              {loading ? "Сохраняю..." : "Опубликовать рецензию"}
            </button>
          </>
        ) : (
          <div className="text-center py-4 mb-2">
            <Icon name="CheckCircle" size={40} className="text-burgundy mx-auto mb-2" />
            <p className="text-white font-semibold">Рецензия опубликована!</p>
            <p className="text-neutral-500 text-sm mt-1">Спасибо за вклад в культуру</p>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="mt-6 border-t border-[#1e1e1e] pt-4">
            <p className="text-neutral-400 text-xs uppercase tracking-widest mb-3">Рецензии</p>
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-[#1a1a1a] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-neutral-300 text-sm font-medium">{r.author_name}</span>
                    <span className="text-yellow-400 text-xs font-bold flex items-center gap-0.5">
                      <Icon name="Star" size={10} className="fill-yellow-400" /> {r.rating}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-sm">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {loadingReviews && (
          <p className="text-neutral-600 text-xs text-center mt-4">Загружаю рецензии...</p>
        )}
      </div>
    </div>
  );
}

export default function MemeGrid() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"new" | "top">("new");
  const [selected, setSelected] = useState<Meme | null>(null);

  const fetchMemes = useCallback(async (q: string, s: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("sort", s);
    const res = await fetch(`${API}?${params}`);
    const data = await res.json();
    setMemes(data.memes || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchMemes(search, sort), 300);
    return () => clearTimeout(timer);
  }, [search, sort, fetchMemes]);

  return (
    <section id="memes" className="bg-black px-4 md:px-8 lg:px-16 py-14">
      {/* Поиск и сортировка */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию, автору или тегу..."
            className="w-full bg-[#0d0d0d] border border-[#1a1a1a] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 placeholder:text-neutral-600 focus:outline-none focus:border-burgundy transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
            >
              <Icon name="X" size={14} />
            </button>
          )}
        </div>
        <div className="flex bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg overflow-hidden shrink-0">
          <button
            onClick={() => setSort("new")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${sort === "new" ? "bg-burgundy text-white" : "text-neutral-500 hover:text-white"}`}
          >
            Новые
          </button>
          <button
            onClick={() => setSort("top")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${sort === "top" ? "bg-burgundy text-white" : "text-neutral-500 hover:text-white"}`}
          >
            Топ
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold uppercase tracking-widest">
          {sort === "top" ? "Топ мемов" : "Свежие мемы"}
        </h2>
        <span className="text-neutral-600 text-sm">
          {loading ? "..." : `${memes.length} мемов`}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg overflow-hidden animate-pulse">
              <div className="h-52 bg-[#1a1a1a]" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-[#1a1a1a] rounded w-3/4" />
                <div className="h-3 bg-[#1a1a1a] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : memes.length === 0 ? (
        <div className="text-center py-20">
          <Icon name="SearchX" size={48} className="text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500">По запросу «{search}» ничего не найдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {memes.map((meme) => (
            <div
              key={meme.id}
              className="group relative bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg overflow-hidden hover:border-burgundy transition-all duration-300 cursor-pointer"
              onClick={() => setSelected(meme)}
            >
              <div className="relative overflow-hidden h-52">
                <img
                  src={meme.image_url}
                  alt={meme.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3">
                    <div className="bg-burgundy text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-sm font-semibold">
                      <Icon name="Download" size={14} />
                      Скачать
                    </div>
                    <div className="bg-white/10 backdrop-blur text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-sm">
                      <Icon name="Star" size={14} />
                      Рецензия
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-white text-xs font-bold flex items-center gap-1">
                  <Icon name="Star" size={10} className="text-yellow-400" />
                  {meme.avg_rating > 0 ? meme.avg_rating : "—"}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{meme.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 text-xs">@{meme.author}</span>
                  <span className="text-neutral-600 text-xs flex items-center gap-1">
                    <Icon name="MessageSquare" size={11} />
                    {meme.review_count}
                  </span>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {meme.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-burgundy-light bg-burgundy/10 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <ReviewModal
          meme={selected}
          onClose={() => setSelected(null)}
          onSubmitted={() => fetchMemes(search, sort)}
        />
      )}
    </section>
  );
}

import { useState } from "react";
import Icon from "@/components/ui/icon";

const MEMES = [
  {
    id: 1,
    title: "Когда код работает с первого раза",
    author: "dank_lord",
    rating: 9.2,
    reviews: 142,
    thumb: "https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/20828359-70e4-49c2-892c-afdf7369de58.jpg",
    tags: ["it", "программисты"],
  },
  {
    id: 2,
    title: "Понедельник снова пришёл",
    author: "meme_factory",
    rating: 8.7,
    reviews: 98,
    thumb: "https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/fb15952e-c129-440b-9bd7-e5eaf113132a.jpg",
    tags: ["офис", "жизнь"],
  },
  {
    id: 3,
    title: "Кот смотрит в пустоту",
    author: "catmeme42",
    rating: 9.8,
    reviews: 311,
    thumb: "https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/e1632369-5de7-4789-b180-5f9ab3c8a13f.jpg",
    tags: ["коты", "экзистенциал"],
  },
  {
    id: 4,
    title: "Дедлайн завтра, я смотрю мемы",
    author: "procrastinator99",
    rating: 9.5,
    reviews: 204,
    thumb: "https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/20828359-70e4-49c2-892c-afdf7369de58.jpg",
    tags: ["прокрастинация", "работа"],
  },
  {
    id: 5,
    title: "5 минут поиграть",
    author: "gamer_zone",
    rating: 8.1,
    reviews: 77,
    thumb: "https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/fb15952e-c129-440b-9bd7-e5eaf113132a.jpg",
    tags: ["игры", "ложь"],
  },
  {
    id: 6,
    title: "Бюджет закончился, мечты живут",
    author: "broke_but_happy",
    rating: 7.9,
    reviews: 55,
    thumb: "https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/e1632369-5de7-4789-b180-5f9ab3c8a13f.jpg",
    tags: ["деньги", "мечты"],
  },
];

function ReviewModal({ meme, onClose }: { meme: typeof MEMES[0]; onClose: () => void }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" onClick={onClose}>
      <div
        className="bg-[#111] border border-[#222] rounded-lg max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>

        <img src={meme.thumb} alt={meme.title} className="w-full h-48 object-cover rounded mb-4" />

        <h2 className="text-white font-bold text-lg mb-1">{meme.title}</h2>
        <p className="text-neutral-500 text-sm mb-4">автор: @{meme.author}</p>

        <div className="flex gap-2 mb-4">
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-burgundy hover:bg-burgundy-light text-white text-sm font-semibold py-2 rounded transition-colors"
            onClick={() => {
              const a = document.createElement("a");
              a.href = meme.thumb;
              a.download = `${meme.title}.jpg`;
              a.click();
            }}
          >
            <Icon name="Download" size={16} />
            Скачать
          </button>
        </div>

        {!submitted ? (
          <>
            <p className="text-neutral-400 text-xs uppercase tracking-widest mb-2">Ваша оценка</p>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(n)}
                  className={`w-7 h-7 text-xs font-bold rounded transition-colors ${
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
              placeholder="Напишите рецензию..."
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded p-3 resize-none h-24 placeholder:text-neutral-600 focus:outline-none focus:border-burgundy transition-colors mb-3"
            />
            <button
              onClick={() => { if (rating > 0) setSubmitted(true); }}
              disabled={rating === 0}
              className="w-full bg-burgundy hover:bg-burgundy-light disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded transition-colors"
            >
              Опубликовать рецензию
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <Icon name="CheckCircle" size={40} className="text-burgundy mx-auto mb-2" />
            <p className="text-white font-semibold">Рецензия опубликована!</p>
            <p className="text-neutral-500 text-sm mt-1">Спасибо за вклад в культуру</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MemeGrid() {
  const [selected, setSelected] = useState<typeof MEMES[0] | null>(null);

  return (
    <section id="memes" className="bg-black px-4 md:px-8 lg:px-16 py-14">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-white text-xl font-bold uppercase tracking-widest">
          Свежие мемы
        </h2>
        <span className="text-neutral-600 text-sm">{MEMES.length} мемов</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MEMES.map((meme) => (
          <div
            key={meme.id}
            className="group relative bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg overflow-hidden hover:border-burgundy transition-all duration-300 cursor-pointer"
            onClick={() => setSelected(meme)}
          >
            <div className="relative overflow-hidden h-52">
              <img
                src={meme.thumb}
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
                {meme.rating}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{meme.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 text-xs">@{meme.author}</span>
                <span className="text-neutral-600 text-xs flex items-center gap-1">
                  <Icon name="MessageSquare" size={11} />
                  {meme.reviews}
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

      {selected && <ReviewModal meme={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

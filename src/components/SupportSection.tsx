import Icon from "@/components/ui/icon";

const OPTIONS = [
  {
    id: "burn",
    label: "Бёрн классический",
    emoji: "⚡",
    desc: "Заряди автора энергетиком",
    price: "99 ₽",
    color: "from-blue-900/30 to-transparent",
    border: "border-blue-900/50 hover:border-blue-700",
    btn: "bg-blue-800 hover:bg-blue-700",
  },
  {
    id: "coffee",
    label: "Кофе",
    emoji: "☕",
    desc: "Угости автора кофе",
    price: "149 ₽",
    color: "from-amber-900/30 to-transparent",
    border: "border-amber-900/50 hover:border-amber-700",
    btn: "bg-amber-800 hover:bg-amber-700",
  },
];

export default function SupportSection() {
  return (
    <section id="support" className="bg-black border-t border-[#1a1a1a] px-4 md:px-8 lg:px-16 py-14">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-burgundy-light text-xs uppercase tracking-[0.4em] mb-3 font-medium">Поддержать автора</p>
        <h2 className="text-white text-3xl md:text-4xl font-black tracking-tight mb-3">
          Понравился мем?
        </h2>
        <p className="text-neutral-500 text-sm mb-10">
          Авторы стараются ради вас. Небольшой жест — большая мотивация.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {OPTIONS.map((opt) => (
            <div
              key={opt.id}
              className={`relative bg-gradient-to-br ${opt.color} bg-[#0d0d0d] border ${opt.border} rounded-xl p-6 text-left transition-all duration-300 group cursor-pointer`}
            >
              <div className="text-4xl mb-3">{opt.emoji}</div>
              <h3 className="text-white font-bold text-base mb-1">{opt.label}</h3>
              <p className="text-neutral-500 text-sm mb-4">{opt.desc}</p>
              <button className={`${opt.btn} text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors w-full`}>
                Угостить за {opt.price}
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1a1a1a] pt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-neutral-600 text-sm">
            <Icon name="Heart" size={14} className="text-burgundy" />
            <span>Сделано с любовью к интернет-культуре</span>
          </div>
          <p className="text-neutral-700 text-xs">{new Date().getFullYear()} MEMEs — все мемы принадлежат авторам</p>
        </div>
      </div>
    </section>
  );
}

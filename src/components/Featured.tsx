export default function Featured() {
  const features = [
    { emoji: "⬇️", title: "Скачивание", desc: "Сохраняй любой мем в один клик. Без водяных знаков и ограничений." },
    { emoji: "⭐", title: "Рейтинги", desc: "Оценивай мемы от 1 до 10. Лучшие попадают в топ." },
    { emoji: "✍️", title: "Рецензии", desc: "Пиши развёрнутые обзоры и делись мнением с сообществом." },
  ];

  return (
    <div id="features" className="flex flex-col lg:flex-row lg:justify-between lg:items-center min-h-screen px-6 py-12 lg:py-0 bg-white">
      <div className="flex-1 h-[400px] lg:h-[800px] mb-8 lg:mb-0 lg:order-2">
        <img
          src="https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/fb15952e-c129-440b-9bd7-e5eaf113132a.jpg"
          alt="Meme rating system"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 text-left lg:h-[800px] flex flex-col justify-center lg:mr-12 lg:order-1">
        <h3 className="uppercase mb-4 text-sm tracking-wide text-neutral-600">Всё для настоящего мем-критика</h3>
        <p className="text-2xl lg:text-4xl mb-10 text-neutral-900 leading-tight">
          Не просто смотреть — оценивать, коллекционировать и рассказывать, почему этот мем — шедевр.
        </p>
        <div className="flex flex-col gap-6 mb-10">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4 items-start">
              <span className="text-2xl">{f.emoji}</span>
              <div>
                <h4 className="font-bold text-neutral-900 uppercase text-sm tracking-wide mb-1">{f.title}</h4>
                <p className="text-neutral-600 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="bg-black text-white border border-black px-4 py-2 text-sm transition-all duration-300 hover:bg-white hover:text-black cursor-pointer w-fit uppercase tracking-wide">
          Смотреть мемы
        </button>
      </div>
    </div>
  );
}

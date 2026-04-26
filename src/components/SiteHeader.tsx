export default function SiteHeader() {
  return (
    <header className="relative h-[70vh] min-h-[500px] flex flex-col overflow-hidden">
      <img
        src="https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/e1632369-5de7-4789-b180-5f9ab3c8a13f.jpg"
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />

      <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-5">
        <span className="text-burgundy-light text-xs uppercase tracking-[0.3em] font-semibold">меметека</span>
        <div className="flex gap-6 text-sm text-neutral-400 uppercase tracking-widest">
          <a href="#memes" className="hover:text-white transition-colors">Мемы</a>
          <a href="#support" className="hover:text-white transition-colors">Поддержать</a>
        </div>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        <p className="text-burgundy-light text-xs uppercase tracking-[0.4em] mb-4 font-medium">интернет-культура</p>
        <h1 className="text-[14vw] md:text-[11vw] lg:text-[9vw] font-black leading-none tracking-tighter text-white mb-4">
          MEMEs
        </h1>
        <p className="text-neutral-400 text-sm md:text-base max-w-md">
          Скачивай, оценивай и пиши рецензии на лучшие моменты кинематографа
        </p>
      </div>
    </header>
  );
}
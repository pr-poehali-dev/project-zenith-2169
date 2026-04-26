import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "50vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/20828359-70e4-49c2-892c-afdf7369de58.jpg"
          alt="Meme culture collage"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          МЕМЫ
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto px-6 opacity-90 mb-8">
          Скачивай лучшие мемы, ставь оценки и оставляй рецензии. Интернет-культура под одной крышей.
        </p>
        <button className="bg-white text-black px-8 py-3 uppercase tracking-wide text-sm font-bold hover:bg-neutral-200 transition-colors duration-300 cursor-pointer">
          Начать бесплатно
        </button>
      </div>
    </div>
  );
}
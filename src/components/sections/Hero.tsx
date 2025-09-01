"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-40"
           style={{ backgroundImage:
            "url(https://images.unsplash.com/photo-1529336953121-ad52c2f8f0f9?q=80&w=1974&auto=format&fit=crop)",
                    backgroundSize:"cover", backgroundPosition:"center" }} />
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7}}
                   className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Engenharia de <span className="text-cyan-300">Software</span> & Sites com
          <span className="text-cyan-300"> IoT</span>, UX e SEO de Elite
        </motion.h1>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1,duration:0.7}}
                  className="mt-4 max-w-2xl text-lg text-slate-200">
          Projetos full-stack, performance obsessiva e crescimento orgânico comprovado.
        </motion.p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contato" className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700">Iniciar projeto</Link>
          <Link href="/portfolio" className="px-4 py-2 rounded-xl border border-white/20">Ver portfólio</Link>
        </div>
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-slate-950/70 border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-lg">BTriCode</Link>
        <div className="hidden md:flex gap-6 text-sm text-slate-300">
          <Link href="/servicos">Serviços</Link>
          <Link href="/portfolio">Portfólio</Link>
          <Link href="/duvidas">Dúvidas</Link>
          <Link href="/iot-lab">IoT Lab</Link>
          <Link href="/apoio">Apoio</Link>
          <Link href="/converse-com-po">PO</Link>
          <Link href="/pergunte-seo">SEO</Link>
          <Link href="/contato">Contato</Link>
        </div>
      </nav>
    </header>
  );
}

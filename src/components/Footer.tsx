export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 text-sm">
      <div className="mx-auto max-w-7xl px-4 grid gap-6 md:grid-cols-4">
        <div>
          <div className="font-semibold mb-2">BTriCode</div>
          <p className="text-slate-400">Software, UX, SEO e IoT para negócios que querem crescer com tecnologia.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Políticas</div>
          <ul className="space-y-1 text-slate-300">
            <li>Privacidade</li><li>Termos</li><li>LGPD</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Contato</div>
          <p className="text-slate-300">contato@btricode.com<br/>+55 (11) 97279-0365</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 mt-8 text-slate-500">
        © {new Date().getFullYear()} BTriCode. Todos os direitos reservados.
      </div>
    </footer>
  );
}

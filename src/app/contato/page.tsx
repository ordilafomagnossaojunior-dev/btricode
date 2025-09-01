import ContactForm from "@/components/forms/ContactForm";

export const metadata = {
  title: "Contato | BTriCode",
  description: "Fale com a BTriCode: orçamento, dúvidas e parcerias.",
};

export default function ContatoPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 grid gap-8 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
        <h1 className="text-3xl font-bold mb-4">Entre em contato</h1>
        <p className="text-slate-300 mb-6">
          Prefere e-mail direto?{" "}
          <a className="text-sky-400 underline" href="mailto:contato@btricode.com">
            contato@btricode.com
          </a>
        </p>
        <ContactForm />
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 min-h-[420px]">
        <img
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1600&auto=format&fit=crop"
          alt="Atendimento BTriCode"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
      </div>
    </section>
  );
}

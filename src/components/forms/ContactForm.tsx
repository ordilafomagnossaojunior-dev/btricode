"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validators";

export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(data: ContactInput) {
    setMsg(null);
    const res = await fetch("/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const out = await res.json();
    if (res.ok && (out?.ok || out?.success)) {
      setMsg("Mensagem enviada! Em breve entraremos em contato.");
      reset();
    } else {
      setMsg("Não foi possível enviar agora. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      {/* Honeypot escondido */}
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} />

      <div>
        <label className="text-sm">Nome</label>
        <input
          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950/50 border border-white/10"
          placeholder="Seu nome"
          {...register("nome")}
        />
        {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <label className="text-sm">Email</label>
        <input
          type="email"
          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950/50 border border-white/10"
          placeholder="Seu e-mail@"
          {...register("email")}
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="text-sm">Telefone</label>
        <input
          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950/50 border border-white/10"
          placeholder="(00) 00000-0000"
          {...register("telefone")}
        />
      </div>

      <div>
        <label className="text-sm">Mensagem</label>
        <textarea
          rows={5}
          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950/50 border border-white/10"
          placeholder="Conte brevemente sobre o seu projeto"
          {...register("mensagem")}
        />
        {errors.mensagem && <p className="text-red-400 text-xs mt-1">{errors.mensagem.message}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50"
        >
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
        {msg && <span className="text-emerald-400 text-sm">{msg}</span>}
      </div>
    </form>
  );
}

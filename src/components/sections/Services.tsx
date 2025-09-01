"use client";

import { useState } from "react";
import Tilt from "react-parallax-tilt";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Code, Server, Cpu, Search, Shield, Users, type LucideIcon } from "lucide-react";

/** Tipagem dos serviços */
type Service = {
  title: string;
  blurb: string;
  icon: LucideIcon;
  forLeigos: string;
  whatWeDo: string[];
  whyItMatters: string[];
  benefits: string[];
};

/** Catálogo de serviços (conteúdo exibido no modal) */
const SERVICES: Service[] = [
  {
    title: "Websites & Portais",
    blurb: "Next.js, SSR/SSG, i18n, CMS e integrações.",
    icon: Code,
    forLeigos:
      "Construímos sites e portais modernos, rápidos e acessíveis para empresas e projetos.",
    whatWeDo: [
      "Sites institucionais responsivos.",
      "Integrações com CMS (WordPress, Strapi, etc.).",
      "Internacionalização (i18n).",
      "SEO otimizado com SSR/SSG.",
    ],
    whyItMatters: [
      "Presença digital profissional.",
      "Performance que melhora SEO.",
      "Acessível em múltiplos idiomas.",
    ],
    benefits: ["Velocidade", "Visibilidade", "Escalabilidade"],
  },
  {
    title: "Software & APIs",
    blurb: "Arquitetura limpa, testes, observabilidade e CI/CD.",
    icon: Server,
    forLeigos:
      "Backends e APIs confiáveis conectam sistemas e viabilizam produtos digitais.",
    whatWeDo: [
      "APIs REST/GraphQL com boas práticas.",
      "Integrações com terceiros.",
      "Testes, logs estruturados e métricas.",
      "CI/CD para deploy seguro e frequente.",
    ],
    whyItMatters: [
      "Menos incidentes em produção.",
      "Diagnóstico rápido com observabilidade.",
      "Evolução constante com segurança.",
    ],
    benefits: ["Confiabilidade", "Segurança", "Agilidade"],
  },
  {
    title: "IoT & Edge AI",
    blurb: "MQTT/HTTP, dashboards e visão computacional.",
    icon: Cpu,
    forLeigos:
      "Conectamos dispositivos inteligentes e levamos inteligência para a borda da rede.",
    whatWeDo: [
      "Integração via MQTT e HTTP.",
      "Dashboards em tempo real.",
      "Visão computacional com IA.",
      "Automação e telemetria.",
    ],
    whyItMatters: [
      "Monitoramento remoto eficiente.",
      "Decisões baseadas em dados.",
      "Automação de processos.",
    ],
    benefits: ["Inovação", "Eficiência", "Controle em tempo real"],
  },
  {
    title: "SEO Avançado",
    blurb: "Core Web Vitals, Schema, sitemap e conteúdo 10x.",
    icon: Search,
    forLeigos:
      "Aparecer no Google é vital. O SEO garante tráfego orgânico de qualidade.",
    whatWeDo: [
      "Auditoria técnica completa.",
      "Implementação de Core Web Vitals.",
      "Schema.org e dados estruturados.",
      "Estratégia de conteúdo otimizado.",
    ],
    whyItMatters: [
      "Mais visitantes qualificados.",
      "Melhor ranqueamento no Google.",
      "Crescimento orgânico sustentável.",
    ],
    benefits: ["Mais tráfego", "Melhor reputação", "Mais conversões"],
  },
  {
    title: "Segurança",
    blurb: "OWASP, autenticação, criptografia e conformidade.",
    icon: Shield,
    forLeigos: "Protegemos sistemas e dados contra ameaças digitais.",
    whatWeDo: [
      "Implementação de OWASP Top 10.",
      "Autenticação forte (MFA, OAuth2).",
      "Criptografia ponta a ponta.",
      "Monitoramento de vulnerabilidades.",
    ],
    whyItMatters: [
      "Menos riscos de ataques.",
      "Proteção da reputação da empresa.",
      "Conformidade com LGPD e GDPR.",
    ],
    benefits: ["Segurança", "Confiabilidade", "Proteção legal"],
  },
  {
    title: "UX & Pesquisa",
    blurb: "Jornadas, testes com usuários e analytics.",
    icon: Users,
    forLeigos:
      "Garantimos que o usuário tenha a melhor experiência possível em seu produto digital.",
    whatWeDo: [
      "Mapeamento de jornadas do usuário.",
      "Testes de usabilidade.",
      "Análise de métricas e feedbacks.",
      "Ajustes de UX baseados em dados.",
    ],
    whyItMatters: [
      "Usuários mais satisfeitos.",
      "Menos abandono de clientes.",
      "Produtos intuitivos e acessíveis.",
    ],
    benefits: ["Experiência", "Retenção", "Engajamento"],
  },
];

export default function Services() {
  const [selected, setSelected] = useState<Service | null>(null);

  return (
    <section id="services" className="py-20 bg-slate-950 text-slate-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Serviços
        </h2>
        <p className="text-center text-slate-400 mb-12">
          Do discovery ao deploy — ponta a ponta.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <button
              key={service.title}
              type="button"
              onClick={() => setSelected(service)}
              className="text-left"
              aria-label={`Abrir detalhes de ${service.title}`}
            >
              <Tilt
                glareEnable
                glareMaxOpacity={0.2}
                glareColor="#22d3ee" // cyan-400
                glarePosition="all"
                scale={1.02}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 cursor-pointer shadow-md hover:shadow-cyan-500/20 transition"
              >
                <service.icon className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-400">{service.blurb}</p>
                <span className="text-cyan-400 text-sm mt-4 inline-block">
                  Saiba mais →
                </span>
              </Tilt>
            </button>
          ))}
        </div>

        {/* Modal */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-950 text-slate-100 rounded-2xl shadow-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-cyan-400">
                {selected?.title}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {selected?.blurb}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-6">
              {/* Para leigos */}
              <section>
                <h4 className="font-semibold text-emerald-400 mb-2">
                  Para leigos
                </h4>
                <p className="text-slate-200 leading-relaxed">
                  {selected?.forLeigos}
                </p>
              </section>

              {/* O que fazemos */}
              <section>
                <h4 className="font-semibold text-emerald-400 mb-2">
                  O que fazemos
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-200">
                  {selected?.whatWeDo.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>

              {/* Por que isso importa */}
              <section>
                <h4 className="font-semibold text-emerald-400 mb-2">
                  Por que isso importa
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-200">
                  {selected?.whyItMatters.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>

              {/* Benefícios */}
              <section>
                <h4 className="font-semibold text-emerald-400 mb-2">
                  Benefícios
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-200">
                  {selected?.benefits.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}


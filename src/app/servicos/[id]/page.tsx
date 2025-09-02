import type { Metadata } from "next";

// No Next 15, trate params como Promise
type Params = Promise<{ id: string }>;

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Serviço ${id} | BTriCode`,
    description: `Detalhes do serviço ${id} da BTriCode.`,
  };
}

export default async function Page(
  { params }: { params: Params }
) {
  const { id } = await params;

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Serviço: {id}</h1>
      <p className="opacity-80">
        Esta é a página de detalhes do serviço <strong>{id}</strong>.
      </p>
    </section>
  );
}

// (Opcional) Geração estática de algumas rotas
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  return [{ id: "websites" }, { id: "apis" }, { id: "iot" }, { id: "seo" }, { id: "security" }, { id: "ux" }];
}

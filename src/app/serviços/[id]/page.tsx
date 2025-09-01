import { redirect } from "next/navigation";

export default function ServiceAlias({ params }: { params: { id: string } }) {
  // Ex.: /servicos/iot -> /?servico=iot (abre modal na Home)
  redirect(`/?servico=${encodeURIComponent(params.id)}`);
}

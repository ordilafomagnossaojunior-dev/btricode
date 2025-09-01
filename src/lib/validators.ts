import { z } from "zod";

export const contactSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Email inválido."),
  telefone: z.string().optional(),
  mensagem: z.string().min(10, "Conte mais detalhes (mín. 10 caracteres)."),
  // honeypot anti-spam (campo escondido deve ficar vazio)
  website: z.string().max(0, "Bot detectado.").optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

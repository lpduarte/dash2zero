import { Cluster, EmailTemplate } from "@/types/cluster";

export const mockClusters: Cluster[] = [
  {
    id: "1",
    name: "Parceiros Estratégicos",
    providers: [
      {
        id: "p1",
        name: "Tech Solutions Lda",
        nif: "501234567",
        email: "contact@techsolutions.pt",
        status: "completed",
        emailsSent: 3,
        lastContact: new Date("2025-01-15"),
      },
      {
        id: "p2",
        name: "Green Energy SA",
        nif: "502345678",
        email: "info@greenenergy.pt",
        status: "in-progress",
        emailsSent: 2,
        lastContact: new Date("2025-01-20"),
      },
      {
        id: "p3",
        name: "Logistics Pro",
        nif: "503456789",
        email: "hello@logisticspro.pt",
        status: "not-registered",
        emailsSent: 1,
        lastContact: new Date("2025-01-10"),
      },
    ],
    createdAt: new Date("2024-12-01"),
  },
  {
    id: "2",
    name: "Clientes Premium",
    providers: [
      {
        id: "p4",
        name: "Retail Corp",
        nif: "504567890",
        email: "contact@retailcorp.pt",
        status: "not-registered",
        emailsSent: 0,
      },
      {
        id: "p5",
        name: "Construction Masters",
        nif: "505678901",
        email: "info@constructionmasters.pt",
        status: "in-progress",
        emailsSent: 1,
        lastContact: new Date("2025-01-18"),
      },
    ],
    createdAt: new Date("2025-01-01"),
  },
];

export const emailTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Boas-vindas",
    subject: "Bem-vindo ao dash2zero - Vamos reduzir a pegada de carbono juntos",
    body: `Olá {{nome}},

É com grande satisfação que convidamos a vossa empresa a juntar-se ao dash2zero, a plataforma que está a revolucionar a forma como as empresas monitorizam e reduzem a sua pegada de carbono.

**Porquê o dash2zero?**
• Monitorização em tempo real das emissões de carbono
• Relatórios automáticos e insights acionáveis
• Apoio na definição de metas de redução
• Certificação e reconhecimento de boas práticas

**Próximos passos:**
1. Aceda à plataforma através do link abaixo
2. Complete o seu perfil empresarial
3. Insira os dados iniciais de emissões
4. Comece a monitorizar e melhorar

Em caso de dúvidas, a nossa equipa está disponível para ajudar.

Juntos por um futuro mais sustentável,
Equipa dash2zero`,
    applicableStatus: ["not-registered"],
  },
  {
    id: "reminder",
    name: "Lembrete de Progresso",
    subject: "dash2zero - Continue o seu progresso",
    body: `Olá {{nome}},

Notámos que iniciou o processo de registo no dash2zero, mas ainda há alguns passos por completar.

**O que falta:**
• Completar o perfil da empresa
• Inserir dados de emissões iniciais
• Validar informações de contacto

Lembre-se: quanto mais cedo completar, mais cedo poderá beneficiar de insights valiosos sobre a sua pegada de carbono.

Aceda à plataforma e continue de onde parou.

Contamos com a vossa colaboração,
Equipa dash2zero`,
    applicableStatus: ["in-progress"],
  },
  {
    id: "followup",
    name: "Acompanhamento Regular",
    subject: "dash2zero - Novidades e atualizações",
    body: `Olá {{nome}},

Obrigado por fazer parte da comunidade dash2zero!

**Novidades:**
• Novos relatórios de benchmark setorial disponíveis
• Webinar gratuito sobre estratégias de redução de carbono
• Novas funcionalidades de análise preditiva

Continue a monitorizar as vossas métricas e explore as novas ferramentas disponíveis na plataforma.

Juntos estamos a fazer a diferença,
Equipa dash2zero`,
    applicableStatus: ["completed", "in-progress"],
  },
];

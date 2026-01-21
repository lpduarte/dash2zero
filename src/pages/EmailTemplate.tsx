import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Leaf,
  TrendingDown,
  BarChart3,
  Euro,
  Smartphone,
  Monitor,
  Clock,
  AlertTriangle,
  Zap,
  PiggyBank,
  FileCheck,
  Building2,
  Calculator,
  Target,
  Shield,
  Banknote,
  Award
} from "lucide-react";
import { header } from "@/lib/styles";
import headerImage from "/img/header.jpg";

type TemplateId = "t1" | "t2" | "t3" | "t4";

interface EmailTemplateData {
  id: TemplateId;
  name: string;
  subject: string;
  description: string;
}

const templates: EmailTemplateData[] = [
  { id: "t1", name: "Convite Inicial", subject: "Convite: Calcule a pegada de carbono da sua empresa (gratuito)", description: "Primeiro contacto" },
  { id: "t2", name: "Lembrete", subject: "Ainda a tempo: ferramenta gratuita de poupança energética", description: "Follow-up amigável" },
  { id: "t3", name: "Benefícios", subject: "Empresas em Cascais já pouparam milhares de euros com esta ferramenta", description: "Foco em poupança" },
  { id: "t4", name: "Urgente", subject: "Ação necessária: Novos requisitos de reporte de emissões", description: "Prazos e regulamentação" },
];

const EmailTemplate = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("t1");
  const [subject, setSubject] = useState(templates[0].subject);
  const [responsibleName, setResponsibleName] = useState("João Silva");
  const [responsibleRole, setResponsibleRole] = useState("Coordenador de Sustentabilidade");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const handleTemplateChange = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
    }
  };

  const currentTemplate = templates.find(t => t.id === selectedTemplate)!;

  // Render email body based on selected template
  const renderEmailBody = () => {
    switch (selectedTemplate) {
      case "t1":
        return <ConviteInicialBody />;
      case "t2":
        return <LembreteBody />;
      case "t3":
        return <BeneficiosBody />;
      case "t4":
        return <UrgenteBody />;
      default:
        return <ConviteInicialBody />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Pré-visualização do Email</h1>

          {/* View mode toggle */}
          <div className={header.navContainer}>
            <button
              className={viewMode === "desktop" ? header.navButtonActive : header.navButtonInactive}
              onClick={() => setViewMode("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              className={viewMode === "mobile" ? header.navButtonActive : header.navButtonInactive}
              onClick={() => setViewMode("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Editable fields */}
        <Card className="p-6 mb-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="template" className="text-sm font-medium">Template</Label>
              <Select value={selectedTemplate} onValueChange={(v) => handleTemplateChange(v as TemplateId)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(t => (
                    <SelectItem key={t.id} value={t.id} className="py-2">
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="font-medium">{t.name}</span>
                        <span className="text-xs opacity-70">{t.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nome do responsável</Label>
              <Input
                id="name"
                className="h-10"
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Cargo</Label>
              <Input
                id="role"
                className="h-10"
                value={responsibleRole}
                onChange={(e) => setResponsibleRole(e.target.value)}
                placeholder="Cargo ou função"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">Assunto do email</Label>
            <Input
              id="subject"
              className="h-10"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto do email"
            />
          </div>
        </Card>

        {/* Email Preview Container */}
        <div
          className={`mx-auto transition-all duration-300 ${
            viewMode === "mobile" ? "max-w-[375px]" : "max-w-[600px]"
          }`}
        >
          <Card className="shadow-lg overflow-hidden">
            {/* Email Content */}
            <div
              id="email-content"
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                backgroundColor: "#ffffff",
                maxWidth: "600px",
                margin: "0 auto"
              }}
            >
              {/* Google Fonts import for email clients that support it */}
              <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
              `}} />

              {/* Header with dash2zero + Cascais branding */}
              <div
                style={{
                  borderRadius: "8px 8px 0 0",
                  overflow: "hidden" as const
                }}
              >
                <img
                  src={headerImage}
                  alt="dash2zero + Cascais"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                    maxWidth: "600px"
                  }}
                />
              </div>

              {/* Body - changes based on template */}
              <div style={{ padding: "32px 24px" }}>
                {renderEmailBody()}

                {/* CTA Button - same for all */}
                <div style={{ textAlign: "center" as const, marginBottom: "24px" }}>
                  <a
                    href="https://dash2zero.lovable.app/onboarding"
                    style={{
                      display: "inline-block",
                      backgroundColor: "hsl(175 66% 38%)",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: 700,
                      padding: "14px 32px",
                      borderRadius: "8px",
                      textDecoration: "none"
                    }}
                  >
                    {selectedTemplate === "t4" ? "Começar agora" : "Participar gratuitamente"}
                  </a>
                </div>

                {/* Support text */}
                <p style={{ fontSize: "14px", color: "#6a6a6a", textAlign: "center" as const, marginBottom: "32px" }}>
                  {selectedTemplate === "t1" && "O processo demora menos de 30 minutos. Se precisar de ajuda, estamos disponíveis."}
                  {selectedTemplate === "t2" && "Responda a este email se precisar de ajuda — temos uma equipa pronta para apoiá-lo."}
                  {selectedTemplate === "t3" && "Sem custos, sem compromissos. A ferramenta é 100% gratuita para empresas de Cascais."}
                  {selectedTemplate === "t4" && "A nossa equipa está disponível para sessões de apoio individual. Responda para agendar."}
                </p>

                {/* Signature */}
                <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: "24px" }}>
                  <p style={{ fontSize: "14px", color: "#4a4a4a", marginBottom: "8px" }}>
                    Com os melhores cumprimentos,
                  </p>
                  <p style={{ fontSize: "15px", color: "#1a1a1a", fontWeight: 700, marginBottom: "4px" }}>
                    {responsibleName}
                  </p>
                  <p style={{ fontSize: "14px", color: "#6a6a6a", marginBottom: "4px" }}>
                    {responsibleRole}
                  </p>
                  <p style={{ fontSize: "14px", color: "#6a6a6a" }}>
                    Município de Cascais
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "24px",
                  textAlign: "center" as const
                }}
              >
                {/* Powered by */}
                <div style={{ marginBottom: "16px" }}>
                  <span style={{ fontSize: "12px", color: "#8a8a8a" }}>Uma iniciativa</span>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginLeft: "8px"
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "4px",
                        backgroundColor: "hsl(168 71% 31% / 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Leaf style={{ width: "12px", height: "12px", color: "hsl(175 66% 38%)" }} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a" }}>
                      Dash2Zero
                    </span>
                  </div>
                </div>

                {/* Legal links */}
                <div style={{ fontSize: "12px", color: "#8a8a8a" }}>
                  <a href="#" style={{ color: "#8a8a8a", textDecoration: "underline" }}>
                    Política de Privacidade
                  </a>
                  <span style={{ margin: "0 8px" }}>•</span>
                  <a href="#" style={{ color: "#8a8a8a", textDecoration: "underline" }}>
                    Cancelar subscrição
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TEMPLATE 1: CONVITE INICIAL
// ============================================================================
const ConviteInicialBody = () => (
  <>
    <p style={{ fontSize: "16px", color: "#1a1a1a", marginBottom: "24px" }}>
      Caro/a responsável,
    </p>

    <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "16px" }}>
      O Município de Cascais está a disponibilizar <strong style={{ color: "#1a1a1a" }}>acesso gratuito</strong> a
      uma ferramenta que ajuda empresas a reduzir custos energéticos e a prepararem-se para os novos
      requisitos de sustentabilidade.
    </p>

    <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "24px" }}>
      Com a plataforma <strong style={{ color: "#1a1a1a" }}>Get2Zero Simple</strong>, pode:
    </p>

    {/* Benefits list */}
    <div style={{ marginBottom: "24px" }}>
      {[
        { icon: <PiggyBank className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, text: "Identificar onde está a gastar mais em energia e como poupar" },
        { icon: <Calculator className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, text: "Calcular a pegada de carbono da sua empresa em menos de 30 minutos" },
        { icon: <BarChart3 className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, text: "Comparar o seu desempenho com outras empresas do mesmo sector" },
        { icon: <Euro className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, text: "Descobrir financiamentos e apoios disponíveis para melhorias" },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "12px 16px",
            backgroundColor: i % 2 === 0 ? "hsl(168 71% 31% / 0.05)" : "transparent",
            borderRadius: "8px",
            marginBottom: "4px"
          }}
        >
          <div style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {item.icon}
          </div>
          <span style={{ fontSize: "15px", color: "#1a1a1a", lineHeight: 1.5 }}>
            {item.text}
          </span>
        </div>
      ))}
    </div>

    {/* Note */}
    <div
      style={{
        backgroundColor: "hsl(168 71% 31% / 0.08)",
        borderLeft: "4px solid hsl(175 66% 38%)",
        padding: "16px",
        borderRadius: "0 8px 8px 0",
        marginBottom: "24px"
      }}
    >
      <p style={{ fontSize: "14px", color: "#4a4a4a", margin: 0, lineHeight: 1.5 }}>
        <strong>Já tem dados de emissões?</strong><br />Pode submeter diretamente — a ferramenta aceita dados existentes.
      </p>
    </div>

    <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "32px" }}>
      Esta iniciativa faz parte do compromisso do Município com o <strong style={{ color: "#1a1a1a" }}>Pacto dos Autarcas</strong>.
      Quanto mais empresas participarem, mais conseguimos planear apoios concretos para a região.
    </p>
  </>
);

// ============================================================================
// TEMPLATE 2: LEMBRETE
// ============================================================================
const LembreteBody = () => (
  <>
    <p style={{ fontSize: "16px", color: "#1a1a1a", marginBottom: "24px" }}>
      Caro/a responsável,
    </p>

    <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "16px" }}>
      Há algumas semanas convidámo-lo a utilizar a ferramenta <strong style={{ color: "#1a1a1a" }}>dash2zero</strong> —
      e gostaríamos de saber se ainda tem interesse.
    </p>

    <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "24px" }}>
      Sabemos que o dia-a-dia de uma empresa é exigente. Por isso, simplificámos ao máximo o processo:
    </p>

    {/* Quick facts */}
    <div style={{ marginBottom: "24px" }}>
      {[
        { icon: <Clock className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, title: "Menos de 30 minutos", text: "para completar o cálculo da pegada" },
        { icon: <Euro className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, title: "100% gratuito", text: "sem custos nem compromissos" },
        { icon: <Zap className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, title: "Resultados imediatos", text: "com recomendações de poupança personalizadas" },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "14px 16px",
            backgroundColor: "hsl(168 71% 31% / 0.05)",
            borderRadius: "8px",
            marginBottom: "8px"
          }}
        >
          <div style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {item.icon}
          </div>
          <div>
            <span style={{ fontSize: "15px", color: "#1a1a1a", fontWeight: 600 }}>{item.title}</span>
            <span style={{ fontSize: "14px", color: "#6a6a6a" }}> — {item.text}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Social proof */}
    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "24px",
        textAlign: "center" as const
      }}
    >
      <p style={{ fontSize: "24px", fontWeight: 700, color: "hsl(175 66% 38%)", marginBottom: "4px" }}>
        47 empresas
      </p>
      <p style={{ fontSize: "14px", color: "#6a6a6a", margin: 0 }}>
        de Cascais já estão a usar a ferramenta
      </p>
    </div>

    <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "32px" }}>
      Se tiver dúvidas ou precisar de ajuda, a nossa equipa pode fazer uma sessão consigo —
      basta responder a este email.
    </p>
  </>
);

// ============================================================================
// TEMPLATE 3: BENEFÍCIOS (foco em poupança)
// ============================================================================
const BeneficiosBody = () => (
  <>
    <p style={{ fontSize: "16px", color: "#1a1a1a", marginBottom: "24px" }}>
      Caro/a responsável,
    </p>

    <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "16px" }}>
      Sabia que empresas que analisam o seu consumo energético conseguem <strong style={{ color: "#1a1a1a" }}>poupar
      entre 10% a 25%</strong> nos custos de energia?
    </p>

    <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "24px" }}>
      A ferramenta <strong style={{ color: "#1a1a1a" }}>dash2zero</strong>, disponibilizada gratuitamente pelo Município,
      já ajudou dezenas de empresas em Cascais a:
    </p>

    {/* Benefits with numbers */}
    <div style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "12px"
        }}
      >
        <div style={{ flex: 1, backgroundColor: "hsl(168 71% 31% / 0.08)", padding: "16px", borderRadius: "8px", textAlign: "center" as const }}>
          <Banknote className="h-6 w-6" style={{ color: "hsl(175 66% 38%)", margin: "0 auto 8px" }} />
          <p style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>€2.400</p>
          <p style={{ fontSize: "12px", color: "#6a6a6a", margin: 0 }}>poupança média anual em energia</p>
        </div>
        <div style={{ flex: 1, backgroundColor: "hsl(168 71% 31% / 0.08)", padding: "16px", borderRadius: "8px", textAlign: "center" as const }}>
          <TrendingDown className="h-6 w-6" style={{ color: "hsl(175 66% 38%)", margin: "0 auto 8px" }} />
          <p style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>18%</p>
          <p style={{ fontSize: "12px", color: "#6a6a6a", margin: 0 }}>redução média de emissões</p>
        </div>
      </div>
    </div>

    {/* Key benefits */}
    <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", marginBottom: "12px" }}>
      O que ganha ao participar:
    </p>
    <div style={{ marginBottom: "24px" }}>
      {[
        { icon: <Target className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, text: "Diagnóstico completo dos seus maiores custos energéticos" },
        { icon: <Zap className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, text: "Recomendações práticas de poupança, ordenadas por impacto" },
        { icon: <Euro className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, text: "Acesso prioritário a fundos de eficiência energética" },
        { icon: <Award className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, text: "Selo de empresa sustentável para usar na comunicação" },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 0",
            borderBottom: i < 3 ? "1px solid #f0f0f0" : "none"
          }}
        >
          <div style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {item.icon}
          </div>
          <span style={{ fontSize: "14px", color: "#4a4a4a", lineHeight: 1.4 }}>
            {item.text}
          </span>
        </div>
      ))}
    </div>

    {/* Testimonial style */}
    <div
      style={{
        backgroundColor: "#f8f9fa",
        borderLeft: "4px solid hsl(175 66% 38%)",
        padding: "16px 20px",
        borderRadius: "0 8px 8px 0",
        marginBottom: "32px"
      }}
    >
      <p style={{ fontSize: "14px", color: "#4a4a4a", fontStyle: "italic", marginBottom: "8px", lineHeight: 1.5 }}>
        "Descobrimos que estávamos a gastar 30% mais em climatização do que o necessário.
        Com pequenos ajustes, poupámos mais de €3.000 no primeiro ano."
      </p>
      <p style={{ fontSize: "13px", color: "#6a6a6a", margin: 0 }}>
        — Empresa do sector de serviços, Cascais
      </p>
    </div>
  </>
);

// ============================================================================
// TEMPLATE 4: URGENTE (regulamentação e prazos)
// ============================================================================
const UrgenteBody = () => (
  <>
    <p style={{ fontSize: "16px", color: "#1a1a1a", marginBottom: "24px" }}>
      Caro/a responsável,
    </p>

    {/* Alert box */}
    <div
      style={{
        backgroundColor: "hsl(45 93% 47% / 0.1)",
        border: "1px solid hsl(45 93% 47% / 0.3)",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
      }}
    >
      <AlertTriangle className="h-5 w-5" style={{ color: "hsl(45 93% 47%)", flexShrink: 0, marginTop: "2px" }} />
      <div>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", marginBottom: "4px" }}>
          Novos requisitos de reporte em vigor
        </p>
        <p style={{ fontSize: "13px", color: "#4a4a4a", margin: 0, lineHeight: 1.4 }}>
          A diretiva CSRD da UE exige que cada vez mais empresas reportem as suas emissões de carbono.
          Muitos clientes e parceiros já estão a pedir estes dados aos fornecedores.
        </p>
      </div>
    </div>

    <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "16px" }}>
      Se a sua empresa ainda não tem os dados de pegada de carbono organizados, é importante começar agora.
      Empresas que se prepararem com antecedência:
    </p>

    {/* Benefits of acting now */}
    <div style={{ marginBottom: "24px" }}>
      {[
        { icon: <Shield className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, text: "Evitam multas e penalizações futuras" },
        { icon: <Building2 className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, text: "Mantêm contratos com grandes clientes que exigem dados ESG" },
        { icon: <Euro className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, text: "Acedem a taxas de juro mais baixas em financiamento verde" },
        { icon: <FileCheck className="h-5 w-5" style={{ color: "hsl(175 66% 38%)" }} />, text: "Qualificam-se para concursos públicos com critérios de sustentabilidade" },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "12px 16px",
            backgroundColor: i % 2 === 0 ? "hsl(168 71% 31% / 0.05)" : "transparent",
            borderRadius: "8px",
            marginBottom: "4px"
          }}
        >
          <div style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {item.icon}
          </div>
          <span style={{ fontSize: "15px", color: "#1a1a1a", lineHeight: 1.5 }}>
            {item.text}
          </span>
        </div>
      ))}
    </div>

    {/* Timeline box */}
    <div
      style={{
        backgroundColor: "hsl(168 71% 31% / 0.08)",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "24px"
      }}
    >
      <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", marginBottom: "12px" }}>
        Próximos passos (menos de 30 minutos):
      </p>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
        {[
          "Aceda à plataforma dash2zero",
          "Preencha o questionário com os dados da empresa",
          "Receba o relatório de pegada de carbono",
          "Obtenha recomendações de melhoria e acesso a apoios"
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "hsl(175 66% 38%)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 600,
                flexShrink: 0
              }}
            >
              {i + 1}
            </div>
            <span style={{ fontSize: "14px", color: "#4a4a4a" }}>{step}</span>
          </div>
        ))}
      </div>
    </div>

    <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "32px" }}>
      O Município de Cascais oferece esta ferramenta gratuitamente e tem uma equipa dedicada para ajudar.
      <strong style={{ color: "#1a1a1a" }}> Não deixe para a última hora.</strong>
    </p>
  </>
);

export default EmailTemplate;

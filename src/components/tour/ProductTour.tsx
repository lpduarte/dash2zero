import Joyride, { CallBackProps, STATUS, Step, ACTIONS, EVENTS } from "react-joyride";
import { useTour } from "@/contexts/TourContext";

const tourSteps: Step[] = [
  {
    target: "[data-tour='welcome']",
    content: "Bem-vindo ao Dash2Zero! Esta é a sua plataforma central para monitorizar e gerir as emissões de carbono. Vamos mostrar-lhe as funcionalidades principais.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: "[data-tour='user-type-toggle']",
    content: "Aqui pode alternar entre a vista de Empresa e Município. Cada vista mostra dados e métricas relevantes para o tipo de utilizador selecionado.",
    placement: "bottom",
  },
  {
    target: "[data-tour='navigation']",
    content: "Use estes botões para navegar entre o Dashboard principal e a gestão de Clusters.",
    placement: "bottom",
  },
  {
    target: "[data-tour='notifications']",
    content: "O sino de notificações alerta-o sobre empresas com pegadas pendentes ou outras atualizações importantes.",
    placement: "bottom",
  },
  {
    target: "[data-tour='theme-toggle']",
    content: "Prefere modo escuro? Alterne entre temas claro e escuro conforme a sua preferência.",
    placement: "bottom",
  },
  {
    target: "[data-tour='cluster-selector']",
    content: "Filtre os dados por cluster para analisar grupos específicos de empresas. Cada cluster mostra o número de empresas e o seu potencial de melhoria.",
    placement: "bottom",
  },
  {
    target: "[data-tour='filter-button']",
    content: "Use os filtros avançados para refinar a análise por dimensão da empresa, distrito, concelho ou freguesia.",
    placement: "left",
  },
  {
    target: "[data-tour='metrics-overview']",
    content: "Este painel apresenta os KPIs principais: emissões totais, potencial de melhoria, e médias por faturação, colaborador e área. Clique no ícone de informação para conhecer a metodologia.",
    placement: "top",
  },
  {
    target: "[data-tour='tabs']",
    content: "Navegue entre diferentes vistas: Visão Geral, lista de Empresas, Detalhes das Emissões, Análise por Atividade e Análise por Faturação.",
    placement: "top",
  },
  {
    target: "[data-tour='help-button']",
    content: "Pode iniciar este tour novamente a qualquer momento clicando neste botão de ajuda.",
    placement: "bottom",
  },
];

const tourLocale = {
  back: "Anterior",
  close: "Fechar",
  last: "Terminar",
  next: "Próximo",
  open: "Abrir",
  skip: "Saltar",
};

export function ProductTour() {
  const { isTourRunning, stopTour, setTourCompleted } = useTour();

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, type } = data;

    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      stopTour();
      if (status === STATUS.FINISHED) {
        setTourCompleted(true);
      }
    }

    if (action === ACTIONS.CLOSE && type === EVENTS.STEP_AFTER) {
      stopTour();
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={isTourRunning}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      spotlightClicks
      disableOverlayClose
      locale={tourLocale}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "hsl(175 66% 38%)",
          backgroundColor: "hsl(var(--card))",
          textColor: "hsl(var(--foreground))",
          arrowColor: "hsl(var(--card))",
          overlayColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        },
        tooltipContainer: {
          textAlign: "left",
        },
        tooltipTitle: {
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "8px",
        },
        tooltipContent: {
          fontSize: "14px",
          lineHeight: 1.6,
        },
        buttonNext: {
          backgroundColor: "hsl(175 66% 38%)",
          borderRadius: "8px",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: 500,
        },
        buttonBack: {
          color: "hsl(var(--muted-foreground))",
          marginRight: "10px",
          fontSize: "14px",
        },
        buttonSkip: {
          color: "hsl(var(--muted-foreground))",
          fontSize: "14px",
        },
        buttonClose: {
          color: "hsl(var(--muted-foreground))",
        },
        spotlight: {
          borderRadius: "12px",
        },
        beacon: {
          display: "none",
        },
      }}
      floaterProps={{
        styles: {
          floater: {
            filter: "drop-shadow(0 4px 20px rgba(0, 0, 0, 0.15))",
          },
        },
      }}
    />
  );
}

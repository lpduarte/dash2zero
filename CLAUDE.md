# Instruções para Claude Code

## Design System

Antes de escrever CSS ou escolher estilos, consulta sempre a página de estilos em `src/pages/StyleGuide.tsx`:

- **Cores**: Usar apenas as variáveis CSS definidas em `src/index.css`
- **Tipografia**: Apenas `font-normal` (400) e `font-bold` (700) — não usar `font-medium` ou `font-semibold`
- **Componentes**: Usar os componentes de `src/components/ui/` sempre que possível
- **Espaçamentos e sombras**: Seguir a escala definida no StyleGuide

## Nomenclatura

- Código e comentários técnicos: Inglês
- Textos visíveis ao utilizador (labels, mensagens, tooltips): Português de Portugal

## Terminologia

- Nunca usar "carbónico/carbónica" — usar sempre "de carbono" (ex: "intensidade de carbono", "pegada de carbono")

## Estrutura do Projeto

```
src/
├── components/     # Componentes React reutilizáveis
├── data/          # Dados estáticos e configurações
├── lib/           # Utilitários e funções
├── pages/         # Páginas da aplicação
└── types/         # Definições TypeScript
```

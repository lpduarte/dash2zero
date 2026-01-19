# Dash2Zero

Dashboard de análise de emissões carbónicas para a plataforma Get2C.

## Sobre o Projeto

Dash2Zero é uma aplicação de visualização e análise de emissões de gases com efeito de estufa (GEE), permitindo:

- Monitorização de emissões por Scope 1, 2 e 3 (GHG Protocol)
- Benchmarking setorial com dados INE (Contas das Emissões Atmosféricas)
- Análise de risco carbónico de fornecedores
- Gestão de clusters de empresas
- Visualização geográfica por distrito/município

## Stack Tecnológico

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Recharts** - Visualização de dados

## Desenvolvimento Local

Requisitos: Node.js & npm ([instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

```sh
# Clonar o repositório
git clone <URL_DO_REPO>

# Navegar para o diretório
cd dash2zero-claude

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## Estrutura do Projeto

```
src/
├── components/     # Componentes React
├── data/          # Dados estáticos e configurações
├── lib/           # Utilitários e funções
├── pages/         # Páginas da aplicação
└── types/         # Definições TypeScript
```

## Documentação

- **StyleGuide** (`/style-guide`) - Design system e componentes
- **Metodologia** (`/methodology`) - Documentação metodológica e fontes de dados

## Fontes de Dados

Os fatores de intensidade carbónica são baseados em:

1. **INE** - Contas das Emissões Atmosféricas 1995-2022
2. **APA** - Relatório do Estado do Ambiente
3. **Eurostat** - Air Emissions Accounts by NACE
4. **GHG Protocol** - Corporate Value Chain Standard

---

Get2C · For a cooler world.

# Preparação 127D — Elixir

WebApp de tracking de hábitos e tarefas para o desafio **Preparação 127D**, focado em produtividade para desenvolvedores em busca de vagas internacionais.

## Design

- **Sidebar escura** (Elixir) com navegação: Início, Projetos, Check-in, Hábitos, Pomodoro, Exercícios, Blog.
- **Área principal clara** com cards arredondados, botões tipo toggle no check-in e heatmap de progresso no estilo GitHub.

## Stack

- React 19 + TypeScript
- Tailwind CSS v4
- Zustand (store global)
- React Router
- date-fns

## Como rodar

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173). Na primeira vez, preencha **data de início do desafio**, nome, nível de inglês e anos de experiência para gerar as regras condicionais (ex.: estudo de inglês obrigatório se nível &lt; B2).

## Estrutura do projeto

```
src/
├── components/       # Layout (Sidebar, MainLayout) e dashboard (Heatmap, DailyScoreCard, StatsCards)
├── features/
│   ├── check-in/    # Formulário de check-in (4 perguntas + diário)
│   ├── habits/      # Lista de tarefas diárias com metas
│   └── onboarding/  # Fluxo de início (data, inglês, experiência)
├── pages/           # Dashboard, CheckInPage, HabitsPage, PlaceholderPage
├── store/           # Zustand: perfil, progresso por data, drafts, heatmap, streak, score
├── types/           # Interfaces para integração futura com Supabase
└── utils/
    ├── challengeRules.ts  # Regras 127D (datas, tarefas diárias por nível de inglês, etc.)
    └── score.ts          # Score diário estilo Duolingo
```

## Regras do desafio (core)

- **127 dias** a partir da data de início (segunda a segunda).
- **Diário:** 2 vagas/dia, 1 comentário LinkedIn, 2 curtidas LinkedIn, 1 tech recruiter/dia; inglês 30 min/dia só se nível &lt; B2.
- **Semanal:** 1 Mock Interview.
- **Mensal:** módulos (Prospecção, Processo, Networking), 1 entrevista gravada.
- **Eventos:** feedback após 3 entrevistas técnicas; 4 versões de CV; #codeUp opcional para 6+ anos.

## Integração futura (Supabase)

Em `src/types/index.ts` estão mapeados: `UserProfile`, `DayProgress`, `CheckInAnswers`, `HabitDefinition`, `ContributionDay`, `Metrics`. O store persiste em `localStorage`; basta trocar por chamadas à API/Supabase quando for conectar o banco.

## Build

```bash
npm run build
npm run preview  # preview da build
```

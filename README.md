# Talento Mineral — Frontend do Recrutador

Plataforma de recrutamento voltada ao setor de rochas ornamentais, com foco
inicial em Cachoeiro de Itapemirim/ES. Este repositório contém o **frontend
web do recrutador** — funcional, navegável, e construído para se conectar
futuramente a uma API REST em Node.js + TypeScript com PostgreSQL.

O candidato participa do processo pelo WhatsApp (chatbot, fora do escopo
deste frontend). Aqui, o recrutador pesquisa currículos, desbloqueia dados
completos com créditos, gerencia vagas e acompanha seu histórico.

## Novidades desta versão

Evolução incremental sobre o frontend inicial, sem remover nenhuma
funcionalidade existente:

- **Tema claro/escuro** (Claro/Escuro/Sistema), com toggle no header e
  persistência em localStorage. O modo escuro foi desenhado especificamente
  (não é uma inversão de cores).
- **Central de notificações**: sino no header com contador de não lidas,
  painel rápido e página completa em `/notificacoes`.
- **Currículos favoritos**: favoritar na listagem, aba dedicada em
  Currículos → Favoritos.
- **Filtros avançados**: faixa etária, "+ Mais filtros" expansível, e
  **filtros salvos** (salvar, aplicar, excluir combinações de filtros).
- **Comparação de currículos**: selecione até 4 currículos na listagem e
  compare lado a lado (sem revelar dados protegidos).
- **Currículos compatíveis por vaga**: pontuação determinística (sem IA)
  com base em categoria, experiência, CNH, cidade e disponibilidade.
- **Status de vaga ampliados**: Rascunho, Aberta, Pausada, Encerrada, com
  transições contextuais (Publicar, Pausar, Retomar, Encerrar, Reabrir).
- **Dashboard 2.0**: onboarding inicial, atividade recente, alertas de
  atenção (créditos baixos, vagas paradas) e ações rápidas.
- **Configurações reformulada**: Minha conta, Empresa, Plano e créditos,
  Pagamentos e Preferências de notificação.
- **Histórico com abas**: Todos, Desbloqueios, Pagamentos, Vagas.
- **Alertas de crédito** (normal/atenção/crítico) no Dashboard e em Créditos.
- **Central de Ajuda** (`/ajuda`) com busca e perguntas frequentes.

Terminologia padronizada: a entidade é sempre **"Currículo"** (não
"candidato" ou "perfil"), conforme solicitado.

## Stack

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS v4 (tokens de design via `@theme`, ver `src/styles/tokens.css`)
- Design system "Modern Corporate Technical": petróleo/marinho profundo (`#1D3D59`)
  como cor institucional, bronze mineral (`#8A5B29`) reservado a créditos e
  elementos transacionais, canvas neutro sem brilho (`#F2F2F2`) e tipografia
  Plus Jakarta Sans com figuras tabulares em todas as métricas.
- Persistência local via `localStorage` (simula um backend enquanto ele não existe)

## Como instalar e executar

```bash
npm install
npm run dev       # ambiente de desenvolvimento (http://localhost:5173)
npm run build     # build de produção em /dist
npm run preview   # serve o build de produção localmente
```

## Login de demonstração

```
E-mail: demo@talentomineral.com
Senha:  123456
```

Também é possível criar uma nova conta em `/cadastro` (qualquer e-mail
diferente do e-mail de demonstração funciona).

## Estrutura do projeto

```
src/
├── components/
│   ├── ui/           # Design system: Button, Input, Select, Modal, Table, etc.
│   ├── layout/        # Sidebar, Header, PageHeader, ThemeToggle, NotificationBell
│   ├── candidates/     # CandidateCard, CandidateFilters, SavedFilters, UnlockModal, AssociateCandidateModal
│   ├── jobs/           # JobCard, JobForm, JobStatusBadge, JobCandidateList
│   ├── credits/        # CreditBalanceCard, CreditPlanCard, TransactionList, CreditAlertBanner
│   └── dashboard/      # StatCard, ActivityFeed, OnboardingCard
│
├── pages/              # Uma pasta por rota (Login, Dashboard, Candidates, Jobs, Credits, History,
│                        # Notifications, Help, Settings...)
├── layouts/AppLayout/  # Layout autenticado (sidebar + header + conteúdo)
├── routes/             # ProtectedRoute (proteção de rotas autenticadas)
│
├── services/           # candidateService, jobService, creditService, paymentService, authService,
│                        # notificationService, favoriteService, savedFilterService, compatibilityService,
│                        # activityService, onboardingService, settingsService,
│                        # apiClient.ts (cliente HTTP abstrato) e config.ts
├── types/               # Interfaces TypeScript compartilhadas com o futuro backend
├── mocks/                # Dados de demonstração (candidatos, vagas, créditos, notificações, empresa...)
├── hooks/                # useAuth, useTheme, useToast, useDebounce
├── utils/                # mockDb.ts (banco simulado em localStorage), format.ts, storage.ts, delay.ts
└── styles/               # tokens.css — design tokens (cores claro/escuro, tipografia, sombras)
```

## Como funciona o mock (e por que a aplicação "parece" real)

Como o backend ainda não existe, todos os `services/*.ts` leem e gravam dados
através de `utils/mockDb.ts`, uma camada fina que persiste em `localStorage`.
Isso significa que:

- desbloquear um currículo realmente debita 1 crédito e permanece
  desbloqueado após recarregar a página;
- vagas criadas/editadas/pausadas/encerradas continuam assim após um refresh;
- favoritos, filtros salvos, preferências de notificação, tema e progresso
  do onboarding são preservados;
- o saldo de créditos e o histórico de pagamentos evoluem de verdade.

Para reiniciar a demonstração do zero, limpe o `localStorage` do site (ou
rode `localStorage.clear()` no console do navegador) e recarregue a página —
os dados voltam a ser semeados a partir de `src/mocks/*`.

Nenhum componente de UI acessa `mockDb` ou `localStorage` diretamente — toda
a leitura/escrita passa pelos `services`, exatamente como aconteceria com uma
API real.

## Onde conectar o backend real

1. Abra `src/services/config.ts` e mude:

   ```ts
   export const USE_MOCK_API = false;
   export const API_BASE_URL = "https://sua-api-real.com.br";
   ```

2. Dentro de cada arquivo em `src/services/*.ts`, substitua as chamadas a
   `mockDb` pelas chamadas equivalentes em `apiClient` (já implementado em
   `src/services/apiClient.ts`, com `get/post/put/patch/delete`). Por exemplo,
   em `candidateService.getCandidates`:

   ```ts
   // hoje (mock):
   const all = mockDb.getCandidates().filter(...)

   // depois (API real):
   return apiClient.get<Paginated<Candidate>>(`/api/candidatos/${page}?...`)
   ```

3. **Nenhuma página ou componente precisa ser alterado.** Todos consomem os
   services pela mesma assinatura de função, então a troca de mock por API
   real é inteiramente isolada na camada de services.

   A lógica de compatibilidade (`compatibilityService.ts`) foi propositalmente
   isolada dos componentes que a consomem (`JobDetailsPage`,
   `JobCandidateList`) para permitir substituí-la por uma chamada de
   backend/IA no futuro sem alterar a UI.

## Endpoints esperados pela API real

```
Autenticação
POST   /api/register
POST   /api/login
POST   /api/logout

Candidatos
GET    /api/candidatos/:page
GET    /api/curriculos/:id
POST   /api/curriculos/:id/desbloqueio
GET    /api/curriculos/favoritos
POST   /api/curriculos/:id/favorito
DELETE /api/curriculos/:id/favorito

Vagas
GET    /api/vagas
POST   /api/vagas
GET    /api/vagas/:id
PUT    /api/vagas/:id
PATCH  /api/vagas/:id/status
GET    /api/vagas/:id/candidatos
POST   /api/vagas/:id/candidatos

Planos e créditos
GET    /api/planos
GET    /api/creditos
GET    /api/creditos/historico

Pagamentos
POST   /api/pagamentos

Notificações
GET    /api/notificacoes
PATCH  /api/notificacoes/:id/lida
PATCH  /api/notificacoes/lidas
GET    /api/notificacoes/preferencias
PUT    /api/notificacoes/preferencias

Filtros salvos
GET    /api/filtros-salvos
POST   /api/filtros-salvos
DELETE /api/filtros-salvos/:id

Conta e empresa
GET    /api/conta
PUT    /api/conta
PUT    /api/conta/senha
GET    /api/empresa
PUT    /api/empresa
GET    /api/plano
```

> Observação: o documento de requisitos original continha endpoints com
> typos (ex.: `/api/pagameto`, `/api/currículos`). Os nomes acima já estão
> normalizados, sem acentos e com nomenclatura REST consistente.

## Regras de negócio simuladas no frontend

- RN-3/RN-4/RN-5: o desbloqueio custa exatamente 1 crédito e só ocorre se
  houver saldo suficiente; se a operação falhar, o crédito não é debitado.
- RN-6: dados de contato (`Candidate.contact`) só existem depois do
  desbloqueio — o frontend nunca exibe telefone/e-mail falsos antes disso.
- RN-8: associação de currículo a vaga só é permitida para vagas da empresa
  do recrutador autenticado (`jobService.associateCandidate`).
- RN-9: alteração de status de vaga reflete imediatamente na interface após
  a confirmação.
- Compatibilidade é um **apoio visual determinístico**, não uma decisão
  automática — nunca oculta ou impede a visualização de currículos.

Regras ainda não definidas no documento de requisitos (ex.: limites exatos
de plano) foram implementadas de forma simples e isolada, para facilitar
ajustes futuros sem refatoração.

## Estados de interface

Todas as telas de listagem/detalhe tratam quatro estados: carregando
(skeletons/spinners), vazio (`EmptyState` com ação sugerida), erro
(`ErrorState` com opção de tentar novamente) e sucesso.

## Acessibilidade

- Todos os campos possuem `<label>` associado; botões são `<button>` reais.
- Foco visível (`:focus-visible`) em toda a aplicação, inclusive no tema escuro.
- Mensagens de erro de formulário são associadas via `aria-describedby`.
- Modais usam `role="dialog"`, `aria-modal` e fecham com `Esc`.
- Estados não dependem apenas de cor (ex.: badges de status têm texto,
  currículos protegidos mostram "🔒 Contato protegido", não só um ícone).

## O que não foi implementado (por decisão do escopo)

Conforme os requisitos, esta etapa não inclui: backend/API real,
PostgreSQL, integração real com Mercado Pago, integração real com
WhatsApp, chatbot funcional, autenticação real, upload real de
fotos/áudios/logo, IA de matching real, CRM/Kanban/pipeline de
contratação, perfil público de empresa, associação entre múltiplas
empresas, ou múltiplos idiomas.


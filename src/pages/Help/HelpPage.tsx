import { useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { SearchInput } from "../../components/ui/SearchInput";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Como funciona o desbloqueio de um currículo?",
    answer:
      "Cada currículo bloqueado mostra apenas informações básicas (categoria, cidade, experiência, CNH, disponibilidade). Ao desbloquear, você utiliza 1 crédito e passa a visualizar nome e dados de contato completos, de forma permanente.",
  },
  {
    question: "Como comprar créditos?",
    answer:
      'Acesse "Créditos" no menu lateral e clique em "Comprar créditos". Escolha um dos planos disponíveis e confirme a compra — o saldo é atualizado automaticamente após a aprovação.',
  },
  {
    question: "Como criar uma vaga?",
    answer:
      'No menu "Vagas", clique em "+ Nova vaga" e preencha título, categoria, localização, descrição e requisitos. Você pode salvar como rascunho ou publicar a vaga imediatamente.',
  },
  {
    question: "Como encontrar currículos compatíveis com minha vaga?",
    answer:
      'Abra os detalhes de uma vaga e utilize a aba "Compatíveis". A plataforma calcula uma pontuação com base em categoria profissional, experiência, CNH, cidade e disponibilidade — um apoio visual, não uma decisão automática.',
  },
  {
    question: "O que acontece quando eu desbloqueio um currículo?",
    answer:
      "O currículo passa a ficar marcado como desbloqueado para sempre na sua conta, com nome e contato visíveis, e 1 crédito é debitado do seu saldo. Não há cobranças adicionais para revisitar um currículo já desbloqueado.",
  },
  {
    question: "Como funciona o WhatsApp para os candidatos?",
    answer:
      "Os candidatos realizam o cadastro inicial por meio de um chatbot no WhatsApp. Os dados coletados alimentam a base de currículos que você pesquisa aqui na plataforma web.",
  },
];

export function HelpPage() {
  const [search, setSearch] = useState("");

  const filtered = FAQ_ITEMS.filter((item) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term);
  });

  return (
    <div>
      <PageHeader title="Como podemos ajudar?" subtitle="Respostas rápidas para as dúvidas mais comuns sobre o Talento Mineral." />

      <div className="mx-auto max-w-2xl">
        <SearchInput
          label="Buscar na central de ajuda"
          placeholder="Buscar por um tema, ex: créditos, vagas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-6 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <EmptyState title="Nenhum resultado encontrado." description="Tente buscar por outro termo ou entre em contato conosco." />
          ) : (
            filtered.map((item) => (
              <Card key={item.question}>
                <h2 className="text-sm font-semibold text-[var(--color-text)]">{item.question}</h2>
                <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">{item.answer}</p>
              </Card>
            ))
          )}
        </div>

        <Card className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-semibold text-[var(--color-text)]">Ainda precisa de ajuda?</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Nossa equipe pode te ajudar diretamente por e-mail ou WhatsApp.</p>
          <a href="mailto:suporte@talentomineral.com.br">
            <Button variant="secondary" size="sm">
              Entrar em contato
            </Button>
          </a>
        </Card>
      </div>
    </div>
  );
}

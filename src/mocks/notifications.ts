import type { Notification } from "../types/notification";

export const initialNotifications: Notification[] = [
  {
    id: "notif-001",
    title: "3 novos currículos compatíveis",
    description: "Encontramos 3 currículos compatíveis com sua vaga Operador de Máquina.",
    type: "MATCH",
    read: false,
    createdAt: "2026-09-12T09:10:00.000Z",
    link: "/vagas/job-001",
  },
  {
    id: "notif-002",
    title: "Seus créditos estão acabando",
    description: "Você possui apenas 7 créditos disponíveis.",
    type: "CREDIT",
    read: false,
    createdAt: "2026-09-11T14:00:00.000Z",
    link: "/creditos",
  },
  {
    id: "notif-003",
    title: "Compra aprovada",
    description: "Sua compra de 50 créditos foi aprovada com sucesso.",
    type: "PAYMENT",
    read: false,
    createdAt: "2026-09-09T08:05:00.000Z",
    link: "/creditos",
  },
  {
    id: "notif-004",
    title: "Vaga atualizada",
    description: "A vaga Classificador de Blocos teve suas informações atualizadas.",
    type: "JOB",
    read: true,
    createdAt: "2026-09-06T11:30:00.000Z",
    link: "/vagas/job-004",
  },
  {
    id: "notif-005",
    title: "Bem-vindo ao Talento Mineral",
    description: "Sua conta foi criada com sucesso. Explore os currículos disponíveis.",
    type: "SYSTEM",
    read: true,
    createdAt: "2026-08-01T09:00:00.000Z",
  },
];

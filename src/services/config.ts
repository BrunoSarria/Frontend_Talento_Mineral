/**
 * Chave central de configuração do frontend.
 *
 * Enquanto o backend (Node.js + TypeScript + PostgreSQL) não existe, todos os
 * services leem/gravam em uma camada de mock persistida em localStorage
 * (ver `utils/mockDb.ts`). Quando a API REST estiver disponível, basta:
 *
 *   1. Trocar USE_MOCK_API para false;
 *   2. Ajustar API_BASE_URL para o endereço real da API;
 *   3. Nenhuma página ou componente precisa ser alterado — os services já
 *      expõem a mesma assinatura de funções independentemente da origem dos dados.
 */
export const USE_MOCK_API = true;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.talentomineral.com.br";

/** Latência artificial (ms) usada apenas pelo mock para simular chamadas de rede. */
export const MOCK_LATENCY = 400;

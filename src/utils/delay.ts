/** Simula latência de rede para que a experiência do mock se aproxime da API real. */
export function delay(ms = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

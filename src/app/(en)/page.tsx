import { HomePage } from '@/library/app/home-page';

/**
 * A raiz do site é o inglês.
 *
 * Decisão do Abel: o alvo principal é o mercado de fora, então `/` fala inglês e
 * o português mora em `/pt`. Quem chega de um link compartilhado ou do LinkedIn
 * cai direto na versão que serve à conversa que ele quer ter.
 */
export default function Home() {
  return <HomePage lang="en" />;
}
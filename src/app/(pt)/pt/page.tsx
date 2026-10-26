import { HomePage } from '@/library/app/home-page';

/**
 * A versão em português, em `/pt`.
 *
 * Ela saiu da raiz quando o inglês virou o padrão — o mercado dele é o de fora.
 * Continua completa e indexável, só não é mais a porta de entrada.
 */
export default function PtHome() {
  return <HomePage lang="pt-BR" />;
}
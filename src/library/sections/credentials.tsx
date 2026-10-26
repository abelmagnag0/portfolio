import { Container, SectionHead } from '@/library/components/layout';
import type { Lang } from '@/library/utils/dictionary';
import { dictionary } from '@/library/utils/dictionary';

/**
 * Credenciais.
 *
 * Seção nova, e ela existe por um motivo específico: o Abel não tem blog e não
 * dá palestra. O que ele tem é o que dá para conferir: certificado de Oxford,
 * sete badges AWS, formação, inglês profissional.
 *
 * Havia aqui um bloco de repositórios públicos, com uma grade de cards ligando
 * para o GitHub. Saiu a pedido do Abel. O argumento dele é de produto, não de
 * gosto: quem procura o GitHub dele procura GitHub — o link está no rodapé e no
 * contato — e a grade transformava a seção de credenciais numa segunda seção de
 * cases, com seis cards para ler no fim de uma página que já tem cases. A
 * credencial que sobra é a que só esta seção pode dar: o que ele concluiu e
 * onde. Ficou mais curta e mais forte por isso.
 *
 * Anotado para quem mexer depois: `credentials.subtitle` foi reescrito junto
 * com esta remoção e hoje só promete o que a seção entrega (instituição, data e
 * o que foi o curso). Se a frase voltar a prometer repositório, ela volta a
 * apontar para um bloco que não existe.
 */
export function CredentialsSection({ lang }: { lang: Lang }) {
  const dict = dictionary[lang];
  const copy = dict.credentials;

  return (
    <section id="credentials" className="cv-auto py-20 lg:py-28">
      <Container>
        <SectionHead
          title={copy.title}
          subtitle={copy.subtitle}
          anchor="credentials"
        />

        <dl className="mt-16 grid gap-x-12 gap-y-10 lg:mt-20 lg:grid-cols-3">
          {copy.groups.map((group) => (
            <div key={group.label} className="border-t border-rule pt-5">
              <dt className="text-sm font-medium text-ink">{group.label}</dt>
              <dd className="mt-4">
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="max-w-[42ch] text-sm text-ink-soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
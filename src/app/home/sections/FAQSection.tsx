"use client";

import { Accordion } from "@/src/components/Accordion/Accordion";
import { cn } from "@/src/lib/utils";

const FAQ_DATA = [
  {
    id: 1,
    question: "Como a técnica Pomodoro funciona?",
    answer: "A técnica Pomodoro divide seu trabalho em intervalos de 25 minutos (pomodoros) separados por pausas curtas. Após 4 pomodoros, você faz uma pausa mais longa. Isso aumenta o foco, reduz a fadiga mental e melhora a produtividade geral."
  },
  {
    id: 2,
    question: "Posso personalizar a duração dos pomodoros?",
    answer: "Sim! Nossa plataforma permite que você ajuste o tempo dos pomodoros de acordo com suas preferências. Você também pode configurar a duração das pausas curtas e longas para melhor se adequar ao seu estilo de trabalho."
  },
  {
    id: 3,
    question: "Como rastreio meu progresso?",
    answer: "Com nosso painel de controle, você pode visualizar estatísticas detalhadas de suas sessões, XP ganho por habilidade, tempo total de foco e muito mais. Isso ajuda você a identificar padrões e otimizar sua produtividade."
  },
  {
    id: 4,
    question: "O que é XP e como ganho pontos?",
    answer: "XP (Experience Points) são pontos que você ganha ao completar pomodoros em diferentes habilidades. Quanto mais tempo você trabalha em uma habilidade, mais XP você acumula. Use o XP para acompanhar seu progresso e alcançar novos níveis de especialização."
  },
  {
    id: 5,
    question: "Posso abandonar um pomodoro em andamento?",
    answer: "Sim, você pode abandonar uma sessão Pomodoro a qualquer momento se precisar. No entanto, você não receberá o XP dessa sessão. Recomendamos completar os pomodoros sempre que possível para maximizar seus ganhos e manter sua consistência."
  },
  {
    id: 6,
    question: "Os dados da minha conta são seguros?",
    answer: "Sim! Nós priorizamos a segurança dos seus dados. Todas as comunicações são criptografadas, suas senhas são armazenadas de forma segura e nunca compartilhamos suas informações com terceiros. Você tem controle total sobre seus dados a qualquer momento."
  }
];

export default function FAQSection() {
  return (
    <section className="w-full mx-auto pt-16 md:py-16">
      <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
        Perguntas Frequentes
      </h2>
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6")}>
        <div className="flex flex-col gap-6 w-full mx-auto">
          {FAQ_DATA.slice(0, 3).map((faq) => (
            <Accordion
              key={faq.id}
              title={faq.question}
            >
              {faq.answer}
            </Accordion>
          ))}
        </div>
        <div className="flex flex-col gap-6 w-full mx-auto">
          {FAQ_DATA.slice(3, 6).map((faq) => (
            <Accordion
              key={faq.id}
              title={faq.question}
            >
              {faq.answer}
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

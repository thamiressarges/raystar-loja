import React from 'react';

export default function PoliticaPrivacidadePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-black">Política de Privacidade</h1>
      
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          Na <strong>Raystar</strong>, levamos sua privacidade a sério. Esta política descreve como coletamos, usamos e protegemos seus dados, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
        </p>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">1. Coleta de Dados</h2>
          <p>
            Coletamos informações essenciais para o processamento de pedidos: Nome, CPF (para emissão de Nota Fiscal), Endereço de entrega, E-mail e Telefone. Não armazenamos dados completos do seu cartão de crédito em nossos servidores; estes são processados diretamente pelo gateway de pagamento.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">2. Uso das Informações</h2>
          <p>
            Seus dados são utilizados exclusivamente para:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Processar e entregar seus pedidos;</li>
            <li>Enviar atualizações sobre o status da compra;</li>
            <li>Atendimento ao cliente e suporte;</li>
            <li>Melhoria da experiência de compra.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">3. Compartilhamento</h2>
          <p>
            Não vendemos seus dados. Compartilhamos apenas o necessário com parceiros logísticos (para entrega) e financeiros (para processamento do pagamento).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">4. Seus Direitos</h2>
          <p>
            Você tem direito de solicitar o acesso, correção ou exclusão dos seus dados pessoais da nossa base a qualquer momento, através dos nossos canais de atendimento ou diretamente na área "Minha Conta".
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">5. Cookies</h2>
          <p>
            Utilizamos cookies para melhorar a navegação e personalizar sua experiência no site. Você pode gerenciar as preferências de cookies nas configurações do seu navegador.
          </p>
        </section>
      </div>
    </div>
  );
}
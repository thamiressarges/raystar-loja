import React from 'react';

export default function TermosDeUsoPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-black">Termos de Uso</h1>
      
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          Bem-vindo à <strong>Raystar</strong>. Ao acessar nosso site e comprar nossos produtos, você concorda com os termos descritos abaixo.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">1. Geral</h2>
          <p>
            A Raystar é um e-commerce especializado em vestuário. Nos reservamos o direito de alterar preços, produtos e termos a qualquer momento, sem aviso prévio. O uso continuado do site implica na aceitação das atualizações.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">2. Cadastro e Dados</h2>
          <p>
            Para realizar compras, é necessário preencher um cadastro com informações verdadeiras e atualizadas. A segurança da sua senha é de sua responsabilidade.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">3. Pagamentos</h2>
          <p>
            Aceitamos pagamentos via Cartão de Crédito, PIX e Boleto através de gateway seguro (Pagar.me). O pedido só será processado após a confirmação do pagamento pela instituição financeira.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">4. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo deste site (fotos, textos, logotipos) é propriedade exclusiva da Raystar. É proibida a reprodução sem autorização.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">5. Legislação</h2>
          <p>
            Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca da empresa para dirimir quaisquer dúvidas.
          </p>
        </section>
      </div>
    </div>
  );
}
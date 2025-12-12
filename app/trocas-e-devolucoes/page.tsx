import React from 'react';

export default function TrocasDevolucoesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-black">Política de Trocas e Devoluções</h1>
      
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          A Raystar quer que você tenha a melhor experiência possível. Se precisar trocar ou devolver, seguimos rigorosamente o Código de Defesa do Consumidor.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">1. Arrependimento da Compra (7 Dias)</h2>
          <p>
            Conforme o Art. 49 do CDC, você tem até <strong>7 (sete) dias corridos</strong> após o recebimento do produto para solicitar a devolução por arrependimento. O produto deve estar sem uso, com a etiqueta intacta e na embalagem original. O reembolso será integral.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">2. Troca por Tamanho ou Cor</h2>
          <p>
            Caso a peça não sirva ou você prefira outra cor, a primeira troca é grátis. Você tem até 30 dias após o recebimento para solicitar. O produto não pode ter sinais de uso ou lavagem.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">3. Produto com Defeito</h2>
          <p>
            Se o produto apresentar defeito de fabricação, você tem até 90 dias para solicitar a troca ou reparo. Faremos uma análise técnica e, confirmado o defeito, providenciaremos a troca ou reembolso.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">4. Como Solicitar</h2>
          <p>
            Para iniciar um processo de troca ou devolução, entre em contato através do nosso e-mail ou WhatsApp informando o número do pedido e o motivo. Enviaremos as instruções de postagem.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-2">5. Reembolsos</h2>
          <p>
            O reembolso será feito na mesma forma de pagamento da compra.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Cartão de Crédito:</strong> Estorno na fatura (pode levar até 2 faturas).</li>
            <li><strong>PIX ou Boleto:</strong> Transferência em conta bancária em até 5 dias úteis após o recebimento da devolução.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
import { Resend } from 'resend';
import { formatPrice } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'Raystar <nureldin@raystarcmz.com.br>';

export async function sendOrderCreatedEmail(params: {
  to: string;
  name: string;
  orderId: string;
  total: number;
  paymentMethod: string;
  pixCode?: string;
  boletoUrl?: string;
}) {
  try {
    const { to, name, orderId, total, paymentMethod, pixCode, boletoUrl } = params;
    const shortId = orderId.split('-')[0].toUpperCase();

    let paymentInstructions = '';
    
    if (paymentMethod === 'pix' && pixCode) {
      paymentInstructions = `
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0284c7; margin-top: 0;">Pagamento via PIX</h3>
          <p>Copie e cole o código abaixo no seu banco:</p>
          <code style="background: #e2e8f0; padding: 10px; display: block; word-break: break-all; border-radius: 4px;">${pixCode}</code>
        </div>
      `;
    } else if (paymentMethod === 'boleto' && boletoUrl) {
      paymentInstructions = `
        <div style="background-color: #fff7ed; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #ea580c; margin-top: 0;">Boleto Bancário</h3>
          <p><a href="${boletoUrl}" target="_blank" style="background-color: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Baixar Boleto</a></p>
        </div>
      `;
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Pedido Recebido! #${shortId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Olá, ${name}!</h1>
          <p>Recebemos seu pedido com sucesso. Estamos aguardando a confirmação do pagamento.</p>
          
          <div style="border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
            <p><strong>Pedido:</strong> #${shortId}</p>
            <p><strong>Total:</strong> ${formatPrice(total)}</p>
            <p><strong>Forma de Pagamento:</strong> ${paymentMethod.toUpperCase()}</p>
          </div>

          ${paymentInstructions}

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Você pode acompanhar o status em "Minha Conta" no site.
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error(error);
  }
}

export async function sendPaymentConfirmedEmail(to: string, name: string, orderId: string) {
  try {
    const shortId = orderId.split('-')[0].toUpperCase();

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Pagamento Aprovado! Pedido #${shortId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Pagamento Confirmado! 🎉</h1>
          <p>Olá, ${name}.</p>
          <p>Seu pagamento para o pedido <strong>#${shortId}</strong> foi aprovado com sucesso.</p>
          <p>Já estamos preparando seus produtos para envio.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">Equipe Raystar</p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error(error);
  }
}

export async function sendOrderDispatchedEmail(to: string, name: string, orderId: string, trackingCode?: string) {
  try {
    const shortId = orderId.split('-')[0].toUpperCase();

    const trackingHtml = trackingCode 
      ? `<p>Código de Rastreio: <strong>${trackingCode}</strong></p>` 
      : '';

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Pedido a Caminho! #${shortId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Seu pedido saiu para entrega! 🚚</h1>
          <p>Olá, ${name}.</p>
          <p>Boas notícias! Seu pedido <strong>#${shortId}</strong> já está com a transportadora/entregador.</p>
          
          ${trackingHtml}

          <p>Fique atento ao endereço de entrega.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">Equipe Raystar</p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error(error);
  }
}
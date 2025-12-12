import axios from "axios";

const api = axios.create({
  baseURL: 'https://api.pagar.me/core/v5',
  headers: {
    Authorization: `Basic ${Buffer.from(`${process.env.PAGARME_SECRET_KEY}:`).toString('base64')}`,
    'Content-Type': 'application/json',
  },
});

export async function createPagarmeTransaction(data: any) {
  try {
    const response = await api.post('/orders', data);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error(`ERRO PAGAR.ME: ${errorMessage}`);
    throw new Error(`Erro Pagar.me: ${errorMessage}`);
  }
}

export function buildPagarmePayload(params: {
  orderId: string;
  customer: any;
  items: any[];
  shipping: any;
  paymentMethod: string;
  card?: any;
}) {
  const { orderId, customer, items, shipping, paymentMethod, card } = params;

  const validCpf = customer.cpf.replace(/\D/g, "");
  
  const rawZipCode = shipping.address?.zipCode;
  if (!rawZipCode) {
    throw new Error("O CEP do endereço é obrigatório para processar o pagamento.");
  }
  
  const payload: any = {
    code: orderId,
    customer: {
      name: customer.name,
      email: customer.email,
      document: validCpf,
      type: "individual",
      phones: {
        mobile_phone: customer.phoneObject
      },
    },
    items: items.map((item: any) => ({
      amount: Math.round(item.price * 100),
      description: item.name.substring(0, 250),
      quantity: item.quantity,
      code: String(item.id)
    })),
    shipping: {
      amount: Math.round(shipping.cost * 100),
      description: "Entrega Raystar",
      recipient_name: customer.name,
      address: {
        line_1: `${shipping.address?.street || "Rua"}, ${shipping.address?.number || "S/N"}`,
        line_2: shipping.address?.neighborhood || "Bairro",
        zip_code: rawZipCode.replace(/\D/g, ""),
        city: shipping.address?.city || "Cidade",
        state: shipping.address?.state || "UF",
        country: "BR"
      }
    },
    payments: []
  };

  if (paymentMethod === 'pix') {
    payload.payments.push({
      payment_method: "pix",
      
      pix: { expires_in: 86400 }
    });
  } else if (paymentMethod === 'card' && card) {
    payload.payments.push({
      payment_method: "credit_card",
      credit_card: {
        card: {
          number: card.cardNumber.replace(/\s/g, ""),
          holder_name: card.holderName,
          exp_month: card.expiration.split('/')[0],
          exp_year: card.expiration.split('/')[1]?.length === 2 ? '20' + card.expiration.split('/')[1] : card.expiration.split('/')[1],
          cvv: card.cvv
        },
        installments: Number(card.installments) || 1,
        statement_descriptor: "RAYSTAR LOJA"
      }
    });
  } else if (paymentMethod === 'boleto') {
    payload.payments.push({
      payment_method: "boleto",
      boleto: {
        instructions: "Pagar até o vencimento",
        due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  }

  return payload;
}
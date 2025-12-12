import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Nome muito curto.").optional().or(z.literal('')),
  cpf: z.string().min(11, "CPF inválido.").optional().or(z.literal('')),
  
  phone: z.string()
    .transform(val => val.replace(/\D/g, '')) 
    .pipe(z.string().min(10, "Telefone deve ter DDD + Número.").max(11, "Telefone inválido."))
    .optional()
    .or(z.literal('')),
  birth_date: z.string().optional().or(z.literal('')),
  address: z.object({
    street: z.string(),
    number: z.string(),
    neighborhood: z.string(),
    complement: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }).optional(),
});

export const updatePasswordSchema = z.object({
  newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres."),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export const reviewSchema = z.object({
  productId: z.string().uuid("ID do produto inválido."),
  rating: z.coerce.number().min(1, "Nota obrigatória.").max(5),
  title: z.string().optional(),
  text: z.string().min(1, "Escreva sua opinião."),
});

const addressSchema = z.object({
  street: z.string().min(1),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zipCode: z.string().min(8),
  number: z.string().optional(),
  isPickup: z.boolean().optional(),
});

const cardSchema = z.object({
  cardNumber: z.string().min(13),
  holderName: z.string().min(3),
  expiration: z.string().min(4),
  cvv: z.string().min(3),
  installments: z.number().min(1),
});

export const checkoutSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    product_id: z.string(), 
  })).min(1, "O carrinho está vazio."),
  shipping: z.object({
    cost: z.number(),
    address: addressSchema.nullable().optional(),
    method: z.enum(['delivery', 'pickup']),
    isPickup: z.boolean().optional(),
  }),
  paymentMethod: z.enum(['card', 'pix', 'boleto']),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    cpf: z.string().min(11),
  }),
  card: cardSchema.nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === 'card' && !data.card) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Dados do cartão são obrigatórios.",
      path: ["card"],
    });
  }
});
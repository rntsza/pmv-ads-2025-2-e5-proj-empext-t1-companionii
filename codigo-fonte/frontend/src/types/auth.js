import { z } from 'zod';

// Validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Digite um endereço de email válido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(50, 'Nome deve ter menos de 50 caracteres'),
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Digite um endereço de email válido'),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Za-z]/, 'Senha deve conter pelo menos uma letra')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
    acceptTerms: z
      .boolean()
      .refine(val => val === true, 'Você deve aceitar os termos e condições'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Digite um endereço de email válido'),
});

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Za-z]/, 'Senha deve conter pelo menos uma letra')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

// Password strength checker
export const checkPasswordStrength = password => {
  let score = 0;
  let feedback = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Use pelo menos 8 caracteres');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Adicione letras maiúsculas');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Adicione letras minúsculas');
  }

  // Number check
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Adicione números');
  }

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Adicione caracteres especiais');
  }

  // Determine strength
  let strength = 'weak';
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 3) {
    strength = 'medium';
  }

  return {
    score,
    strength,
    feedback,
    isValid: score >= 2 && password.length >= 8, // Minimum requirements
  };
};

// Type exports for better IDE support
export const AuthErrors = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  INVALID_TOKEN: 'Invalid or expired token',
  NETWORK_ERROR: 'Network error',
  SERVER_ERROR: 'Server error',
  VALIDATION_ERROR: 'Validation error',
  RATE_LIMITED: 'Too many requests',
};

export const AuthStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const UserRoles = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

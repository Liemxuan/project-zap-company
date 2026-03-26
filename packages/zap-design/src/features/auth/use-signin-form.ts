import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

export const signinSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .min(1, { message: 'Email is required.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .min(1, { message: 'Password is required.' }),
  rememberMe: z.boolean().optional(),
});

export type SigninSchemaType = z.infer<typeof signinSchema>;

export function useSigninForm() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('zap_remembered_email');
    if (savedEmail) {
      form.setValue('email', savedEmail);
      form.setValue('rememberMe', true);
    } else {
      form.setValue('email', 'demo@zap.vn');
      form.setValue('password', 'demo123');
    }
  }, [form]);

  const onSubmit = async (values: SigninSchemaType) => {
    setIsProcessing(true);
    setError(null);
    try {
      // Simulate network connection/auth provider for the design engine
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (values.email && values.password) {
        // Any non-empty email/password will work for this demo mode, as long as it passes Zod
        console.log('Login successful for:', values.email);
        
        if (values.rememberMe) {
          localStorage.setItem('zap_remembered_email', values.email);
        } else {
          localStorage.removeItem('zap_remembered_email');
        }

        router.push('/admin/infrastructure');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onSocialSignIn = async (provider: 'google' | 'apple') => {
    setIsProcessing(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`OAuth login initiated for ${provider}`);
      router.push('/admin/infrastructure');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth login failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    form,
    isProcessing,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    onSocialSignIn
  };
}

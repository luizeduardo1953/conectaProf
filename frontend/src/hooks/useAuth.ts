'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const url = process.env.NEXT_PUBLIC_URL_BACKEND;

  const signin = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${url}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errMsg = Array.isArray(data?.message) ? data.message[0] : data?.message;
        setError(errMsg || 'E-mail ou senha incorretos.');
        return false;
      }

      localStorage.setItem('token', data.token);
      router.push('/dashboard');
      return true;
    } catch {
      setError('Erro de conexão com o servidor. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: 'student' | 'teacher',
  ): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${url}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password_hash: password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errMsg = Array.isArray(data?.message) ? data.message[0] : data?.message;
        setError(errMsg || 'Erro ao criar conta. Verifique os dados e tente novamente.');
        return false;
      }

      // Após signup, faz login automaticamente
      const loginRes = await fetch(`${url}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        localStorage.setItem('token', loginData.token);
      }

      router.push('/dashboard');
      return true;
    } catch {
      setError('Erro de conexão com o servidor. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, signin, signup };
}

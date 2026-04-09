'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User } from '@/lib/types';
import axios from 'axios';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const signin = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://backend:8000/auth/signin', {email, password});

      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);

      router.push('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro no login');
    }
  }

  const signup = async (name: string, email: string, password_hash: string, role: 'student' | 'teacher') => {
    try {
      const response = await axios.post('http://backend:8000/auth/signup', {name, email, password_hash, role});

      setUser(response.data.user);
      router.push('/dashboard');

    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert('Erro no cadastro');
    }
  }

  return { user, loading, signin, signup };

}

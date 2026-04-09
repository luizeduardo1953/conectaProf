import api from '@/lib/api';
import { Discipline } from '@/lib/types';

export async function getDisciplines(): Promise<Discipline[]> {
  const { data } = await api.get<Discipline[]>('/discipline');
  return data;
}

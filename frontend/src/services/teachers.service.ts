import api from '@/lib/api';
import { Teacher } from '@/lib/types';

export async function getTeachers(): Promise<Teacher[]> {
  const { data } = await api.get<Teacher[]>('/teachers');
  return data;
}

export async function getTeacherById(id: string): Promise<Teacher> {
  const { data } = await api.get<Teacher>(`/teachers/${id}`);
  return data;
}

export async function createTeacher(payload: {
  userId: string;
  biography?: string;
  training?: string;
  priceHour?: number;
  telephone?: string;
}): Promise<Teacher> {
  const { data } = await api.post<Teacher>('/teachers', payload);
  return data;
}

export async function updateTeacher(
  id: string,
  payload: Partial<{
    biography: string;
    training: string;
    priceHour: number;
    telephone: string;
  }>
): Promise<Teacher> {
  const { data } = await api.put<Teacher>(`/teachers/${id}`, payload);
  return data;
}

import api from '@/lib/api';
import { Scheduling } from '@/lib/types';

export async function createScheduling(payload: {
  teacherId: string;
  disciplineId: string;
  dateHourStart: string;
  dateHourEnd: string;
  observation?: string;
}): Promise<Scheduling> {
  const { data } = await api.post<Scheduling>('/scheduling', payload);
  return data;
}

export async function getMyScheduling(): Promise<Scheduling[]> {
  const { data } = await api.get<Scheduling[]>('/scheduling/my-scheduling');
  return data;
}

export async function getMyClasses(): Promise<Scheduling[]> {
  const { data } = await api.get<Scheduling[]>('/scheduling/my-classes');
  return data;
}

export async function deleteScheduling(id: string): Promise<void> {
  await api.delete(`/scheduling/${id}`);
}

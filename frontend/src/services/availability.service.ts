import api from '@/lib/api';
import { Availability } from '@/lib/types';

export async function createAvailability(payload: {
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}): Promise<Availability> {
  const { data } = await api.post<Availability>('/availability', payload);
  return data;
}

export async function deleteAvailability(id: string): Promise<void> {
  await api.delete(`/availability/${id}`);
}

export async function getAvailabilities(): Promise<Availability[]> {
  const { data } = await api.get<Availability[]>('/availability');
  return data;
}

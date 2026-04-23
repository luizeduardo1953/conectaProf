'use client';

import { useState } from 'react';
import { X, Calendar, Clock, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Discipline, Teacher } from '@/lib/types';
import { createScheduling } from '@/services/scheduling.service';

interface SchedulingModalProps {
  teacher: Teacher;
  disciplines: Discipline[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function SchedulingModal({ teacher, disciplines, onClose, onSuccess }: SchedulingModalProps) {
  const [disciplineId, setDisciplineId] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<string>('');
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const parseTime = (val: string) => {
    try {
      if (!val) return '';
      return new Date(val).toISOString().substr(11, 5);
    } catch {
      return val;
    }
  };

  // Determine available slots for the selected date
  let dayOfWeek = -1;
  if (dateStart) {
    const [year, month, day] = dateStart.split('-');
    const localDate = new Date(Number(year), Number(month) - 1, Number(day));
    dayOfWeek = localDate.getDay();
  }
  
  const availableSlots = (teacher.availabilities || []).filter(
    (a: any) => Number(a.dayWeek) === dayOfWeek
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!disciplineId || !dateStart || selectedSlotIndex === '') {
      setError('Preencha a disciplina, a data e um horário disponível.');
      return;
    }
    setLoading(true);
    try {
      const slot = availableSlots[Number(selectedSlotIndex)];
      if (!slot) throw new Error('Horário inválido.');

      const startTimeStr = parseTime(slot.timeStart || '');
      const endTimeStr = parseTime(slot.timeEnd || '');

      const dateHourStart = new Date(`${dateStart}T${startTimeStr}:00`).toISOString();
      const dateHourEnd = new Date(`${dateStart}T${endTimeStr}:00`).toISOString();

      await createScheduling({
        teacherId: teacher.id,
        disciplineId,
        dateHourStart,
        dateHourEnd,
        observation: observation || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao criar agendamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 text-white">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold">Agendar Aula</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition">
              <X size={20} />
            </button>
          </div>
          <p className="text-rose-100 text-sm">
            com <span className="font-semibold">{teacher.user?.name || 'Professor'}</span>
            {teacher.priceHour && (
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                R$ {teacher.priceHour}/h
              </span>
            )}
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {success && (
            <div className="flex items-center gap-3 bg-green-50 text-green-700 border border-green-200 rounded-xl p-4">
              <CheckCircle2 size={20} />
              <span className="font-medium">Aula agendada com sucesso!</span>
            </div>
          )}

          {/* Disciplina */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <BookOpen size={14} className="inline mr-1.5" />Disciplina *
            </label>
            <select
              value={disciplineId}
              onChange={(e) => setDisciplineId(e.target.value)}
              required
              className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
            >
              <option value="">Selecione uma disciplina</option>
              {(teacher.disciplines || []).map((td: any) => (
                <option key={td.disciplineId} value={td.disciplineId}>
                  {td.discipline?.name || 'Disciplina'}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <Calendar size={14} className="inline mr-1.5" />Data *
            </label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => {
                setDateStart(e.target.value);
                setSelectedSlotIndex(''); // reset selected slot when date changes
              }}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
            />
          </div>

          {/* Horários */}
          {dateStart && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <Clock size={14} className="inline mr-1.5" />Horário Disponível *
              </label>
              {availableSlots.length > 0 ? (
                <select
                  value={selectedSlotIndex}
                  onChange={(e) => setSelectedSlotIndex(e.target.value)}
                  required
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                >
                  <option value="">Selecione um horário</option>
                  {availableSlots.map((slot: any, idx: number) => (
                    <option key={slot.id || idx} value={idx}>
                      {parseTime(slot.timeStart || '')} às {parseTime(slot.timeEnd || '')}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full rounded-xl bg-rose-50 border border-rose-100 p-3 text-rose-600 text-sm">
                  O professor não possui horários disponíveis neste dia.
                </div>
              )}
            </div>
          )}

          {/* Observação */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Observações</label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={3}
              placeholder="Descreva o que deseja aprender, dúvidas específicas..."
              className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-slate-600 font-semibold hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-500/25 transition disabled:opacity-70"
            >
              {loading ? 'Agendando...' : 'Confirmar Aula'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

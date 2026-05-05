'use client';

import { useState } from 'react';
import { X, Calendar, Clock, BookOpen, AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import { Discipline, Teacher } from '@/lib/types';
import { createScheduling } from '@/services/scheduling.service';

interface SchedulingModalProps {
  teacher: Teacher;
  disciplines: Discipline[];
  onClose: () => void;
  onSuccess: () => void;
}

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** Converte valor do banco (ISO DateTime ou "HH:MM") em "HH:MM" */
function parseTime(val: string): string {
  if (!val) return '';
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toISOString().substr(11, 5);
    }
    return val.substr(0, 5);
  } catch {
    return val.substr(0, 5);
  }
}

/** Transforma "HH:MM" em minutos desde meia-noite */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Gera slots de 1 hora dentro de uma janela "HH:MM"–"HH:MM" */
function buildHourSlots(startHHMM: string, endHHMM: string): { label: string; start: string; end: string }[] {
  const slots: { label: string; start: string; end: string }[] = [];
  let cur = toMinutes(startHHMM);
  const finish = toMinutes(endHHMM);
  while (cur + 60 <= finish) {
    const sh = String(Math.floor(cur / 60)).padStart(2, '0');
    const sm = String(cur % 60).padStart(2, '0');
    const eh = String(Math.floor((cur + 60) / 60)).padStart(2, '0');
    const em = String((cur + 60) % 60).padStart(2, '0');
    slots.push({ label: `${sh}:${sm} – ${eh}:${em}`, start: `${sh}:${sm}`, end: `${eh}:${em}` });
    cur += 60;
  }
  return slots;
}

/** Gera as próximas datas válidas (dias que o professor atende) */
function buildAvailableDates(availabilities: any[], daysAhead = 60): { dateStr: string; label: string }[] {
  const validDays = new Set<number>(availabilities.map((a: any) => Number(a.dayWeek)));
  if (validDays.size === 0) return [];

  const result: { dateStr: string; label: string }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (validDays.has(d.getDay())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      result.push({
        dateStr: `${year}-${month}-${day}`,
        label: `${DAY_NAMES[d.getDay()]}, ${d.getDate()} de ${MONTH_NAMES[d.getMonth()]} de ${year}`,
      });
    }
  }
  return result;
}

export default function SchedulingModal({ teacher, disciplines, onClose, onSuccess }: SchedulingModalProps) {
  const [disciplineId, setDisciplineId] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Datas válidas baseadas nas disponibilidades do professor
  const availableDates = buildAvailableDates(teacher.availabilities || []);

  // Slots de disponibilidade do professor para a data selecionada
  const dayOfWeek = dateStart
    ? (() => {
        const [y, m, d] = dateStart.split('-');
        return new Date(Number(y), Number(m) - 1, Number(d)).getDay();
      })()
    : -1;

  const dayAvailabilities = (teacher.availabilities || []).filter(
    (a: any) => Number(a.dayWeek) === dayOfWeek
  );

  // Gera slots de 1h para cada janela de disponibilidade do dia
  const hourSlots = dayAvailabilities.flatMap((a: any) => {
    const start = parseTime(a.timeStart || '');
    const end = parseTime(a.timeEnd || '');
    if (!start || !end) return [];
    return buildHourSlots(start, end);
  });

  // Garante unicidade de slots pelo label (caso janelas se sobreponham)
  const uniqueSlots = Array.from(new Map(hourSlots.map((s) => [s.label, s])).values());

  const toggleSlot = (key: string) => {
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleDateChange = (val: string) => {
    setDateStart(val);
    setSelectedSlots(new Set());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!disciplineId) { setError('Selecione uma disciplina.'); return; }
    if (!dateStart)    { setError('Selecione uma data.'); return; }
    if (selectedSlots.size === 0) { setError('Selecione ao menos um horário.'); return; }

    setLoading(true);
    try {
      // Cria um agendamento por slot selecionado
      const chosen = uniqueSlots.filter((s) => selectedSlots.has(s.label));
      await Promise.all(
        chosen.map((slot) =>
          createScheduling({
            teacherId: teacher.id,
            disciplineId,
            dateHourStart: new Date(`${dateStart}T${slot.start}:00`).toISOString(),
            dateHourEnd:   new Date(`${dateStart}T${slot.end}:00`).toISOString(),
            observation: observation || undefined,
          })
        )
      );
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
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
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 text-white flex-shrink-0">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {success && (
            <div className="flex items-center gap-3 bg-green-50 text-green-700 border border-green-200 rounded-xl p-4">
              <CheckCircle2 size={20} />
              <span className="font-medium">
                {selectedSlots.size > 1 ? `${selectedSlots.size} aulas agendadas com sucesso!` : 'Aula agendada com sucesso!'}
              </span>
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
            {availableDates.length === 0 ? (
              <div className="w-full rounded-xl bg-rose-50 border border-rose-100 p-3 text-rose-600 text-sm">
                Este professor não possui dias disponíveis cadastrados.
              </div>
            ) : (
              <select
                value={dateStart}
                onChange={(e) => handleDateChange(e.target.value)}
                required
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
              >
                <option value="">Selecione uma data disponível</option>
                {availableDates.map(({ dateStr, label }) => (
                  <option key={dateStr} value={dateStr}>{label}</option>
                ))}
              </select>
            )}
          </div>

          {/* Horários — chips de 1h */}
          {dateStart && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock size={14} />Horários *
                  <span className="text-xs font-normal text-slate-400">(selecione um ou mais)</span>
                </label>
                {selectedSlots.size > 0 && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    {selectedSlots.size}h selecionada{selectedSlots.size > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {uniqueSlots.length === 0 ? (
                <div className="w-full rounded-xl bg-rose-50 border border-rose-100 p-3 text-rose-600 text-sm">
                  O professor não possui horários cadastrados para este dia.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {uniqueSlots.map((slot) => {
                    const active = selectedSlots.has(slot.label);
                    return (
                      <button
                        key={slot.label}
                        type="button"
                        onClick={() => toggleSlot(slot.label)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all select-none ${
                          active
                            ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200'
                            : 'bg-gray-50 border-gray-200 text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600'
                        }`}
                      >
                        {!active && <Plus size={13} />}
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Resumo dos slots selecionados */}
              {selectedSlots.size > 0 && (
                <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">Horários selecionados:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {uniqueSlots
                      .filter((s) => selectedSlots.has(s.label))
                      .map((s) => (
                        <span
                          key={s.label}
                          className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-md"
                        >
                          {s.label}
                        </span>
                      ))}
                  </div>
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
              {loading
                ? 'Agendando...'
                : selectedSlots.size > 1
                  ? `Confirmar ${selectedSlots.size} Aulas`
                  : 'Confirmar Aula'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Regras de datas da semana do cardápio.
 *
 * - RN-10: o cardápio é semanal, de segunda a sexta.
 * - RN-18: o período do cabeçalho segue o formato "DD A DD/MM/AAAA".
 * - RN-19: o cardápio é cadastrado para a próxima semana.
 *
 * As datas são strings ISO "AAAA-MM-DD" (sem hora), já no fuso
 * America/Sao_Paulo. Assim as contas não dependem do fuso do servidor.
 */

export type IsoDate = `${number}-${number}-${number}`;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function parse(date: string): Date {
  const match = ISO_DATE.exec(date);
  if (!match) throw new Error(`Data inválida (esperado AAAA-MM-DD): ${date}`);
  const [, y, m, d] = match.map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  if (parsed.getUTCMonth() !== m - 1 || parsed.getUTCDate() !== d) {
    throw new Error(`Data inexistente: ${date}`);
  }
  return parsed;
}

function format(date: Date): IsoDate {
  return date.toISOString().slice(0, 10) as IsoDate;
}

/** Soma (ou subtrai) dias de uma data. */
export function addDays(date: string, days: number): IsoDate {
  const d = parse(date);
  d.setUTCDate(d.getUTCDate() + days);
  return format(d);
}

/** Dia da semana ISO: 1 = segunda ... 7 = domingo. */
export function isoWeekday(date: string): number {
  const day = parse(date).getUTCDay();
  return day === 0 ? 7 : day;
}

/** Segunda-feira da semana a que a data pertence. */
export function weekStartOf(date: string): IsoDate {
  return addDays(date, 1 - isoWeekday(date));
}

/** RN-19: segunda-feira da semana seguinte à data informada. */
export function nextWeekStart(today: string): IsoDate {
  return addDays(weekStartOf(today), 7);
}

/** RN-10: os cinco dias úteis (segunda a sexta) a partir da segunda-feira. */
export function weekdaysOf(weekStart: string): IsoDate[] {
  if (isoWeekday(weekStart) !== 1) {
    throw new Error(`A semana do cardápio deve começar numa segunda-feira: ${weekStart}`);
  }
  return [0, 1, 2, 3, 4].map((offset) => addDays(weekStart, offset));
}

/**
 * RN-18: período do cabeçalho do cardápio, no formato do cardápio impresso.
 * Ex.: semana de 28/09/2026 → "28 A 02/10/2026".
 */
export function formatWeekPeriod(weekStart: string): string {
  const days = weekdaysOf(weekStart);
  const first = days[0];
  const last = days[days.length - 1];
  const [y, m, d] = last.split("-");
  return `${first.slice(8, 10)} A ${d}/${m}/${y}`;
}

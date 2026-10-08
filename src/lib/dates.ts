export const TIMEZONE = 'America/Argentina/Buenos_Aires';
export const today = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
export const dateLabel = (
  date: string,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' },
) =>
  new Intl.DateTimeFormat('es-AR', { ...options, timeZone: 'UTC' }).format(
    new Date(`${date}T12:00:00Z`),
  );
export function endTime(time: string, duration: number) {
  const [h, m] = time.split(':').map(Number);
  const mins = h * 60 + m + duration;
  return `${String(Math.floor(mins / 60) % 24).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
}
export function monthCells(year: number, month: number) {
  const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(Date.UTC(year, month, i - offset + 1));
    return {
      date: d.toISOString().slice(0, 10),
      day: d.getUTCDate(),
      current: d.getUTCMonth() === month,
    };
  });
}

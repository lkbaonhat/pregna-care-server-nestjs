import { format } from 'date-fns';

export const formatDateFromSeconds = (date: number) =>
  format(new Date(date * 1000), 'MM/dd/yyyy HH:mm:ss');

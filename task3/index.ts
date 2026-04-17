export const getUtcStringDate = (date?: Date): string => {
  const inputDate = date || new Date();

  if (isNaN(inputDate.getTime())) {
    throw new Error('Invalid date');
  }

  const year = inputDate.getUTCFullYear();
  const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(inputDate.getUTCDate()).padStart(2, '0');
  const hours = String(inputDate.getUTCHours()).padStart(2, '0');
  const minutes = String(inputDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(inputDate.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
};

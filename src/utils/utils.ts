export const normalizeStatus = (status: boolean | number): boolean =>
  typeof status === 'boolean' ? status : status > 0;

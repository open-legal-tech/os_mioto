export const debounce = <F extends (...args: any[]) => void>(
  func: F,
  delay: number,
): ((...args: Parameters<F>) => void) => {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    // @ts-ignore
    timer = setTimeout(() => func(...args), delay);
  };
};
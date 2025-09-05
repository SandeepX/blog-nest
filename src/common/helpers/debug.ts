import util from 'util';

export function dd<T>(value: T): never {
  console.log(util.inspect(value, { depth: null, colors: true }));
  process.exit(0);
}

/**
 * Dump only - logs the value but continues execution
 */
export function dump<T>(value: T): void {
  console.log(util.inspect(value, { depth: null, colors: true }));
}

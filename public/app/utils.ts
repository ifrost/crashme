function serverLog(log: Record<string, string | number | boolean>) {
  const logs = Object.entries(log)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  fetch('/log?' + logs);
}

export function createServerLogger(source: string) {
  return {
    log: (log: Record<string, string | number | boolean | IDBValidKey>) => {
      serverLog({
        ...log,
        source,
      });
    },
  };
}

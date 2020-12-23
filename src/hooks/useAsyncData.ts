import * as React from 'react';

export default function useAsyncData<T>(data: Promise<T>, deps?: any[]): T | undefined {
  const [value, setValue] = React.useState<T | undefined>(undefined);
  React.useEffect(() => {
    data.then(v => setValue(v));
  }, deps ?? []);
  return value;
}
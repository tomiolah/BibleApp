import * as React from 'react';

export default function useAsyncData<T>(data: Promise<T>): T | undefined {
  const [value, setValue] = React.useState<T | undefined>(undefined);
  React.useEffect(() => {
    data.then(v => setValue(v));
  }, []);
  return value;
}
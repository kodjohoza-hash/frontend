import { Suspense } from 'react';
import CounterSaleWizard from '@components/counter/CounterSaleWizard';
import CounterSaleSkeleton from '@components/counter/CounterSaleSkeleton';

const CounterSalePage = () => (
  <Suspense fallback={<CounterSaleSkeleton />}>
    <CounterSaleWizard />
  </Suspense>
);

export default CounterSalePage;

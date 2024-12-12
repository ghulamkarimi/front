'use client';

import dynamic from 'next/dynamic';

const CarSearch = dynamic(() => import('@/components/car-form/CarSearch'), { ssr: false });

const Page = () => {
  return (
    <div className="mx-w-full flex justify-center relative mt-2">
      <div className="xl:w-2/3 w-full relative overflow-hidden">
        <CarSearch />
      </div>
    </div>
  );
};

export default Page;

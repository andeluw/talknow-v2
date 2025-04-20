import { Metadata } from 'next';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import UnderlineLink from '@/components/links/UnderlineLink';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <main>
      <section>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
          <RiAlarmWarningFill
            size={60}
            className='drop-shadow-glow animate-flicker text-red-500'
          />
          <h1 className='mt-8 text-4xl '>Page Not Found</h1>
          <UnderlineLink href='/' className='mt-4'>
            Go to Home
          </UnderlineLink>
        </div>
      </section>
    </main>
  );
}

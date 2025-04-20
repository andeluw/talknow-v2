import React from 'react';

const systemColors = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
];

const primaryColors = {
  'primary-50': 'rgb(var(--tw-color-primary-50))',
  'primary-100': 'rgb(var(--tw-color-primary-100))',
  'primary-200': 'rgb(var(--tw-color-primary-200))',
  'primary-300': 'rgb(var(--tw-color-primary-300))',
  'primary-400': 'rgb(var(--tw-color-primary-400))',
  'primary-500': 'rgb(var(--tw-color-primary-500))',
  'primary-600': 'rgb(var(--tw-color-primary-600))',
  'primary-700': 'rgb(var(--tw-color-primary-700))',
  'primary-800': 'rgb(var(--tw-color-primary-800))',
  'primary-900': 'rgb(var(--tw-color-primary-900))',
};

export default function Page() {
  return (
    <div className='p-6 space-y-10 +min-h-screen'>
      <div>
        <h1 className='text-2xl font-bold mb-4'>Dark Mode System Colors</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {systemColors.map((color) => (
            <div key={color} className='flex items-center gap-4'>
              <div
                className='w-16 h-16 rounded-md border'
                style={{ backgroundColor: `hsl(var(--${color}))` }}
              />
              <span className='text-sm font-mono'>--{color}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-4'>Primary Color Scale</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
          {Object.entries(primaryColors).map(([name, value]) => (
            <div key={name} className='flex items-center gap-4'>
              <div
                className='w-16 h-16 rounded-md border'
                style={{ backgroundColor: value }}
              />
              <span className='text-sm font-mono'>--tw-color-{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

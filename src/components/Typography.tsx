import { Inter } from 'next/font/google';

import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export enum TypographyVariant {
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  't',
  'p',
  'bt',
  'c',
  'c1',
}

enum FontWeight {
  'thin',
  'extralight',
  'light',
  'regular',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
}

type TypographyProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  weight?: keyof typeof FontWeight;
  variant?: keyof typeof TypographyVariant;
  children: React.ReactNode;
};

export default function Typography<T extends React.ElementType>({
  as,
  children,
  weight = 'regular',
  className,
  variant = 'p',
  ...props
}: TypographyProps<T> &
  Omit<React.ComponentProps<T>, keyof TypographyProps<T>>) {
  const Component = as || 'p';
  return (
    <Component
      className={cn(
        // *=============== Font Weights ==================
        [
          weight === 'regular' && 'font-normal',
          weight === 'medium' && 'font-medium',
          weight === 'semibold' && 'font-semibold',
          weight === 'bold' && 'font-bold',
        ],
        // *=============== Font Variants ==================
        [
          variant === 'h1' && [
            'text-[40px] leading-[48px] sm:text-[64px] sm:leading-[80px] md:text-[80px] md:leading-[96px]',
          ],
          variant === 'h2' && [
            'text-[32px] leading-[40px] sm:text-[48px] sm:leading-[64px] md:text-[64px] md:leading-[80px]',
          ],
          variant === 'h3' && [
            'text-[32px] leading-[40px] sm:text-[48px] sm:leading-[64px] md:text-[64px] md:leading-[84px]',
          ],
          variant === 'h4' && [
            'text-[24px] leading-[32px] sm:text-[32px] sm:leading-[48px] md:text-[48px] md:leading-[64px]',
          ],
          variant === 'h5' && [
            'text-[20px] leading-[28px] sm:text-[24px] sm:leading-[32px] md:text-[32px] md:leading-[48px]',
          ],
          variant === 'h6' && [
            'text-[18px] leading-[24px] sm:text-[20px] sm:leading-[28px] md:text-[24px] md:leading-[32px]',
          ],
          variant === 't' && [
            'text-[16px] leading-[24px] sm:text-[18px] sm:leading-[24px] md:text-[20px] md:leading-[24px]',
          ],
          variant === 'p' && [
            'text-[14px] leading-[20px] sm:text-[16px] sm:leading-[22px] md:text-[18px] md:leading-[24px]',
          ],
          variant === 'bt' && [
            'text-[14px] leading-[20px] sm:text-[14px] sm:leading-[22px] md:text-[16px] md:leading-[24px]',
          ],
          variant === 'c' && [
            'text-[12px] leading-[18px] sm:text-[14px] sm:leading-[22px] md:text-[14px] md:leading-[24px]',
          ],
          variant === 'c1' && [
            'text-[10px] leading-[16px] sm:text-[12px] sm:leading-[20px] md:text-[12px] md:leading-[24px]',
          ],
        ],
        inter.className,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

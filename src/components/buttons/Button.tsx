import { cva, VariantProps } from 'class-variance-authority';
import { LoaderCircle, LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
type ButtonSize = VariantProps<typeof buttonVariants>['size'];

const buttonVariants = cva(
  'relative inline-flex items-center justify-center rounded-md font-semibold transition-colors duration-75 shadow-sm disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white border border-primary-600 hover:bg-primary-600 hover:text-white active:bg-primary-700 disabled:bg-primary-700 focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
        outline:
          'text-primary-500 border border-primary-500 hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
        ghost:
          'text-primary-500 shadow-none hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
        light:
          'bg-white text-gray-700 border border-gray-300 hover:text-dark hover:bg-gray-100 active:bg-white/80 disabled:bg-gray-200',
        dark: 'bg-gray-900 text-white border border-gray-600 hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700',
        shadcn:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90 text-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        'outline-white':
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        'ghost-white': 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        'outline-2':
          'border-2 border-surface-muted bg-transparent text-primary hover:bg-muted hover:text-white active:bg-muted/80 disabled:bg-muted/80',
      },
      size: {
        base: 'px-3 py-1.5 text-sm md:text-base',
        sm: 'px-2 py-1 text-xs md:text-sm',
        default: 'h-9 px-4 py-2',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'base',
    },
  }
);

type ButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
    content?: string;
  };
  iconSize?: string | number;
  isIconFilled?: boolean;
  filledIcon?: string;
} & React.ComponentPropsWithRef<'button'>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = 'primary',
      size = 'base',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      classNames,
      iconSize = '1em',
      isIconFilled = false,
      filledIcon = 'white',
      ...rest
    },
    ref
  ) => {
    const disabled = isLoading || buttonDisabled;

    return (
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        className={cn(
          buttonVariants({ variant, size }),
          'disabled:cursor-not-allowed',
          isLoading &&
            'relative text-transparent transition-none hover:text-transparent disabled:cursor-wait',
          className
        )}
        {...rest}
      >
        {isLoading && (
          <div
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              {
                'text-white': ['primary', 'dark'].includes(variant as string),
                'text-black': variant === 'light',
                'text-primary-500': ['outline', 'ghost'].includes(
                  variant as string
                ),
              }
            )}
          >
            <LoaderCircle className='animate-spin' />
          </div>
        )}
        {LeftIcon && (
          <div
            className={cn([
              size === 'base' && 'mr-1',
              size === 'sm' && 'mr-1.5',
            ])}
          >
            <LeftIcon
              size={iconSize}
              className={cn(
                [
                  size === 'base' && 'md:text-base text-base',
                  size === 'sm' && 'md:text-base text-sm',
                ],
                classNames?.leftIcon
              )}
              fill={isIconFilled ? filledIcon : ''}
              strokeWidth={isIconFilled ? 3 : 2.75}
            />
          </div>
        )}
        <span className={cn('flex-grow text-center', classNames?.content)}>
          {children}
        </span>
        {RightIcon && (
          <div
            className={cn([
              size === 'base' && 'ml-1',
              size === 'sm' && 'ml-1.5',
            ])}
          >
            <RightIcon
              size={iconSize}
              className={cn(
                [
                  size === 'base' && 'text-md md:text-md',
                  size === 'sm' && 'md:text-md text-sm',
                ],
                classNames?.rightIcon
              )}
              fill={isIconFilled ? filledIcon : ''}
              strokeWidth={isIconFilled ? 3 : 2.75}
            />
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
export { type ButtonProps, buttonVariants };
export type { ButtonSize, ButtonVariant };

import { VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/buttons/Button';
import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/links/UnstyledLink';

type ButtonLinkProps = {
  // isDarkBg?: boolean;
  variant?: VariantProps<typeof buttonVariants>['variant'];
  size?: VariantProps<typeof buttonVariants>['size'];
  leftIcon?: IconType | LucideIcon;
  rightIcon?: IconType | LucideIcon;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
} & UnstyledLinkProps;

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'base',
      // isDarkBg = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      classNames,
      ...rest
    },
    ref
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={cn(
          buttonVariants({ variant, size }),
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-75',
          className
        )}
      >
        {LeftIcon && (
          <div
            className={cn(
              size === 'base' && 'mr-1',
              size === 'sm' && 'mr-1.5',
              classNames?.leftIcon
            )}
          >
            <LeftIcon
              size='1em'
              className={cn(
                size === 'base' && 'md:text-md text-md',
                size === 'sm' && 'md:text-md text-sm',
                classNames?.leftIcon
              )}
            />
          </div>
        )}
        {children}
        {RightIcon && (
          <div
            className={cn(
              size === 'base' && 'ml-1',
              size === 'sm' && 'ml-1.5',
              classNames?.rightIcon
            )}
          >
            <RightIcon
              size='1em'
              className={cn(
                size === 'base' && 'text-md md:text-md',
                size === 'sm' && 'md:text-md text-sm',
                classNames?.rightIcon
              )}
            />
          </div>
        )}
      </UnstyledLink>
    );
  }
);

export default ButtonLink;

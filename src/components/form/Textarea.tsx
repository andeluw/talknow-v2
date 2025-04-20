import { get, RegisterOptions, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

import ErrorMessage from '@/components/form/ErrorMessage';
import HelperText from '@/components/form/HelperText';
import { Label } from '@/components/form/Label';

export type TextareaProps = {
  id: string;
  label?: string;
  helperText?: React.ReactNode;
  helperTextClassName?: string;
  labelTextClassName?: string;
  hideError?: boolean;
  validation?: RegisterOptions;
} & React.ComponentPropsWithoutRef<'textarea'>;

export default function Textarea({
  id,
  label,
  helperText,
  hideError = false,
  validation,
  className,
  readOnly = false,
  labelTextClassName,
  helperTextClassName,
  ...rest
}: TextareaProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);

  return (
    <div className='w-full space-y-2'>
      {label && (
        <Label required={!!validation?.required} className={labelTextClassName}>
          {label}
        </Label>
      )}

      <textarea
        {...register(id, validation)}
        id={id}
        name={id}
        readOnly={readOnly}
        disabled={readOnly}
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          readOnly && 'cursor-not-allowed',
          error &&
            'border-none ring-2 ring-inset ring-red-500 placeholder:text-muted-foreground focus:ring-red-500',
          className
        )}
        aria-describedby={id}
        {...rest}
      />

      {!hideError && error && <ErrorMessage>{error.message}</ErrorMessage>}
      {helperText && (
        <HelperText
          helperTextClassName={cn(
            helperTextClassName,
            !hideError && error && 'text-red-500'
          )}
        >
          {helperText}
        </HelperText>
      )}
    </div>
  );
}

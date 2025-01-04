import clsx from 'clsx';

interface DateItemProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function DateItem({
  children,
  active,
  disabled,
  className,
  onClick,
}: DateItemProps) {
  return (
    <button
      className={clsx(
        'h-10 w-10 rounded-lg disabled:text-gray-20',
        {
          'bg-primary-40 text-gray-00': active,
          'text-gray-70': !active,
        },
        className,
      )}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

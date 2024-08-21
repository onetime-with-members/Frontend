import clsx from 'clsx';

import { IconTriangleInvertedFilled } from '@tabler/icons-react';

interface CircleArrowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction?: 'left' | 'right';
}

export default function CircleArrowButton({
  direction = 'right',
  className,
  ...rest
}: CircleArrowButtonProps) {
  return (
    <button
      className={clsx(
        'flex h-6 w-6 items-center justify-center rounded-full bg-gray-00',
        className,
      )}
      {...rest}
    >
      <IconTriangleInvertedFilled
        size={12}
        className={clsx({
          'rotate-90': direction === 'left',
          '-rotate-90': direction === 'right',
        })}
      />
    </button>
  );
}

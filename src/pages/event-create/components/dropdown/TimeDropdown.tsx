import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import TimeDropdownItem from './TimeDropdownItem';
import {
  IconTriangleFilled,
  IconTriangleInvertedFilled,
} from '@tabler/icons-react';

interface TimeDropdownProps {
  time: string;
  setTime: (time: string) => void;
  className?: string;
}

export default function TimeDropdown({
  time,
  setTime,
  className,
}: TimeDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen((prev) => !prev);
  }

  function handleSelectTime(time: string) {
    setTime(time);
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      <div
        className={clsx(
          'flex cursor-pointer items-center gap-4 rounded-xl px-5 py-4',
          {
            'bg-primary-40': isOpen,
            'bg-gray-05': !isOpen,
          },
        )}
        onClick={handleOpen}
      >
        <span
          className={clsx('text-lg-200', {
            'text-gray-00': isOpen,
            'text-gray-70': !isOpen,
          })}
        >
          {time}
        </span>
        {isOpen ? (
          <IconTriangleFilled size={12} className="text-gray-00" />
        ) : (
          <IconTriangleInvertedFilled size={12} className="text-gray-40" />
        )}
      </div>
      {isOpen && (
        <ul className="scrollbar-hidden absolute -bottom-3 max-h-[15.5rem] w-full translate-y-full overflow-y-auto rounded-xl bg-gray-00 py-2 shadow-[0_4px_24px_0_rgba(0,0,0,0.15)]">
          {Array.from({ length: 25 }, (_, index) => index).map((time) => (
            <TimeDropdownItem
              key={time}
              onClick={() =>
                handleSelectTime(`${time.toString().padStart(2, '0')}:00`)
              }
            >
              {time.toString().padStart(2, '0')}:00
            </TimeDropdownItem>
          ))}
        </ul>
      )}
    </div>
  );
}

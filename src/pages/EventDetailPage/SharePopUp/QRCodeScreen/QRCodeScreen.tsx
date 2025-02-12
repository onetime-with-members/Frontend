import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import logoWhite from '@/assets/logo-white.svg';
import ClockPattern from '@/components/ClockPattern/ClockPattern';
import { RootState } from '@/store';
import cn from '@/utils/cn';
import { IconX } from '@tabler/icons-react';

interface QRCodeScreenProps {
  visible?: boolean;
  onClose?: () => void;
}

export default function QRCodeScreen({
  visible = false,
  onClose,
}: QRCodeScreenProps) {
  const { event, qrImageUrl } = useSelector((state: RootState) => state.event);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-50 flex h-full w-full translate-y-full flex-col overflow-hidden bg-gray-00 transition-transform duration-300',
        {
          'translate-y-0': visible,
        },
      )}
      style={{
        background: 'linear-gradient(180deg, #8898F2 0%, #4C65E5 100%)',
      }}
    >
      <div className="absolute z-50 flex h-full w-full flex-col">
        <header className="absolute flex w-full items-center justify-end px-5 py-4">
          <button className="text-gray-00" onClick={onClose}>
            <IconX size={24} />
          </button>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-8">
            <div className="w-[12rem] sm:w-[15rem]">
              <img
                src={logoWhite}
                alt="OneTime 로고"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-[230px] w-[230px] overflow-hidden rounded-3xl bg-gray-00 sm:h-[280px] sm:w-[280px]">
              <img src={qrImageUrl} className="h-full w-full object-cover" />
            </div>
            <p className="text-center text-primary-10 title-sm-300">
              <span className="text-primary-00">{event.title}</span>에<br />
              스케줄을 등록해 주세요!
            </p>
          </div>
        </div>
      </div>
      <ClockPattern className="opacity-50" />
    </div>
  );
}

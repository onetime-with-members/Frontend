import { useEffect, useState } from 'react';

import emptyEventBannerImage from '@/assets/empty-event-banner.png';
import cn from '@/utils/cn';
import { IconCheck, IconCopy } from '@tabler/icons-react';

interface EmptyEventBannerProps {
  copyEventShareLink: () => void;
}

export default function EmptyEventBanner({
  copyEventShareLink,
}: EmptyEventBannerProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyButtonClick = () => {
    copyEventShareLink();
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const copyTimeout = setTimeout(() => {
        setIsCopied(false);
      }, 3000);

      return () => {
        clearTimeout(copyTimeout);
      };
    }
  }, [isCopied]);

  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl bg-primary-40 px-6 py-5">
      <span className="leading-6 text-gray-00 text-lg-300 md:text-md-300">
        링크를 공유하고
        <br />
        맞는 시간을 찾으세요!
      </span>
      <button
        className={cn(
          'mt-3 flex items-center gap-1 rounded-full bg-primary-00 px-3 py-2 text-primary-50 text-sm-300',
          {
            'bg-primary-40 text-gray-00': isCopied,
          },
        )}
        onClick={handleCopyButtonClick}
      >
        <span>{isCopied ? '복사 완료' : '링크 복사'}</span>
        <span>
          {isCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
        </span>
      </button>
      <div className="absolute right-0 top-0 h-full">
        <img
          src={emptyEventBannerImage}
          alt="클립보드 이미지"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

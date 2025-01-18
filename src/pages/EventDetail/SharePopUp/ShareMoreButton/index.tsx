import { EventType } from '@/types/event.type';
import { IconDots } from '@tabler/icons-react';

interface ShareMoreButtonProps {
  event: EventType;
  currentUrl: string;
}

export default function ShareMoreButton({
  event,
  currentUrl,
}: ShareMoreButtonProps) {
  function handleClick() {
    let shareData = {
      title: `${event.title} - OneTime`,
      text: '스케줄 등록 요청이 도착했습니다.',
      url: currentUrl,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      alert('이 기능을 지원하지 않는 브라우저입니다.');
    }
  }

  return (
    <button
      className="rounded-full bg-gray-10 p-3 text-gray-40"
      onClick={handleClick}
    >
      <IconDots size={24} />
    </button>
  );
}
import clsx from 'clsx';
import { useParams } from 'react-router-dom';

import kakaoIcon from '../../assets/kakao-icon.svg';
import useKakaoShare from '../../hooks/useKakaoShare';
import { EventType } from '../../types/event.type';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface ShareKakaoButtonProps {
  event: EventType;
  size?: number;
}

export default function ShareKakaoButton({
  event,
  size = 48,
}: ShareKakaoButtonProps) {
  const params = useParams<{ eventId: string }>();

  const { handleKakaoShare } = useKakaoShare({
    event,
    eventId: params.eventId,
  });

  return (
    <button
      className={clsx(
        'overflow-hidden rounded-full bg-[#FFE80F] p-1.5 text-primary-40',
      )}
      onClick={handleKakaoShare}
      style={{ width: size, height: size }}
    >
      <img src={kakaoIcon} alt="카카오톡 아이콘" />
    </button>
  );
}

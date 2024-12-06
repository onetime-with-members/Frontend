import clsx from 'clsx';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import kakaoIcon from '../../assets/kakao-icon.svg';
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

const { Kakao } = window;

export default function ShareKakaoButton({
  event,
  size = 48,
}: ShareKakaoButtonProps) {
  const params = useParams<{ eventId: string }>();

  useEffect(() => {
    Kakao.cleanup();
    Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
  }, []);

  function handleClick() {
    const url = `${import.meta.env.VITE_SITE_DOMAIN}/events/${params.eventId}`;

    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${event.title} - OneTime`,
        description: `스케줄 등록 요청이 도착했습니다.`,
        imageUrl: `${import.meta.env.VITE_SITE_DOMAIN}/images/kakao/kakaotalk-share-thumbnail.png`,
        link: {
          webUrl: url,
          mobileWebUrl: url,
        },
      },
      buttons: [
        {
          title: '스케줄 등록하러 가기',
          link: {
            webUrl: url,
            mobileWebUrl: url,
          },
        },
      ],
    });
  }

  return (
    <button
      className={clsx(
        'overflow-hidden rounded-full bg-[#FFE80F] p-1.5 text-primary-40',
      )}
      onClick={handleClick}
      style={{ width: size, height: size }}
    >
      <img src={kakaoIcon} alt="카카오톡 아이콘" />
    </button>
  );
}

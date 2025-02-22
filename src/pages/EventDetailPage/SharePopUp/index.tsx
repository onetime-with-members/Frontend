import { useEffect, useRef, useState } from 'react';

import QRCodeScreen from './QRCodeScreen';
import ShareBlueButton from './ShareBlueButton';
import ShareButtonWrapper from './ShareButtonWrapper';
import ShareKakaoButton from './ShareKakaoButton';
import ShareMoreButton from './ShareMoreButton';
import Input from '@/components/Input';
import { EventType } from '@/types/event.type';
import axios from '@/utils/axios';
import { IconLink, IconQrcode, IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

interface SharePopUpProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  event: EventType;
}

export default function SharePopUp({ event, setIsOpen }: SharePopUpProps) {
  const [currentUrl, setCurrentUrl] = useState('Loading...');
  const [isQrCodeScreenOpen, setIsQrCodeScreenOpen] = useState(false);

  const urlInputRef = useRef<HTMLInputElement>(null);

  const makeShortenUrl = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/urls/action-shorten', {
        original_url: window.location.href,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setCurrentUrl(data.payload.shorten_url);
    },
  });

  function handleCopyLinkButtonClick() {
    navigator.clipboard.writeText(currentUrl);
    if (urlInputRef.current) {
      urlInputRef.current.select();
    }
  }

  function handleSharePopUpClose() {
    setIsOpen(false);
  }

  function handleQrCodeButtonClick() {
    setIsQrCodeScreenOpen(true);
  }

  function handleQrCodeScreenClose() {
    setIsQrCodeScreenOpen(false);
  }

  useEffect(() => {
    makeShortenUrl.mutate();
  }, [event]);

  return (
    <>
      <div
        className="fixed left-0 top-0 z-50 flex h-full w-full cursor-pointer items-center justify-center bg-gray-90 bg-opacity-50 px-4"
        onClick={handleSharePopUpClose}
      >
        <div
          className="flex w-full max-w-[35rem] cursor-auto flex-col overflow-hidden rounded-2xl bg-gray-00"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 pb-3 pt-4">
            <h2 className="text-gray-80 text-lg-300">공유하기</h2>
            <button className="text-gray-40" onClick={handleSharePopUpClose}>
              <IconX size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-6 px-5 pb-8 pt-4">
            <div className="flex flex-col gap-3">
              <Input
                inputRef={urlInputRef}
                value={currentUrl}
                className="overflow-hidden text-sm-100"
                inputClassName="pr-0"
                inputMode="none"
                readOnly
              />
            </div>
            <div className="flex items-center justify-center gap-4 min-[360px]:gap-6 xs:gap-8">
              <ShareButtonWrapper label="링크 복사">
                <ShareBlueButton onClick={handleCopyLinkButtonClick}>
                  <IconLink size={24} />
                </ShareBlueButton>
              </ShareButtonWrapper>
              <ShareButtonWrapper label="QR 코드">
                <ShareBlueButton onClick={handleQrCodeButtonClick}>
                  <IconQrcode size={24} />
                </ShareBlueButton>
              </ShareButtonWrapper>
              <ShareButtonWrapper label="카카오톡">
                <ShareKakaoButton event={event} />
              </ShareButtonWrapper>
              <ShareButtonWrapper label="더보기">
                <ShareMoreButton event={event} currentUrl={currentUrl} />
              </ShareButtonWrapper>
            </div>
          </div>
        </div>
      </div>
      <QRCodeScreen
        visible={isQrCodeScreenOpen}
        event={event}
        onClose={handleQrCodeScreenClose}
      />
    </>
  );
}

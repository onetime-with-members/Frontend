import { useSelector } from 'react-redux';

import ToolbarButton from './ToolbarButton/ToolbarButton';
import ToolbarMenuDropdown from './ToolbarMenuDropdown/ToolbarMenuDropdown';
import kakaoIcon from '@/assets/kakao-icon.svg';
import sendIcon from '@/assets/send.svg';
import useKakaoShare from '@/hooks/useKakaoShare';
import { RootState } from '@/store';

interface TopToolbarProps {
  setIsDeleteAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleShareButtonClick: () => void;
}

export default function TopToolbar({
  setIsDeleteAlertOpen,
  handleShareButtonClick,
}: TopToolbarProps) {
  const { event } = useSelector((state: RootState) => state.event);

  const { handleKakaoShare } = useKakaoShare({
    event,
  });

  return (
    <header className="flex h-[59px] w-full justify-center md:h-[72px]">
      <div className="fixed z-30 mx-auto w-full max-w-[calc(768px+2rem)] bg-gray-00 duration-150">
        <div className="bg-gray-80 px-6 py-4 md:rounded-t-3xl">
          <div className="flex items-center justify-between md:h-10">
            <h1 className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-gray-00 text-lg-300 md:title-sm-300">
              {event?.title || <>&nbsp;</>}
            </h1>
            {event && (
              <>
                <div className="flex items-center gap-2">
                  <ToolbarButton
                    variant="primary"
                    onClick={handleShareButtonClick}
                    className="hidden md:flex"
                  >
                    <img src={sendIcon} alt="보내기 아이콘" />
                  </ToolbarButton>
                  <ToolbarButton
                    variant="yellow"
                    onClick={handleKakaoShare}
                    className="hidden md:flex"
                  >
                    <img src={kakaoIcon} alt="카카오톡 아이콘" />
                  </ToolbarButton>
                  {event.event_status === 'CREATOR' && (
                    <ToolbarMenuDropdown
                      setIsDeleteAlertOpen={setIsDeleteAlertOpen}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

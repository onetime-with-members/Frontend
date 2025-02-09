import { useContext } from 'react';

import Button from '@/components/button/Button';
import { PageModeContext } from '@/contexts/PageModeContext';

interface BottomButtonProps {
  handleSubmit: () => void;
  disabled: boolean;
  isPending: boolean;
}

export default function BottomButton({
  handleSubmit,
  disabled,
  isPending,
}: BottomButtonProps) {
  const { pageMode } = useContext(PageModeContext);

  return (
    <div className="sticky bottom-0 left-0 w-full bg-gray-00 px-4 py-4 md:static md:w-[25rem] md:bg-transparent">
      <Button
        onClick={handleSubmit}
        disabled={disabled}
        variant="black"
        fullWidth
      >
        {pageMode === 'create' &&
          (isPending ? '이벤트 생성 중...' : '이벤트 생성하기')}
        {pageMode === 'edit' &&
          (isPending ? '이벤트 수정 중...' : '이벤트 수정하기')}
      </Button>
    </div>
  );
}

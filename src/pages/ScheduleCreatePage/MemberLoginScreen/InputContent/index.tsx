import PinPasswordInput from './PinPasswordInput';
import ScheduleInputLabel from './ScheduleInputLabel';
import NicknameFormControl from '@/components/NicknameFormControl';
import { GuestValueType } from '@/types/user.type';

interface InputContentProps {
  guestValue: GuestValueType;
  setGuestValue: React.Dispatch<React.SetStateAction<GuestValueType>>;
  setNicknameDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InputContent({
  guestValue,
  setGuestValue,
  setNicknameDisabled,
}: InputContentProps) {
  function handleInputChange<T>(key: keyof GuestValueType) {
    return function (value: T) {
      setGuestValue((prev) => ({
        ...prev,
        [key]: value,
      }));
    };
  }

  return (
    <div className="flex flex-col gap-12">
      <NicknameFormControl
        value={guestValue.name}
        onChange={(e) => handleInputChange('name')(e.target.value)}
        setSubmitDisabled={setNicknameDisabled}
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <ScheduleInputLabel htmlFor="pin">비밀번호</ScheduleInputLabel>
          <PinPasswordInput
            inputId="pin"
            pin={guestValue.pin}
            setPin={handleInputChange('pin')}
          />
        </div>
        <p className="text-primary-40">
          비밀번호를 설정하면, 같은 이름과 비밀번호를 입력했을 때 스케줄을
          수정할 수 있어요.
        </p>
      </div>
    </div>
  );
}

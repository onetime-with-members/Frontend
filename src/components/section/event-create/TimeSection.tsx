import { EventType } from '../../../types/event.type';
import TimeDropdown from '../../dropdown/TimeDropdown';
import EventInputLabel from '../../form-control/input-label/EventInputLabel';

interface TimeSectionProps {
  value: EventType;
  setValue: React.Dispatch<React.SetStateAction<EventType>>;
}

export default function TimeSection({ value, setValue }: TimeSectionProps) {
  function handleSelectTime(key: keyof EventType) {
    return function (time: string) {
      setValue((prev) => ({
        ...prev,
        [key]: time,
      }));
    };
  }

  return (
    <div className="flex flex-col gap-4">
      <EventInputLabel
        labelId="time"
        labelText="시간"
        description="설문할 시간의 범위를 설정해주세요."
      />
      <div className="flex gap-4">
        <div className="flex items-center gap-3">
          <TimeDropdown
            className="w-[7.5rem]"
            time={value.start_time}
            setTime={handleSelectTime('start_time')}
          />
          <span className="text-gray-70 text-md-300">~</span>
          <TimeDropdown
            className="w-[7.5rem]"
            time={value.end_time}
            setTime={handleSelectTime('end_time')}
          />
        </div>
      </div>
    </div>
  );
}
import cn from '@/utils/cn';
import { timeLabelList } from '@/utils/time-block';

interface LeftTimeLineProps {
  startTime: string;
  endTime: string;
}

export default function LeftTimeLine({
  startTime,
  endTime,
}: LeftTimeLineProps) {
  const timeList = timeLabelList(startTime, endTime);

  return (
    <div className="flex w-[3.5rem] flex-col items-center pr-4">
      {timeList.map((time, index) => (
        <div
          key={time}
          className={cn('flex h-[2rem] items-start justify-end', {
            'opacity-0': index % 2 && index !== timeList.length - 1,
          })}
        >
          <span
            className={cn('text-gray-30 text-sm-200', {
              '-translate-y-1/2': index !== 0,
              '-translate-y-full': index === timeList.length - 1,
            })}
          >
            {time}
          </span>
        </div>
      ))}
    </div>
  );
}

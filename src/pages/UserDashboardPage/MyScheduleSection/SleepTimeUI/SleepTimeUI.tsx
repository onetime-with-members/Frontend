import { Link } from 'react-router-dom';

import PenIcon from '@/components/icon/PenIcon';
import SleepIcon from '@/components/icon/SleepIcon';
import useSleepTime from '@/hooks/useSleepTime';

export default function SleepTimeUI() {
  const { sleepTimeData } = useSleepTime();

  return (
    <div className="flex items-stretch justify-between gap-3 px-6 pb-4 pt-5">
      <div className="flex items-center gap-1.5">
        <span>
          <SleepIcon fill="#31333F" size={20} />
        </span>
        <span className="text-gray-80 text-lg-200">
          {sleepTimeData?.sleep_start_time} - {sleepTimeData?.sleep_end_time}
        </span>
      </div>
      <Link
        to="/mypage/schedules/edit"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-05"
      >
        <PenIcon fill="#474A5C" size={24} />
      </Link>
    </div>
  );
}

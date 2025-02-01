import SleepTimeUI from './SleepTimeUI';
import MyTimeBlockBoard from '@/components/time-block-board/MyTimeBlockBoard';
import { MyScheduleTime } from '@/types/schedule.type';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';

export default function MySchedule() {
  const { data } = useQuery<MyScheduleTime[]>({
    queryKey: ['fixed-schedules'],
    queryFn: async () => {
      const res = await axios.get('/fixed-schedules');
      return res.data.payload.schedules;
    },
  });

  return (
    <div className="mx-auto w-full max-w-screen-md pb-32">
      <SleepTimeUI />
      <MyTimeBlockBoard
        mode="view"
        backgroundColor="white"
        mySchedule={data || []}
        className="bg-gray-05 pb-16 pr-3"
        topDateGroupClassName="sticky z-10 bg-gray-05 top-[120px] md:top-[178px]"
      />
    </div>
  );
}

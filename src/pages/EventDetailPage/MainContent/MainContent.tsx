import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import EmptyEventBanner from './EmptyEventBanner/EmptyEventBanner';
import TimeBlockBoard from '@/components/time-block-board/TimeBlockBoard/TimeBlockBoard';
import BannerList from '@/pages/EventDetailPage/MainContent/BannerList/BannerList';
import { RootState } from '@/store';
import { ScheduleType } from '@/types/schedule.type';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';

export default function MainContent() {
  const { event } = useSelector((state: RootState) => state.event);

  const params = useParams<{ eventId: string }>();

  const { isLoading: isScheduleLoading, data: schedules } = useQuery<
    ScheduleType[]
  >({
    queryKey: ['schedules', event?.category?.toLowerCase(), params.eventId],
    queryFn: async () => {
      const res = await axios.get(
        `/schedules/${event?.category.toLowerCase()}/${params.eventId}`,
      );
      return res.data.payload;
    },
    enabled: !!event,
  });

  const participants: string[] =
    schedules?.map((schedule) => schedule.name).sort() || [];

  function copyEventShareLink() {
    navigator.clipboard.writeText(
      `${window.location.origin}/events/${params.eventId}`,
    );
  }

  if (isScheduleLoading || event === undefined || schedules === undefined)
    return <></>;

  return (
    <div className="mx-auto w-full max-w-[calc(768px+2rem)] bg-gray-05 px-6 pt-3">
      <main className="pb-16">
        <div className="flex flex-col gap-10">
          <TimeBlockBoard
            event={event}
            schedules={schedules}
            backgroundColor="white"
            topContentClassName="top-[123px] bg-gray-05 md:top-[136px]"
          />
          {schedules.length === 0 ? (
            <EmptyEventBanner copyEventShareLink={copyEventShareLink} />
          ) : (
            <BannerList participants={participants} />
          )}
        </div>
      </main>
    </div>
  );
}

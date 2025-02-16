import { Helmet } from 'react-helmet-async';

import EmptyMyEvent from './EmptyMyEvent/EmptyMyEvent';
import MyEvent from '@/components/MyEvent/MyEvent';
import useGrayBackground from '@/hooks/useGrayBackground';
import { MyEventType } from '@/types/event.type';
import axios from '@/utils/axios';
import breakpoint from '@/utils/breakpoint';
import { useQuery } from '@tanstack/react-query';

export default function MyEventsPage() {
  const { isPending: isEventsPending, data: events } = useQuery<MyEventType[]>({
    queryKey: ['events', 'user', 'all'],
    queryFn: async () => {
      const res = await axios.get('/events/user/all');
      return res.data.payload;
    },
  });

  useGrayBackground({
    breakpointCondition: () => window.innerWidth < breakpoint.md,
  });

  if (isEventsPending || !events) {
    return <></>;
  }

  if (events.length === 0) {
    return <EmptyMyEvent />;
  }

  return (
    <>
      <Helmet>
        <title>참여한 이벤트 - OneTime</title>
      </Helmet>
      <ul className="flex flex-col gap-5 px-4 py-5">
        {events.map((event) => (
          <MyEvent
            key={event.event_id}
            event={event}
            innerClassName="border-none"
          />
        ))}
      </ul>
    </>
  );
}

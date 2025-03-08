import EventDetailPage from './components/EventDetailPage';
import { EventType } from '@/types/event.type';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/events/${id}`,
  );

  const { payload: event }: { payload: EventType } = await res.json();

  return {
    title: `${event.title} | OneTime`,
  };
}

export default async function EventDetail() {
  return <EventDetailPage />;
}

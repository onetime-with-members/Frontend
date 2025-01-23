import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import BottomButtonForDesktop from './BottomButtonForDesktop';
import BottomButtonForMobile from './BottomButtonForMobile';
import EventDeleteAlert from './EventDeleteAlert';
import LoginAlert from './LoginAlert';
import MainContent from './MainContent';
import SharePopUp from './SharePopUp';
import TopNavBar from './TopNavBar';
import TopToolbar from './TopToolbar';
import { EventType } from '@/types/event.type';
import axios from '@/utils/axios';
import { sortWeekdayList } from '@/utils/weekday';
import { useQuery } from '@tanstack/react-query';

export default function EventDetail() {
  const [isSharePopUpOpen, setIsSharePopUpOpen] = useState(false);
  const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const params = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const {
    isPending: isEventPending,
    data: eventData,
    error: eventError,
  } = useQuery<EventType>({
    queryKey: ['events', params.eventId],
    queryFn: async () => {
      const res = await axios.get(`/events/${params.eventId}`);
      return res.data.payload;
    },
  });

  let event: EventType = eventData || ({} as EventType);
  if (event) {
    if (event?.category === 'DAY') {
      event.ranges = sortWeekdayList(event.ranges);
    } else {
      event.ranges = event.ranges?.sort();
    }
  }

  function handleBottomButtonClick() {
    if (localStorage.getItem('access-token')) {
      navigate(`/events/${params.eventId}/schedules/new`);
    } else {
      setIsLoginAlertOpen(true);
    }
  }

  function handleShareButtonClick() {
    setIsSharePopUpOpen(true);
  }

  return (
    <>
      {!isEventPending && event && (
        <Helmet>
          <title>{event.title} - OneTime</title>
        </Helmet>
      )}
      <div className="flex flex-col">
        <TopNavBar />
        <TopToolbar
          event={event}
          isEventPending={isEventPending}
          setIsDeleteAlertOpen={setIsDeleteAlertOpen}
          handleShareButtonClick={handleShareButtonClick}
        />
        <MainContent
          event={event}
          eventError={eventError}
          isEventPending={isEventPending}
          setIsEventDeleteAlertOpen={setIsDeleteAlertOpen}
          setIsSharePopUpOpen={setIsSharePopUpOpen}
        />
        <>
          <BottomButtonForMobile
            handleFloatingButtonClick={handleBottomButtonClick}
            handleShareButtonClick={handleShareButtonClick}
          />
          <BottomButtonForDesktop
            handleFloatingButtonClick={handleBottomButtonClick}
          />
        </>
      </div>
      {isSharePopUpOpen && event && (
        <SharePopUp setIsOpen={setIsSharePopUpOpen} event={event} />
      )}
      {isLoginAlertOpen && <LoginAlert setIsOpen={setIsLoginAlertOpen} />}
      {isDeleteAlertOpen && (
        <EventDeleteAlert setIsEventDeleteAlertOpen={setIsDeleteAlertOpen} />
      )}
    </>
  );
}

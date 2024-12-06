import clsx from 'clsx';
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from '../api/axios';
import EmptyUI from '../components/EmptyUI';
import MyScheduleList from '../components/MyScheduleList';
import MyTimeBlockBoard from '../components/MyTimeBlockBoard';
import NavBar from '../components/NavBar';
import Button from '../components/button/Button';
import MyEventItem from '../components/list/my-event/MyEventItem';
import { FooterContext } from '../contexts/FooterContext';
import { MyScheduleContext } from '../contexts/MyScheduleContext';
import { MyEvent } from '../types/event.type';
import { IconChevronRight, IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

export default function UserDashboard() {
  const {
    setViewMode,
    selectedTimeBlockId,
    setSelectedTimeBlockId,
    setIsSelectDisabled,
  } = useContext(MyScheduleContext);
  const { isFooterShown } = useContext(FooterContext);

  const navigate = useNavigate();

  const { isPending: isEventsPending, data: eventsData } = useQuery({
    queryKey: ['events', 'user', 'all'],
    queryFn: async () => {
      const res = await axios.get('/events/user/all');
      return res.data;
    },
  });

  const events: MyEvent[] = eventsData?.payload;

  const { data: mySchedulesData, isLoading: isMySchedulesLoading } = useQuery({
    queryKey: ['fixed-schedules'],
    queryFn: async () => {
      const res = await axios.get('/fixed-schedules');
      return res.data;
    },
  });

  const mySchedules = mySchedulesData?.payload;

  function handleFloatingBottomButtonClick() {
    navigate('/events/new');
  }

  useEffect(() => {
    document.body.style.backgroundColor = '#F6F7F8';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    setIsSelectDisabled(true);

    return () => {
      setIsSelectDisabled(false);
    };
  }, []);

  useEffect(() => {
    setViewMode('timeblock');
    setSelectedTimeBlockId(null);
  }, [setViewMode]);

  if (
    isEventsPending ||
    isMySchedulesLoading ||
    events === undefined ||
    mySchedules === undefined
  ) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      <header>
        <NavBar overlay={selectedTimeBlockId !== null} />
        <div className="bg-primary-40 py-4 text-gray-00 lg:rounded-t-3xl">
          <div className="px-4">
            <div className="mx-auto flex w-full max-w-screen-md items-center justify-between gap-2">
              <h1 className="flex-1 title-lg-300">안녕하세요, 홍민서님</h1>
              <Link
                to="/events/new"
                className="hidden rounded-xl bg-primary-60 px-4 py-2 text-gray-00 lg:flex"
              >
                일정 생성하기
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="px-4">
        <div className="mx-auto flex w-full max-w-screen-md flex-col gap-14">
          <section className="flex flex-col gap-3">
            <header className="flex items-center justify-between">
              <h2 className="text-gray-90 title-sm-300">참여한 이벤트</h2>
              <Link
                to="/mypage/events"
                className="flex items-center text-gray-50"
              >
                <span>더 보기</span>
                <span>
                  <IconChevronRight />
                </span>
              </Link>
            </header>
            <ul className="grid grid-cols-1 lg:hidden">
              {events.length === 0 ? (
                <div className="rounded-2xl bg-gray-00 py-5">
                  <EmptyUI>아직 참여한 이벤트가 없어요.</EmptyUI>
                </div>
              ) : (
                events
                  .slice(0, 1)
                  .map((event) => (
                    <MyEventItem
                      key={event.event_id}
                      event={event}
                      className="border-none"
                    />
                  ))
              )}
            </ul>
            <ul className="hidden grid-cols-2 gap-4 lg:grid">
              {events.slice(0, 2).map((event) => (
                <MyEventItem
                  key={event.event_id}
                  event={event}
                  className="border-none"
                />
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-3">
            <header className="flex items-center justify-between gap-3">
              <h2 className="text-gray-90 title-sm-300">고정 스케줄</h2>
              <Link
                to="/mypage/schedules"
                className="flex items-center text-gray-50"
              >
                <span>더 보기</span>
                <span>
                  <IconChevronRight />
                </span>
              </Link>
            </header>
            <div className="flex items-start gap-6">
              <MyTimeBlockBoard
                mode="view"
                mySchedules={mySchedules}
                backgroundColor="white"
                className="hidden flex-1 md:block"
              />
              <div className="mt-8 flex-1 rounded-2xl bg-gray-00 px-5 py-4">
                <MyScheduleList hasWeekdaySelcectUI={false} />
              </div>
            </div>
          </section>
        </div>
        <div
          className={clsx(
            'fixed bottom-0 left-0 w-full bg-gray-00 p-4 shadow-[0px_-4px_32px_0px_rgba(0,0,0,0.05)] transition-opacity duration-150 lg:hidden',
            {
              'pointer-events-none opacity-0': isFooterShown,
              'opacity-100': !isFooterShown,
            },
          )}
        >
          <div className="mx-auto w-full max-w-screen-md">
            <Button onClick={handleFloatingBottomButtonClick}>
              <span className="flex items-center justify-center gap-1">
                <span>일정 생성하기</span>
                <span>
                  <IconPlus size={24} />
                </span>
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
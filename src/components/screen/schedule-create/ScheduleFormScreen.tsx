import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from '../../../api/axios';
import { EventType } from '../../../types/event.type';
import { GuestValue } from '../../../types/guest.type';
import { MySchedule, Schedule } from '../../../types/schedule.type';
import { getBlockTimeList } from '../../../utils/time-block';
import { sortWeekdayList } from '../../../utils/weekday';
import FloatingBottomButton from '../../floating-button/FloatingBottomButton';
import TimeBlockBoard from '../../time-block/TimeBlockBoard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface ScheduleFormProps {
  guestId: string;
  isNewGuest: boolean;
  guestValue: GuestValue;
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  isLoggedIn: boolean;
}

export default function ScheduleFormScreen({
  guestId,
  isNewGuest,
  guestValue,
  schedules,
  setSchedules,
  isLoggedIn,
}: ScheduleFormProps) {
  const [isPossibleTime, setIsPossibleTime] = useState(true);

  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();

  const { isLoading: isEventLoading, data: eventData } = useQuery({
    queryKey: ['events', params.eventId],
    queryFn: async () => {
      const res = await axios.get(`/events/${params.eventId}`);
      return res.data;
    },
  });

  let event: EventType = eventData?.payload;

  if (event && event.category === 'DAY')
    event.ranges = sortWeekdayList(event.ranges);

  const { isLoading: isScheduleLoading, data: scheduleData } = useQuery({
    queryKey: [
      'schedules',
      event?.category.toLowerCase(),
      params.eventId,
      isLoggedIn ? 'user' : guestId,
    ],
    queryFn: async () => {
      const res = await axios.get(
        `/schedules/${event?.category.toLowerCase()}/${params.eventId}/${isLoggedIn ? 'user' : guestId}`,
      );
      return res.data;
    },
    enabled: event !== undefined && !isNewGuest,
  });

  const mySchedule: Schedule = scheduleData?.payload;

  const { data: myFixedShedulesData, isLoading: isMyFixedSchedulesLoading } =
    useQuery({
      queryKey: ['fixed-schedules'],
      queryFn: async () => {
        const res = await axios.get('/fixed-schedules');
        return res.data;
      },
      enabled: isLoggedIn,
    });

  const myFixedSchedules: MySchedule[] = myFixedShedulesData?.payload;

  const createNewMemberSchedule = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`/members/action-register`, {
        event_id: params.eventId,
        name: guestValue.name,
        pin: guestValue.pin,
        schedules: schedules[0].schedules,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['schedules'] });
      navigate(`/events/${params.eventId}`);
    },
  });

  const updateSchedule = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `/schedules/${event?.category.toLowerCase()}`,
        {
          event_id: params.eventId,
          member_id: guestId,
          schedules: schedules[0].schedules,
        },
      );
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['schedules'] });
      navigate(`/events/${params.eventId}`);
    },
  });

  function handleSubmit() {
    if (isNewGuest) {
      createNewMemberSchedule.mutate();
    } else {
      updateSchedule.mutate();
    }
  }

  useEffect(() => {
    if (!event) return;
    if (isNewGuest) {
      setSchedules([
        {
          name: guestValue.name,
          schedules: event.ranges.map((timePoint) => ({
            time_point: timePoint,
            times:
              schedules[0].schedules.find((s) => s.time_point === timePoint)
                ?.times || [],
          })),
        },
      ]);
    } else if (!isScheduleLoading && mySchedule) {
      if (mySchedule.schedules.length === 0) {
        if (!isMyFixedSchedulesLoading && myFixedSchedules) {
          let convertedMyFixedSchedules: {
            time_point: string;
            times: string[];
          }[] = dayjs.weekdaysMin().map((weekday) => ({
            time_point: weekday,
            times: [],
          }));

          myFixedSchedules.forEach((fixedSchedule) => {
            fixedSchedule.schedules.forEach((schedule) => {
              const foundedTimeBlock = convertedMyFixedSchedules.find(
                (s) => s.time_point === schedule.time_point,
              );

              if (foundedTimeBlock) {
                foundedTimeBlock.times = [
                  ...new Set([...foundedTimeBlock.times, ...schedule.times]),
                ].sort();
              }
            });
          });

          convertedMyFixedSchedules = convertedMyFixedSchedules.map((s) => ({
            time_point: s.time_point,
            times: getBlockTimeList(event.start_time, event.end_time).filter(
              (time) => !s.times.includes(time),
            ),
          }));

          let newSchedules: Schedule[] = [];

          if (
            convertedMyFixedSchedules.every(
              (s) =>
                JSON.stringify(s.times) ===
                JSON.stringify(
                  getBlockTimeList(event.start_time, event.end_time),
                ),
            )
          ) {
            newSchedules = [
              {
                name: guestValue.name,
                schedules: event.ranges.map((timePoint) => ({
                  time_point: timePoint,
                  times: [],
                })),
              },
            ];
            setIsPossibleTime(true);
          } else {
            newSchedules = [
              {
                name: guestValue.name,
                schedules: event.ranges.map((timePoint) => ({
                  time_point: timePoint,
                  times:
                    convertedMyFixedSchedules.find((s) =>
                      event.category === 'DATE'
                        ? s.time_point ===
                          dayjs(timePoint, 'YYYY.MM.DD').format('dd')
                        : s.time_point === timePoint,
                    )?.times || [],
                })),
              },
            ];
            setIsPossibleTime(false);
          }

          setSchedules(newSchedules);
        }
      } else {
        setSchedules([
          {
            name: guestValue.name,
            schedules: event.ranges.map((timePoint) => ({
              time_point: timePoint,
              times:
                mySchedule.schedules.find((s) => s.time_point === timePoint)
                  ?.times || [],
            })),
          },
        ]);
      }
    }
  }, [
    event,
    isNewGuest,
    isScheduleLoading,
    mySchedule,
    isMyFixedSchedulesLoading,
    myFixedSchedules,
  ]);

  if (isNewGuest) {
    if (isEventLoading || isMyFixedSchedulesLoading) return <></>;
  } else if (isEventLoading || isScheduleLoading) {
    return <></>;
  }

  return (
    <>
      <div className="mb-40">
        <TimeBlockBoard
          schedules={schedules}
          setSchedules={setSchedules}
          event={event}
          isPossibleTime={isPossibleTime}
          setIsPossibleTime={setIsPossibleTime}
          editable
        />
      </div>
      <FloatingBottomButton onClick={handleSubmit}>
        스케줄 등록
      </FloatingBottomButton>
    </>
  );
}

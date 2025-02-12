import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RootState } from '@/store';
import { EventType } from '@/types/event.type';
import { ScheduleType } from '@/types/schedule.type';
import axios from '@/utils/axios';
import { timeBlockList } from '@/utils/time-block';
import { useQuery } from '@tanstack/react-query';

interface UseScheduleCreateProps {
  isNewGuest: boolean;
  guestId: string;
}

export default function useScheduleCreate({
  isNewGuest,
  guestId,
}: UseScheduleCreateProps) {
  const [schedules, setSchedules] = useState<ScheduleType[]>([
    {
      name: '본인',
      schedules: [],
    },
  ]);

  const { originalFixedSchedules } = useSelector(
    (state: RootState) => state.fixedSchedules,
  );
  const { originalSleepTime, sleepTimesList } = useSelector(
    (state: RootState) => state.sleepTime,
  );

  const params = useParams<{ eventId: string }>();

  const isLoggedIn = localStorage.getItem('access-token') !== null;

  const { data: event } = useQuery<EventType>({
    queryKey: ['events', params.eventId],
    queryFn: async () => {
      const res = await axios.get(`/events/${params.eventId}`);
      return res.data.payload;
    },
  });

  const { data: scheduleData } = useQuery<ScheduleType>({
    queryKey: [
      'schedules',
      event?.category?.toLowerCase(),
      params.eventId,
      isLoggedIn ? 'user' : guestId,
    ],
    queryFn: async () => {
      const res = await axios.get(
        `/schedules/${event?.category?.toLowerCase()}/${params.eventId}/${isLoggedIn ? 'user' : guestId}`,
      );
      return res.data.payload;
    },
    enabled:
      event !== undefined && !isNewGuest && (isLoggedIn || guestId !== ''),
  });

  useEffect(() => {
    if (!scheduleData) return;

    const isScheduleEmpty =
      scheduleData.schedules.length === 0 ||
      scheduleData.schedules.every((schedule) => schedule.times.length === 0);
    const isFixedScheduleEmpty = originalFixedSchedules
      ? originalFixedSchedules.every(
          (fixedSchedule) => fixedSchedule.times.length === 0,
        )
      : true;
    const isSleepTimeEmpty = originalSleepTime.start === originalSleepTime.end;

    setSchedules([
      {
        name: scheduleData.name,
        schedules: isScheduleEmpty
          ? isFixedScheduleEmpty && isSleepTimeEmpty
            ? []
            : initSchedule() || []
          : scheduleData.schedules,
      },
    ]);

    function initSchedule() {
      if (!event) return;
      return (
        event.ranges.map((time_point) => ({
          time_point,
          times: newTimes(
            event.start_time,
            event.end_time,
            fixedScheduleTimes(time_point, event.category),
            sleepTimesList,
          ),
        })) || []
      );

      function newTimes(
        startTime: string,
        endTime: string,
        fixedScheduleTimes: string[],
        sleepTimes: string[],
      ) {
        return timeBlockList(startTime, endTime).filter(
          (time) =>
            !unavailableTimes(fixedScheduleTimes, sleepTimes).includes(time),
        );

        function unavailableTimes(
          fixedScheduleTimes: string[],
          sleepTimes: string[],
        ) {
          return Array.from(
            new Set([...fixedScheduleTimes, ...sleepTimes]),
          ).sort();
        }
      }

      function fixedScheduleTimes(timePoint: string, category: 'DATE' | 'DAY') {
        return (
          originalFixedSchedules.find(
            (fixedSchedule) =>
              weekdayIndex(timePoint, category) ===
              weekdayIndex(fixedSchedule.time_point, 'DAY'),
          )?.times || []
        );

        function weekdayIndex(
          timePoint: string,
          category: 'DATE' | 'DAY' = 'DAY',
        ) {
          return dayjs
            .weekdaysMin()
            .findIndex(
              (w) =>
                w ===
                (category === 'DATE'
                  ? dayjs(timePoint).format('ddd')
                  : timePoint),
            );
        }
      }
    }
  }, [scheduleData, originalFixedSchedules, isNewGuest, guestId]);

  return { schedules, setSchedules, event };
}

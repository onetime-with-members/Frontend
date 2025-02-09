import { useEffect, useRef, useState } from 'react';

import BoardContent from './BoardContent';
import LeftTimeLine from './LeftTimeLine';
import PossibleTimeToggle from './PossibleTimeToggle';
import TimeBlockPopUp from './TimeBlockPopUp';
import TopDateLabelGroup from './TopDateLabelGroup';
import { EventType } from '@/types/event.type.ts';
import {
  ScheduleType,
  TimeBlockPopUpDataType,
  TimeType,
} from '@/types/schedule.type.ts';
import cn from '@/utils/cn.ts';
import { timeBlockList } from '@/utils/time-block.ts';

interface TimeBlockBoardProps {
  event: EventType;
  schedules: ScheduleType[];
  setSchedules?: React.Dispatch<React.SetStateAction<ScheduleType[]>>;
  editable?: boolean;
  backgroundColor?: 'white' | 'gray';
  isPossibleTime?: boolean;
  setIsPossibleTime?: React.Dispatch<React.SetStateAction<boolean>>;
  topContentClassName?: string;
  bottomContentClassName?: string;
  isEdited?: boolean;
  setIsEdited?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TimeBlockBoard({
  event,
  schedules,
  setSchedules,
  editable,
  backgroundColor = 'gray',
  isPossibleTime = true,
  setIsPossibleTime,
  topContentClassName,
  bottomContentClassName,
  isEdited,
  setIsEdited,
}: TimeBlockBoardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<TimeBlockPopUpDataType>({
    timePoint: '',
    time: '',
    members: {
      possible: [],
      impossible: [],
    },
  });
  const [dayLineWidth, setDayLineWidth] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isFull, setIsFull] = useState(false);

  const dayLineRef = useRef<HTMLDivElement>(null);
  const boardContentRef = useRef<HTMLDivElement>(null);
  const topLabelRef = useRef<HTMLDivElement>(null);

  const dayLineGap = 12;
  const timePointChunks = chunkRangeArray(event.ranges, 5);
  const innerContentProportion = timePointChunks.length >= 2 ? 0.9 : 1;

  function changeTimeBlockStatus(
    day: string,
    time: ScheduleType['schedules'][0]['times'][0],
    newStatus: boolean,
  ) {
    if (!editable) return;
    initSchedule();
    editTimeBlock();
    changeIsEdited();

    function initSchedule() {
      if (!setSchedules) return;

      setSchedules((prevSchedules) => {
        const newSchedules = [...prevSchedules[0].schedules];

        event.ranges.forEach((range) => {
          const targetIndex = newSchedules.findIndex(
            (s) => s.time_point === range,
          );

          if (targetIndex === -1) {
            newSchedules.push({
              time_point: range,
              times: [],
            });
          }
        });

        return [
          {
            name: prevSchedules[0].name,
            schedules: newSchedules,
          },
        ];
      });
    }

    function editTimeBlock() {
      if (!setSchedules) return;
      setSchedules((prev) => [
        {
          name: prev[0].name,
          schedules: prev[0].schedules.map((schedule) => {
            if (schedule.time_point === day) {
              let newSchedule: TimeType = {
                ...schedule,
                times: schedule.times.filter((t) => t !== time),
              };
              if (newStatus) {
                newSchedule = {
                  ...newSchedule,
                  times: [...newSchedule.times, time],
                };
              }
              return newSchedule;
            } else {
              return schedule;
            }
          }),
        },
      ]);
    }

    function changeIsEdited() {
      if (isEdited === undefined || !setIsEdited) return;
      setIsEdited(true);
    }
  }

  function handleDialogOpen({
    timePoint,
    time,
  }: {
    timePoint: string;
    time: string;
  }) {
    if (schedules.length === 0) return;

    let members: TimeBlockPopUpDataType['members'] = {
      possible: [],
      impossible: [],
    };

    schedules.forEach((schedule) => {
      if (
        schedule.schedules
          .find((s) => s.time_point === timePoint)
          ?.times.includes(time)
      ) {
        members.possible.push(schedule.name);
      } else {
        members.impossible.push(schedule.name);
      }
    });

    members = {
      possible: members.possible.sort(),
      impossible: members.impossible.sort(),
    };

    setDialogData({
      timePoint,
      time,
      members,
    });
    setIsDialogOpen(true);
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
  }

  function chunkRangeArray(array: string[], chunkSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
  }

  function handleAvailableToggle() {
    if (!editable || !setSchedules) return;

    let prevIsAvailable = isPossibleTime;

    if (setIsPossibleTime) {
      setIsPossibleTime((prev) => !prev);
    }

    if (prevIsAvailable && isEmpty) {
      setSchedules(
        schedules.map((schedule) => ({
          ...schedule,
          schedules: schedule.schedules.map((daySchedule) => ({
            ...daySchedule,
            times: timeBlockList(event.start_time, event.end_time),
          })),
        })),
      );
    }

    if (!prevIsAvailable && isFull) {
      setSchedules(
        schedules.map((schedule) => ({
          ...schedule,
          schedules: schedule.schedules.map((daySchedule) => ({
            ...daySchedule,
            times: [],
          })),
        })),
      );
    }
  }

  useEffect(() => {
    function handleResize() {
      setDayLineWidth(dayLineRef.current?.getBoundingClientRect().width || 0);
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dayLineRef]);

  useEffect(() => {
    if (!editable || schedules.length === 0) return;
    setIsEmpty(schedules[0].schedules.every((s) => s.times.length === 0));
    setIsFull(
      schedules[0].schedules.every(
        (s) =>
          timeBlockList(event.start_time, event.end_time).filter(
            (time) => !s.times.includes(time),
          ).length === 0,
      ),
    );
  }, [schedules]);

  useEffect(() => {
    function handleScroll() {
      if (boardContentRef.current && topLabelRef.current) {
        topLabelRef.current.scrollLeft = boardContentRef.current.scrollLeft;
      }
    }

    if (boardContentRef.current && topLabelRef.current) {
      boardContentRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (boardContentRef.current && topLabelRef.current) {
        boardContentRef.current?.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="flex flex-col">
      <div className={cn('sticky top-0 z-10 bg-gray-00', topContentClassName)}>
        {editable && (
          <PossibleTimeToggle
            isPossibleTime={isPossibleTime}
            onToggle={handleAvailableToggle}
            className="pt-4"
          />
        )}
        <TopDateLabelGroup
          topLabelRef={topLabelRef}
          dayLineGap={dayLineGap}
          dayLineWidth={dayLineWidth}
          timePointChunks={timePointChunks}
          category={event.category}
        />
      </div>
      <div className={cn('flex overflow-hidden', bottomContentClassName)}>
        <LeftTimeLine startTime={event.start_time} endTime={event.end_time} />
        <BoardContent
          boardContentRef={boardContentRef}
          dayLineRef={dayLineRef}
          dayLineGap={dayLineGap}
          dayLineWidth={dayLineWidth}
          timePointChunks={timePointChunks}
          event={event}
          schedules={schedules}
          changeTimeBlockStatus={changeTimeBlockStatus}
          handleDialogOpen={handleDialogOpen}
          editable={editable}
          innerContentProportion={innerContentProportion}
          isPossibleTime={isPossibleTime}
          backgroundColor={backgroundColor}
        />
      </div>
      {isDialogOpen && (
        <TimeBlockPopUp
          onClose={handleDialogClose}
          timePoint={dialogData.timePoint}
          time={dialogData.time}
          members={dialogData.members}
          category={event.category}
        />
      )}
    </div>
  );
}

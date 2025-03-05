import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import EverytimeUI from './EverytimeUI/EverytimeUI';
import SleepTimeAccordion from './SleepTimeAccordion/SleepTimeAccordion';
import TopAppBar from './TopAppBar/TopAppBar';
import BackButtonAlert from '@/components/alert/BackButtonAlert/BackButtonAlert';
import MyTimeBlockBoard from '@/components/time-block-board/MyTimeBlockBoard/MyTimeBlockBoard';
import useSleepTime from '@/hooks/useSleepTime';
import {
  useEverytimeSchedule,
  useEverytimeScheduleActions,
} from '@/stores/everytime-schedule';
import { useToast } from '@/stores/toast';
import { MyScheduleTimeType } from '@/types/schedule.type';
import axios from '@/utils/axios';
import cn from '@/utils/cn';
import { weekdaysShortKo } from '@/utils/weekday';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function MyScheduleEditPage() {
  const [mySchedule, setMySchedule] = useState<MyScheduleTimeType[]>(
    weekdaysShortKo.map((weekday) => ({
      time_point: weekday,
      times: [],
    })),
  );
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isBackButtonAlertOpen, setIsBackButtonAlertOpen] = useState(false);
  const [isMyScheduleEdited, setIsMyScheduleEdited] = useState(false);

  const everytimeSchedule = useEverytimeSchedule();
  const { setEverytimeSchedule } = useEverytimeScheduleActions();
  const toast = useToast();

  const { sleepTime, setSleepTime } = useSleepTime();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data } = useQuery<MyScheduleTimeType[]>({
    queryKey: ['fixed-schedules'],
    queryFn: async () => {
      const res = await axios.get('/fixed-schedules');
      return res.data.payload.schedules;
    },
  });

  const editMySchedule = useMutation({
    mutationFn: async () => {
      const res = await axios.put('/fixed-schedules', {
        schedules: mySchedule,
      });
      return res.data.payload;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['fixed-schedules'] });
      navigate(-1);
    },
  });

  const editSleepTime = useMutation({
    mutationFn: async () => {
      const res = await axios.put('/users/sleep-time', sleepTime);
      return res.data.payload;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  function handleCloseButtonClick() {
    if (isMyScheduleEdited) {
      setIsBackButtonAlertOpen(true);
    } else {
      navigate(-1);
    }
  }

  async function handleSubmitButtonClick() {
    editMySchedule.mutate();
    editSleepTime.mutate();
  }

  useEffect(() => {
    if (!data) return;
    setMySchedule((prevMySchedule) =>
      prevMySchedule.map((schedule) => ({
        ...schedule,
        times: Array.from(
          new Set([
            ...schedule.times,
            ...(data.find((s) => s.time_point === schedule.time_point)?.times ||
              []),
          ]),
        ).sort(),
      })),
    );
  }, [data]);

  useEffect(() => {
    if (everytimeSchedule.length === 0) return;
    setMySchedule((prevMySchedule) =>
      prevMySchedule.map((schedule) => ({
        ...schedule,
        times: Array.from(
          new Set([
            ...schedule.times,
            ...(everytimeSchedule.find(
              (s) => s.time_point === schedule.time_point,
            )?.times || []),
          ]),
        ).sort(),
      })),
    );
    setEverytimeSchedule([]);
    setIsMyScheduleEdited(true);
    toast(t('toast.everytime'));
  }, [everytimeSchedule, data, toast, setEverytimeSchedule, t]);

  return (
    <>
      <Helmet>
        <title>{t('myScheduleEdit.myScheduleEdit')} | OneTime</title>
      </Helmet>

      <div className="flex flex-col">
        <TopAppBar
          onBackButtonClick={handleCloseButtonClick}
          onSubmitButtonClick={handleSubmitButtonClick}
        />

        <main className="pb-24">
          <div className="mx-auto max-w-screen-sm">
            <EverytimeUI />
            <SleepTimeAccordion
              sleepTime={sleepTime}
              setSleepTime={setSleepTime}
              isAccordionOpen={isAccordionOpen}
              setIsAccordionOpen={setIsAccordionOpen}
            />
            <MyTimeBlockBoard
              mode="edit"
              mySchedule={mySchedule}
              setMySchedule={setMySchedule}
              sleepTime={sleepTime}
              className="pb-16 pl-2 pr-3"
              topDateGroupClassName={cn('sticky top-[120px] z-10 bg-gray-00', {
                'top-[183px] ': isAccordionOpen,
              })}
              setIsEdited={setIsMyScheduleEdited}
            />
          </div>
        </main>
      </div>

      {isBackButtonAlertOpen && (
        <BackButtonAlert backHref={-1} setIsOpen={setIsBackButtonAlertOpen} />
      )}
    </>
  );
}

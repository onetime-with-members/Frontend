import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import SleepTimeAccordion from './SleepTimeAccordion/SleepTimeAccordion';
import TopAppBar from './TopAppBar/TopAppBar';
import BackButtonAlert from '@/components/alert/BackButtonAlert/BackButtonAlert';
import MyTimeBlockBoard from '@/components/time-block-board/MyTimeBlockBoard/MyTimeBlockBoard';
import { AppDispatch } from '@/store';
import { editSleepTime } from '@/store/sleep-time';
import { MyScheduleTimeType } from '@/types/schedule.type';
import axios from '@/utils/axios';
import cn from '@/utils/cn';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function MyScheduleEditPage() {
  const [mySchedule, setMySchedule] = useState<MyScheduleTimeType[]>([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isBackButtonAlertOpen, setIsBackButtonAlertOpen] = useState(false);
  const [isMyScheduleEdited, setIsMyScheduleEdited] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  function handleCloseButtonClick() {
    if (isMyScheduleEdited) {
      setIsBackButtonAlertOpen(true);
    } else {
      navigate(-1);
    }
  }

  async function handleSubmitButtonClick() {
    await dispatch(editSleepTime());
    editMySchedule.mutate();
  }

  useEffect(() => {
    setMySchedule(data || []);
  }, [data]);

  return (
    <>
      <Helmet>
        <title>내 스케줄 수정 | OneTime</title>
      </Helmet>

      <div className="flex flex-col">
        <TopAppBar
          onBackButtonClick={handleCloseButtonClick}
          onSubmitButtonClick={handleSubmitButtonClick}
        />

        <main className="pb-24">
          <div className="mx-auto max-w-screen-sm">
            <SleepTimeAccordion
              isAccordionOpen={isAccordionOpen}
              setIsAccordionOpen={setIsAccordionOpen}
            />
            <MyTimeBlockBoard
              mode="edit"
              mySchedule={mySchedule}
              setMySchedule={setMySchedule}
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

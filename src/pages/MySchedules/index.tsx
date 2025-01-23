import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MyScheduleDeleteAlert from './MyScheduleDeleteAlert';
import MyScheduleBottomSheet from '@/components/MyScheduleBottomSheet';
import MyScheduleList from '@/components/MyScheduleList';
import MyTimeBlockBoard from '@/components/MyTimeBlockBoard';
import { MyScheduleContext } from '@/contexts/MyScheduleContext';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function MySchedules() {
  const [isMyScheduleDeleteAlertOpen, setIsMyScheduleDeleteAlertOpen] =
    useState(false);

  const {
    selectedTimeBlockId,
    setSelectedTimeBlockId,
    selectedTimeBlock,
    viewMode,
    setViewMode,
  } = useContext(MyScheduleContext);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: mySchedules, isLoading } = useQuery({
    queryKey: ['fixed-schedules'],
    queryFn: async () => {
      const res = await axios.get('/fixed-schedules');
      return res.data.payload;
    },
  });

  const deleteMySchedule = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/fixed-schedules/${selectedTimeBlockId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-schedules'] });
      setIsMyScheduleDeleteAlertOpen(false);
      setSelectedTimeBlockId(null);
    },
  });
  function handleMyScheduleDeleteAlertClose() {
    setIsMyScheduleDeleteAlertOpen(false);
  }

  function handleMyScheduleDelete() {
    deleteMySchedule.mutate();
  }

  function handleBottomSheetClose() {
    setSelectedTimeBlockId(null);
  }

  function handleBottomSheetDeleteButtonClick() {
    setIsMyScheduleDeleteAlertOpen(true);
  }

  function handleBottomSheetEditButtonClick() {
    initMyScheduleContext();
    navigate(`/mypage/schedules/${selectedTimeBlockId}/edit`);

    function initMyScheduleContext() {
      setSelectedTimeBlockId(null);
      setViewMode('timeblock');
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewMode]);

  useEffect(() => {
    return () => {
      setSelectedTimeBlockId(null);
      setViewMode('timeblock');
    };
  }, []);

  return (
    !isLoading &&
    mySchedules && (
      <>
        <div>
          <div className="mx-auto w-full max-w-screen-sm pb-32">
            {
              {
                timeblock: (
                  <MyTimeBlockBoard
                    mode="view"
                    mySchedules={mySchedules}
                    topDateGroupClassName="sticky z-10 bg-gray-00 top-[64px] md:top-0"
                  />
                ),
                list: <MyScheduleList />,
              }[viewMode]
            }
          </div>
        </div>
        {isMyScheduleDeleteAlertOpen && (
          <MyScheduleDeleteAlert
            onConfirm={handleMyScheduleDelete}
            onCancel={handleMyScheduleDeleteAlertClose}
            onClose={handleMyScheduleDeleteAlertClose}
            isDeleteLoading={deleteMySchedule.isPending}
          />
        )}
        {selectedTimeBlockId !== null && (
          <MyScheduleBottomSheet
            onClose={handleBottomSheetClose}
            handleDeleteButtonClick={handleBottomSheetDeleteButtonClick}
            handleEditButtonClick={handleBottomSheetEditButtonClick}
            title={selectedTimeBlock?.title || ''}
            mode="view"
            overlay={false}
          />
        )}
      </>
    )
  );
}

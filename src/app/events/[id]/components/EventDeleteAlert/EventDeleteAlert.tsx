import { useTranslations } from 'next-intl';

import Alert from '@/components/alert/Alert/Alert';
import axios from '@/utils/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

interface EventDeleteAlertProps {
  setIsEventDeleteAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EventDeleteAlert({
  setIsEventDeleteAlertOpen,
}: EventDeleteAlertProps) {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations('alert');

  const deleteEvent = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/events/${params.id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      router.push('/');
    },
  });

  function handleEventDeleteALertClose() {
    setIsEventDeleteAlertOpen(false);
  }

  function handleEventDelete() {
    deleteEvent.mutate();
  }

  return (
    <Alert
      onConfirm={handleEventDelete}
      onCancel={handleEventDeleteALertClose}
      onClose={handleEventDeleteALertClose}
      confirmText={
        deleteEvent.isPending
          ? t('deleteEventConfirming')
          : t('deleteEventConfirm')
      }
      cancelText={t('deleteEventCancel')}
    >
      <div className="flex h-full flex-col items-center gap-1 pb-8 pt-10 text-center">
        <h2 className="text-gray-80 text-lg-300">{t('deleteEventTitle')}</h2>
        <p className="text-gray-60 text-md-100">
          {t.rich('deleteEventDescription', {
            br: () => <br />,
          })}
        </p>
      </div>
    </Alert>
  );
}

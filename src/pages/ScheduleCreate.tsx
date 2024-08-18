import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ScheduleCancelPopUp from '../components/dialog/ScheduleCancelPopUp';
import MemberLogin from '../components/screens/schedule-create/MemberLogin';
import ScheduleForm from '../components/screens/schedule-create/ScheduleForm';
import { EventValue } from '../types/event.type';
import { MemberValue } from '../types/member.type';
import { IconChevronLeft } from '@tabler/icons-react';

export default function ScheduleCreate() {
  const [pageIndex, setPageIndex] = useState(0);
  const [memberId, setMemberId] = useState('');
  const [eventCategory, setEventCategory] =
    useState<EventValue['category']>('DAY');
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [value, setValue] = useState<MemberValue>({
    name: '',
    pin: '',
  });

  const navigate = useNavigate();

  function handleBackButtonClick() {
    if (pageIndex === 0) {
      if (isEmpty) {
        navigate(-1);
      } else {
        setIsPopUpOpen(true);
      }
    } else {
      setPageIndex((prev) => prev - 1);
    }
  }

  function handlePopUpClose() {
    setIsPopUpOpen(false);
  }

  function handlePopUpConfirm() {
    setIsPopUpOpen(false);
    navigate(-1);
  }

  return (
    <>
      <div className="px-4">
        <header className="h-[67px]">
          <div className="fixed left-0 top-0 z-40 w-full bg-white px-4">
            <div className="mx-auto grid max-w-screen-sm grid-cols-3 py-5">
              <div className="flex items-center">
                <button onClick={handleBackButtonClick}>
                  <IconChevronLeft size={24} className="text-gray-80" />
                </button>
              </div>
              <h2 className="text-lg-300 text-center text-gray-90">
                정보 입력
              </h2>
            </div>
          </div>
        </header>
        <main className="mx-auto mt-4 max-w-screen-sm">
          {pageIndex === 0 && (
            <MemberLogin
              setPageIndex={setPageIndex}
              setMemberId={setMemberId}
              setEventCategory={setEventCategory}
              setIsEmpty={setIsEmpty}
              value={value}
              setValue={setValue}
            />
          )}
          {pageIndex === 1 && (
            <ScheduleForm memberId={memberId} eventCategory={eventCategory} />
          )}
        </main>
      </div>
      {isPopUpOpen && (
        <ScheduleCancelPopUp
          onConfirm={handlePopUpConfirm}
          onClose={handlePopUpClose}
        />
      )}
    </>
  );
}
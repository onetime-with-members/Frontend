import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from '../api/axios';
import withdrawClock from '../assets/withdraw-clock.svg';
import WithdrawGrayBox from '../components/WithdrawGrayBox';
import Button from '../components/button/Button';
import RedCheckbox from '../components/checkbox/RedCheckbox';
import { IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

export default function WithdrawPage() {
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();

  const withdrawUser = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/users/action-withdraw');
      return res.data;
    },
    onSuccess: () => {
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      location.href = '/';
    },
  });

  function handleCheckboxClick() {
    setIsChecked((prev) => !prev);
  }

  function handleBackButtonClick() {
    navigate(-1);
  }

  function handleWithdrawButtonClick() {
    withdrawUser.mutate();
  }

  return (
    <>
      <header className="h-[4rem]">
        <div className="fixed h-[4rem] w-full bg-gray-00 px-4">
          <div className="mx-auto w-full max-w-screen-sm">
            <div className="flex w-full items-center justify-end py-5">
              <button onClick={handleBackButtonClick}>
                <IconX size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="px-4 pb-24">
        <div className="mx-auto max-w-screen-sm">
          <div className="flex w-full flex-col items-center gap-10">
            <div className="flex w-full flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-8">
                <div>
                  <img src={withdrawClock} alt="깨진 시계 이미지" />
                </div>
                <h1 className="text-gray-90 title-md-300">
                  정말 서비스를 탈퇴하시겠어요?
                </h1>
              </div>
              <div className="flex w-full flex-col gap-4">
                <WithdrawGrayBox
                  title="회원님의 계정이 즉시 삭제돼요"
                  description="탈퇴한 회원의 정보는 복구할 수 없어요. 탈퇴 후에는 회원님의 계정이 즉시 삭제돼요."
                />
                <WithdrawGrayBox
                  title="회원님의 일정 및 스케줄 데이터가 모두 삭제돼요"
                  description="참여한 이벤트에 등록한 스케줄 등 OneTime에서 작성하신 내용이 모두 삭제돼요."
                />
                <div
                  className="flex cursor-pointer items-center gap-4 rounded-xl bg-danger-10 p-4"
                  onClick={handleCheckboxClick}
                >
                  <RedCheckbox isChecked={isChecked} />
                  <div className="text-danger-60 text-md-200">
                    상기 내용을 모두 확인했습니다.
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="danger"
              disabled={!isChecked}
              onClick={handleWithdrawButtonClick}
            >
              탈퇴하기
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

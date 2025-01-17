import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import clock from '../../../assets/clock.svg';
import Button from '../../button/Button';

interface WelcomeScreenProps {
  name: string;
  isVisible: boolean;
}

export default function WelcomeScreen({ name, isVisible }: WelcomeScreenProps) {
  const navigate = useNavigate();

  function handleStartButtonClick() {
    const redirectUrl = localStorage.getItem('redirect-url');

    if (redirectUrl) {
      localStorage.removeItem('redirect-url');
      navigate(redirectUrl);
    } else {
      navigate('/');
    }
  }

  return (
    <main
      className={clsx('flex h-screen flex-col items-center justify-center', {
        hidden: !isVisible,
      })}
    >
      <div className="flex w-full -translate-y-8 flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-6">
          <div>
            <img
              src={clock}
              alt="시계 이미지"
              className="h-[10rem] w-[10rem]"
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-center text-[2rem] font-bold text-gray-90">
              환영합니다,
              <br className="block md:hidden" />
              {name}님!
            </h1>
            <p className="text-gray-90 text-lg-200">
              지금부터 OneTime을 사용해볼까요?
            </p>
          </div>
        </div>
        <div className="w-full max-w-[22rem]">
          <Button variant="black" onClick={handleStartButtonClick}>
            시작하기
          </Button>
        </div>
      </div>
    </main>
  );
}

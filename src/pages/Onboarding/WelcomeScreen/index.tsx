import clsx from 'clsx';

import StartButton from './StartButton';
import WelcomeContent from './WelcomeContent';

interface WelcomeScreenProps {
  name: string;
  isVisible: boolean;
}

export default function WelcomeScreen({ name, isVisible }: WelcomeScreenProps) {
  return (
    <main
      className={clsx('flex h-screen flex-col items-center justify-center', {
        hidden: !isVisible,
      })}
    >
      <div className="flex w-full -translate-y-8 flex-col items-center gap-12">
        <WelcomeContent name={name} />
        <StartButton />
      </div>
    </main>
  );
}
import BottomButton from './BottomButton';
import TopContent from './TopContent';
import ClockPattern from '@/components/ClockPattern';

export default function BottomSection() {
  return (
    <section className="relative mt-10 w-full overflow-hidden bg-primary-40 px-4 pb-14 pt-20">
      <div className="relative z-10 flex flex-col items-center gap-16">
        <TopContent />
        <BottomButton />
      </div>
      <ClockPattern gap={14} />
    </section>
  );
}

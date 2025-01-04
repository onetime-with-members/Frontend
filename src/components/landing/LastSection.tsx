import { Link } from 'react-router-dom';

import clockImage from '../../assets/landing/clock.png';
import ClockPattern from '../clock-pattern/ClockPattern';

export default function LastSection() {
  return (
    <section className="relative mt-10 w-full overflow-hidden bg-primary-40 pb-14 pt-20">
      <div className="relative z-10 flex flex-col items-center gap-[4.25rem]">
        <div className="flex flex-col items-center gap-9">
          <div className="h-[152px] w-[152px]">
            <img src={clockImage} alt="시계" className="h-full w-full" />
          </div>
          <p className="text-center text-gray-00 title-lg-300">
            일정을 생성하고 그룹원들과
            <br />
            쉽고 빠르게 스케줄을 맞춰봐요
          </p>
        </div>
        <div className="flex w-full justify-center px-4">
          <Link
            to="/events/new"
            className="flex h-[4rem] w-full max-w-[23rem] items-center justify-center rounded-2xl bg-[#1B1C23] text-gray-00 title-sm-200"
          >
            일정 생성하기
          </Link>
        </div>
      </div>
      <ClockPattern />
    </section>
  );
}

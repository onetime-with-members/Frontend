import featureImage from '../../../../assets/landing/recommend-and-participant.png';
import Feature from './Feature';

export default function RecommendAndParticipantsFeature() {
  return (
    <Feature
      title={
        <>
          더 이상 스트레스 없는 <br />
          간편한 일정 조율
        </>
      }
      badgeTitle="빠른 현황 확인"
      description={
        <>
          이벤트 참여자와 가장 많은 사람들이 <br />
          되는 시간을 한눈에 확인할 수 있어요.
        </>
      }
      image={
        <div>
          <img
            src={featureImage}
            alt="참여자 및 시간 추천 UI 이미지"
            className="scale-110"
          />
        </div>
      }
    />
  );
}
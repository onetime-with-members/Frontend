import AllCheckItem from './AllCheckItem';
import CheckItem from './CheckItem';
import { AgreementKeyType, AgreementType } from '@/types/user.type';

interface AgreementsContentProps {
  value: AgreementType;
  setValue: React.Dispatch<React.SetStateAction<AgreementType>>;
  setPageDetail: React.Dispatch<React.SetStateAction<AgreementKeyType | null>>;
}

export default function AgreementsContent({
  value,
  setValue,
  setPageDetail,
}: AgreementsContentProps) {
  return (
    <div className="flex flex-col gap-6">
      <AllCheckItem value={value} setValue={setValue} />
      <div className="flex flex-col gap-6 px-4">
        <CheckItem
          checkedKey="service_policy_agreement"
          value={value}
          setValue={setValue}
          setPageDetail={setPageDetail}
          hasPageDetail
        >
          서비스 이용약관(필수)
        </CheckItem>
        <CheckItem
          checkedKey="privacy_policy_agreement"
          value={value}
          setValue={setValue}
          setPageDetail={setPageDetail}
          hasPageDetail
        >
          개인정보 수집 및 이용 동의(필수)
        </CheckItem>
        <CheckItem
          checkedKey="marketing_policy_agreement"
          value={value}
          setValue={setValue}
          setPageDetail={setPageDetail}
        >
          마케팅 정보 수신 동의(선택)
        </CheckItem>
      </div>
    </div>
  );
}

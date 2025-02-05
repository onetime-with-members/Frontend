import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import NavBar from '@/components/NavBar';
import AgreementsContent from '@/components/agreement/AgreementsContent';
import Button from '@/components/button/Button';
import usePolicy from '@/hooks/usePolicy';
import { AgreementKeyType, AgreementType } from '@/types/user.type';
import axios from '@/utils/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function AgreementsEditPage() {
  const [value, setValue] = useState<AgreementType>({
    service_policy_agreement: false,
    privacy_policy_agreement: false,
    marketing_policy_agreement: false,
  });
  const [pageDetail, setPageDetail] = useState<AgreementKeyType | null>(null);

  const { policyData, isLoggedIn } = usePolicy();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const agreePolicies = useMutation({
    mutationFn: async () => {
      const res = await axios.put('/users/policy', value);
      return res.data.payload;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate(-1);
    },
  });

  function handleSubmitButtonClick() {
    agreePolicies.mutate();
  }

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(-1);
    }
  }, []);

  useEffect(() => {
    if (!policyData) return;
    setValue({
      ...policyData,
    });
  }, [policyData]);

  useEffect(() => {
    if (pageDetail === 'service_policy_agreement') {
      navigate('/agreements/service');
    } else if (pageDetail === 'privacy_policy_agreement') {
      navigate('/agreements/privacy');
    }
  }, [pageDetail]);

  return (
    <>
      <NavBar />
      <div className="px-4 py-12">
        <div className="mx-auto flex w-full max-w-screen-xs flex-col gap-12">
          <h1 className="text-center text-gray-90 title-lg-300">
            서비스 이용을 위해 <br />
            약관에 동의해주세요
          </h1>
          <AgreementsContent
            value={value}
            setValue={setValue}
            setPageDetail={setPageDetail}
          />
          <div className="flex flex-col items-center gap-3">
            <Button variant="black" onClick={handleSubmitButtonClick} fullWidth>
              확인
            </Button>
            <div className="flex items-center gap-1.5 px-4 text-gray-50 text-sm-200">
              <span>약관에 동의하지 않으시나요?</span>
              <Link to="/withdraw" className="text-danger-50 text-sm-200">
                탈퇴 페이지로 이동
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

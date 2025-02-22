import { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import logoWhite from '@/assets/logo-white.svg';
import { FooterContext } from '@/contexts/FooterContext';
import { IconBrandInstagram } from '@tabler/icons-react';

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  const footerContext = useContext(FooterContext);

  const { setFooterRef } = footerContext;

  useEffect(() => {
    if (footerRef && footerRef.current) {
      setFooterRef(footerRef);
    }
  }, [footerRef]);

  return (
    <footer ref={footerRef} className="bg-gray-80 px-4 pb-20 pt-8">
      <div className="mx-auto flex max-w-screen-sm flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <img src={logoWhite} alt="원타임 로고" />
            </div>
            <a
              href="https://www.instagram.com/one.time.official/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-70 p-2"
            >
              <IconBrandInstagram size={20} className="text-gray-40" />
            </a>
          </div>
          <p className="text-gray-20 text-sm-100">
            ©OneTime. ALL RIGHTS RESERVED
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-40">
          <Link to="/policy/privacy">개인정보처리방침</Link>
          <span>|</span>
          <Link to="/policy/service">서비스 이용 약관</Link>
        </div>
      </div>
    </footer>
  );
}

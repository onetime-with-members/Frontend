import clsx from 'clsx';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { FooterContext } from '../contexts/FooterContext';

export default function Layout() {
  const footerContext = useContext(FooterContext);

  const { isFooterVisible } = footerContext!;

  return (
    <>
      <ScrollToTop />
      <div
        className={clsx('flex h-full flex-col', {
          'min-h-[110vh]': isFooterVisible,
          'min-h-[100vh]': !isFooterVisible,
        })}
      >
        <Outlet />
      </div>
      {isFooterVisible && <Footer />}
    </>
  );
}

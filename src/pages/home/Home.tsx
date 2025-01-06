import { Helmet } from 'react-helmet-async';

import Landing from '../landing/Landing';
import UserDashboard from '../user-dashboard/UserDashboard';

export default function Home() {
  const isLoggedIn = !!localStorage.getItem('access-token');

  let content = null;

  if (isLoggedIn) {
    content = <UserDashboard />;
  } else {
    content = <Landing />;
  }

  return (
    <>
      <Helmet>
        <title>
          OneTime | 원타임으로 쉽고 빠르게 모두가 되는 시간을 찾으세요
        </title>
      </Helmet>
      {content}
    </>
  );
}
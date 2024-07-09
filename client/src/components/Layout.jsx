import { useLocation } from 'react-router-dom';
import Header from './Header';
import Header2 from './Header2';

const Layout = ({ children }) => {
  const location = useLocation();
  const headerRoutes = [
    '/', 
    '/sign-in', 
    '/sign-up', 
    '/about', 
    '/profile', 
    '/createListing', 
    '/updateListing/:listingId', 
    '/listing/:listingId',
  ];

  const showHeader = headerRoutes.some(route => 
    new RegExp(`^${route.replace(/:[^\s/]+/g, '[^/]+')}$`).test(location.pathname)
  );

  return (
    <>
      {showHeader ? <Header /> : <Header2 />}
      {children}
    </>
  );
};

export default Layout;

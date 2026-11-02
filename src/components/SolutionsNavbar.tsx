import type { FC, ReactNode } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../Routes.ts';
import type { RouteKeyType } from '../Routes.ts';

interface NavbarItem {
  key: RouteKeyType;
  icon: ReactNode;
  disabled?: boolean;
}

const stroke = {
  stroke: '#4BDE81',
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const NAVBAR_ITEMS: NavbarItem[] = [
  {
    key: 'FEED',
    icon: (
      <svg viewBox="0 0 37 37" width="28" height="28" fill="none">
        <path
          d="M13.9 33.9V18.5H23.1V33.9M4.6 13.9L18.5 3.1L32.4 13.9V30.8C32.4 31.7 32.1 32.4 31.5 33C30.9 33.6 30.1 33.9 29.3 33.9H7.7C6.9 33.9 6.1 33.6 5.5 33C4.9 32.4 4.6 31.7 4.6 30.8V13.9Z"
          {...stroke}
        />
      </svg>
    ),
  },
  {
    key: 'ADD',
    disabled: true,
    icon: (
      <svg viewBox="0 0 37 37" width="28" height="28" fill="none">
        <circle cx="18.5" cy="18.5" r="16" {...stroke} />
        <path d="M18.5 11V26M11 18.5H26" {...stroke} />
      </svg>
    ),
  },
  {
    key: 'GRID',
    icon: (
      <svg viewBox="0 0 37 37" width="28" height="28" fill="none">
        <rect x="4" y="4" width="12" height="12" stroke="#4BDE81" strokeWidth="2" />
        <rect x="21" y="4" width="12" height="12" stroke="#4BDE81" strokeWidth="2" />
        <rect x="21" y="21" width="12" height="12" stroke="#4BDE81" strokeWidth="2" />
        <rect x="4" y="21" width="12" height="12" stroke="#4BDE81" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: 'LOGIN',
    disabled: true,
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
        <path
          d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
          stroke="#4BDE81"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export const SolutionsNavbar: FC = () => {
  const { pathname } = useLocation();

  const isActive = (key: RouteKeyType) => {
    if (key === 'FEED') {
      return pathname.startsWith(ROUTES.FEED) && !pathname.startsWith(ROUTES.GRID);
    }
    return pathname === ROUTES[key];
  };

  return (
    <Navbar as="nav" className="bottom-nav">
      <Nav className="bottom-nav__list">
        {NAVBAR_ITEMS.map(({ key, icon, disabled }) =>
          disabled ? (
            <Nav.Link
              key={key}
              disabled
              className="nav-btn"
              aria-label={ROUTE_LABELS[key]}
              title={ROUTE_LABELS[key]}
            >
              {icon}
            </Nav.Link>
          ) : (
            <Nav.Link
              key={key}
              as={Link}
              to={ROUTES[key]}
              active={isActive(key)}
              className="nav-btn"
              aria-label={ROUTE_LABELS[key]}
              title={ROUTE_LABELS[key]}
            >
              {icon}
            </Nav.Link>
          ),
        )}
      </Nav>
    </Navbar>
  );
};

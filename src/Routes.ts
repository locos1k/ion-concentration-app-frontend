export const ROUTES = {
  FEED: '/solutions',
  ADD: '/solutions/draft',
  GRID: '/solutions/list',
  LOGIN: '/login',
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  FEED: 'Лента',
  ADD: 'Добавление',
  GRID: 'Плитка',
  LOGIN: 'Вход',
};

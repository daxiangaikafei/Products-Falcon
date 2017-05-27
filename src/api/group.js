import { fetch } from 'utils/fetch';

export function fetchList(query) {
  return fetch({
    url: '/group/list',
    method: 'get',
    params: query
  });
}

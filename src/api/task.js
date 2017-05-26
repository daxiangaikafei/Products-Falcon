import { fetch } from 'utils/fetch';

export function fetchList(query) {
  return fetch({
    url: '/task/list',
    method: 'get',
    params: query
  });
}

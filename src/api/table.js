import { fetch } from 'utils/fetch';

export function fetchList(query) {
  return fetch({
    url: '/table/list',
    method: 'get',
    params: query
  });
}

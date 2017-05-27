import { fetch } from 'utils/fetch';

export function fetchLog(query) {
  return fetch({
    url: '/log/detail',
    method: 'get',
    params: query
  });
}
import { fetch } from 'utils/fetch';

export function fetchLog(startIndex, endIndex) {
  return fetch({
    url: '/falcon/joblog/queryLogs.html',
    method: 'post',
    data: {startIndex, endIndex}
  });
}
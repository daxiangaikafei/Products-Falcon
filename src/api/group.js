import { fetch } from 'utils/fetch';

export function fetchList(query) {
  return fetch({
    url: '/falcon/jobproject/queryProjectList.html',
    method: 'post',
    data: {query}
  });
}

export function saveOrUpdate(form) {
  return fetch({
    url: '/falcon/jobproject/save.html',
    method: 'post',
    data: {form}
  });
}

export function deleteGroup(projectId) {
  return fetch({
    url: '/falcon/jobproject/delete.html',
    method: 'post',
    data: {projectId}
  });
}
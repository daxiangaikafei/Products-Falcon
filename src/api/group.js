import { fetch } from 'utils/fetch';

export function fetchList(query) {
  return fetch({
    url: '/falcon/jobproject/queryProjectList.html',
    method: 'post',
    data: query
  });
}

export function saveOrUpdate(form) {
  return fetch({
    url: '/falcon/jobproject/save.html',
    method: 'post',
    data: form
  });
}

export function run(projectId) {
  return fetch({
    url: '/falcon/jobproject/run.html',
    method: 'post',
    data: {projectId}
  });
}

export function stop(projectId) {
  return fetch({
    url: '/falcon/jobproject/stop.html',
    method: 'post',
    data: {projectId}
  });
}

export function queryProjectInfo(projectId) {
  return fetch({
    url: '/falcon/jobproject/queryProjectInfo.html',
    method: 'post',
    data: {projectId}
  });
}

export function deleteGroup(projectId) {
  return fetch({
    url: '/falcon/jobproject/delete.html',
    method: 'post',
    data: {projectId}
  });
}
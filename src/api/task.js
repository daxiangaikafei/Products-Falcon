import { fetch } from 'utils/fetch';

export function fetchList(query) {
  return fetch({
    url: '/falcon/jobproject/queryProjectList.html',
    method: 'post',
    data: query
  })
}

export function saveOrUpdate(form) {
  return fetch({
    url: '/falcon/job/save.html',
    method: 'post',
    data: form
  })
}

export function runOrStop(actionName, jobIds) {
  return fetch({
    url: '/falcon/job/save.html',
    method: 'post',
    data: {
      actionName, jobIds
    }
  })
}

export function deleteJob(jobId) {
  return fetch({
    url: '/falcon/job/save.html',
    method: 'post',
    data: {
      jobId
    }
  })
}

export function fetchSubTaskList(query) {
  return fetch({
    url: '/task/subList',
    method: 'get',
    data: query
  });
}
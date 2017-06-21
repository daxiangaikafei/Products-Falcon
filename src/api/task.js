import { fetch } from 'utils/fetch';

export function fetchList(query) {
  return fetch({
    url: '/falcon/job/queryJobList.html',
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

export function run(jobId) {
  return fetch({
    url: '/falcon/job/run.html',
    method: 'post',
    data: {
      jobId
    }
  })
}

export function stop(jobId) {
  return fetch({
    url: '/falcon/job/stop.html',
    method: 'post',
    data: {
      jobId
    }
  })
}

export function deleteJob(jobId) {
  return fetch({
    url: '/falcon/job/delete.html',
    method: 'post',
    data: {
      jobId
    }
  })
}

export function queryJobInfo(jobId) {
  return fetch({
    url: '/falcon/job/queryJobInfo.html',
    method: 'post',
    data: {
      jobId
    }
  })
}

export function queryJobRefer(jobId) {
  return fetch({
    url: '/falcon/job/queryJobRefer.html',
    method: 'post',
    data: {
      jobId
    }
  })
}

export function queryReferJob(jobId) {
  return fetch({
    url: '/falcon/job/queryReferJob.html',
    method: 'post',
    data: {
      jobId
    }
  })
}

export function queryWfJobsList(query) {
  return fetch({
    url: '/falcon/job/queryWfJobsList.html',
    method: 'post',
    data: query
  });
}

export function queryRunMapList(query) {
  return fetch({
    url: '/falcon/job/queryRunMapList.html',
    method: 'post',
    data: query
  });
}

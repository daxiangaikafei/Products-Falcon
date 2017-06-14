import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import loginAPI from './login';
import taskAPI from './task';
import groupAPI from './group';
import logAPI from './log';
import searchAPI from './search';
const mock = new MockAdapter(axios);

// login
mock.onPost('/falcon/user/login.html').reply(loginAPI.loginByEmail);
mock.onPost('/falcon/user/logout.html').reply(loginAPI.logout);
mock.onGet('/user/info').reply(loginAPI.getInfo);

// task manage
mock.onPost('/falcon/job/queryJobList.html').reply(taskAPI.getList);
mock.onPost('/falcon/job/save.html').reply(taskAPI.saveOrUpdate);
mock.onPost('/falcon/job/jobaction.html').reply(taskAPI.getList);
mock.onPost('/falcon/job/delete.html').reply(taskAPI.getList);

mock.onGet('/task/subList').reply(taskAPI.getSubList);

// group manage
mock.onGet('/falcon/jobproject/queryProjectList.html').reply(groupAPI.getList);
mock.onGet('/falcon/jobproject/save.html').reply(groupAPI.getList);
mock.onGet('/falcon/jobproject/delete.html').reply(groupAPI.getList);

// log
mock.onGet('/falcon/joblog/queryLogs.html').reply(logAPI.getDetail);

// search
mock.onGet('/search/user').reply(searchAPI.searchUser);

mock.onAny().passThrough();

export default mock;

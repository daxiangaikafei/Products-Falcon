import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import loginAPI from './login';
import taskAPI from './task';
import searchAPI from './search';
const mock = new MockAdapter(axios);

// 登录相关
mock.onPost('/login/loginbyemail').reply(loginAPI.loginByEmail);
mock.onPost('/login/logout').reply(loginAPI.logout);
mock.onGet('/user/info').reply(loginAPI.getInfo);

// task manage
mock.onGet('/task/list').reply(taskAPI.getList);

// 搜索相关
mock.onGet('/search/user').reply(searchAPI.searchUser);

mock.onAny().passThrough();

export default mock;

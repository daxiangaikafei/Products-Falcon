import { fetch } from 'utils/fetch';

export function loginByEmail(email, password) {
  return fetch({
    url: '/falcon/user/login.html',
    method: 'post',
    data : {
      userName:email,
      password
    }
  })
}

export function changePwd(password, newPwd) {
  const data = {
    password,
    newPwd
  }
  return fetch({
    url: '/falcon/user/changpwd.html',
    method: 'post',
    data
  })
}

export function logout() {
  return fetch({
    url: '/falcon/user/logout.html',
    method: 'post'
  })
}


export function getInfo(email, password) {
  return fetch({
    url: '/falcon/user/login.html',
    method: 'post',
    data : {
      userName:email,
      password
    }
  })
}


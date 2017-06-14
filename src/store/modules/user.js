import { loginByEmail, logout, getInfo } from 'api/login';
import Cookies from 'js-cookie';

const user = {
  state: {
    user: '',
    status: '',
    email: '',
    code: '',
    uid: Cookies.get('uid') || undefined,
    auth_type: '',
    token: Cookies.get('X-Ivanka-Token'),
    name: Cookies.get('name') || '',
    avatar: '',
    introduction: Cookies.get('introduction') || '',
    roles: Array(Cookies.get('roles')),
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_AUTH_TYPE: (state, type) => {
      state.auth_type = type;
    },
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_UID: (state, uid) => {
      state.uid = uid;
    },
    SET_EMAIL: (state, email) => {
      state.email = email;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    }
  },

  actions: {
    // 登录
    LoginByEmail({ commit }, userInfo) {
      const email = userInfo.email.trim();
      return new Promise((resolve, reject) => {
        loginByEmail(email, userInfo.password).then(response => {
          if (response.success){
            const data = response.data;
            Cookies.set('X-Ivanka-Token', 'admin');
            Cookies.set('uid',data.userId)
            Cookies.set('name',data.userName)
            Cookies.set('introduction',data.nickName)
            Cookies.set('roles','admin')
            commit('SET_TOKEN', 'admin');
            commit('SET_EMAIL', email);
            commit('SET_ROLES', ['admin']);
            commit('SET_NAME', data.userName);
            commit('SET_AVATAR', data.avatar);
            commit('SET_UID', data.userId);
            commit('SET_INTRODUCTION', data.nickName);
            
          }
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },


     // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // getInfo(state.token).then(response => {
          // const data = response.data;
          const data = {
            userId: Cookies.get('uid'),
            userName: Cookies.get('name'),
            nickName: Cookies.get('introduction'),
            role: Cookies.get('roles')
          }
          commit('SET_ROLES', data.role || ['admin']);
          commit('SET_EMAIL', data.email);
          commit('SET_ROLES', Array(data.role));
          commit('SET_NAME', data.userName);
          commit('SET_AVATAR', data.avatar);
          commit('SET_UID', data.userId);
          commit('SET_INTRODUCTION', data.nickName);
          resolve({data});
        // }).catch(error => {
        //   reject(error);
        // });
      });
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code);
    //     loginByThirdparty(state.status, state.email, state.code, state.auth_type).then(response => {
    //       commit('SET_TOKEN', response.data.token);
    //       Cookies.set('X-Ivanka-Token', response.data.token);
    //       resolve();
    //     }).catch(error => {
    //       reject(error);
    //     });
    //   });
    // },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          Cookies.remove('X-Ivanka-Token');
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

        // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        Cookies.remove('X-Ivanka-Token');
        resolve();
      });
    }
  }
};

export default user;

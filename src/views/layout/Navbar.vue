<template>
    <el-menu class="navbar" mode="horizontal" theme="dark">
            <div class="left">
                <Hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></Hamburger>
                <levelbar></levelbar>
            </div>
            <div class="right">
                    <ErrLog v-if="log.length>0" class="errLog-container" :logsList="log"></ErrLog>
                    <div class="avatar-container" trigger="click">
                            <div class="help">
                                <Icon :icon-name="'alert-circle'" ></Icon>
                                帮助
                            </div>
                            <span class="line"></span>
                            <div class="avatar-wrapper">
                                <img v-if="avatar" class="user-avatar" :src="avatar">
                                <Icon v-if="!avatar" icon-name="user" color="#fbfdff" :size="16"  ></Icon>
                                用户账号：{{name}} [{{introduction}}]
                            </div>
                            <span class="line"></span>                            
                            <div class="exit" @click="logout">
                                <Icon :icon-name="'exit'" ></Icon>
                                退出
                            </div>
                            <!--<el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>-->
                    </div>
            </div>
    </el-menu>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Levelbar from './Levelbar';
    import Hamburger from 'components/Hamburger';
    import ErrLog from 'components/ErrLog';
    import errLogStore from 'store/errLog';

    export default {
      components: {
        Levelbar,
        Hamburger,
        ErrLog
      },
      data() {
        return {
          log: errLogStore.state.errLog
        }
      },
      computed: {
        ...mapGetters([
          'sidebar',
          'name',
          'avatar',
          'introduction'
        ])
      },
      methods: {
        toggleSideBar() {
          this.$store.dispatch('ToggleSideBar')
        },
        logout() {
          this.$store.dispatch('LogOut').then(() => {
            this.$router.push({ path: '/login' })
          });
        }
      }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";

    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        &>div{
            height: 50px;
        }
        &:before, &:after {
            content: none;
        }
        @include flex;
        @include flex-justify;
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .errLog-container {
            display: inline-block;
        }
        .right {
            color: #fbfdff;
            font-size: 14px;
            @include flex;
            @include flex-justify;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            text-align: center;
            @include flex;
            @include flex-justify;
            @include flex-align-center;
            
            .avatar-wrapper {
                height: 100%;
                
                .user-avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    margin-right: 5px;
                }
                svg {
                    margin-right: 5px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
            .avatar-wrapper, .help, .exit {
                @include flex;
                @include flex-justify-center;
                @include flex-align-center;
            }
            .help, .exit {
                cursor:pointer;                
                .icon {
                    margin-right: 3px;
                }
            }
            .exit {
                padding-right: 10px;
            }
            .line {
                border-left: 1px solid #8391a5;
                height: 15px;
                margin: 0 10px;
            }
        }
    }
</style>




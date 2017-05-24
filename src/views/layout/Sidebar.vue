<template>

    <el-menu :unique-opened='true' mode="vertical" theme="dark" :default-active="$route.path">
        <div class="logo-container">
            <span class="logo">Falcon猎鹰系统</span>
        </div>
        <template v-for="item in permissionRoutes" v-if="!item.hidden">
            <el-submenu :index="item.name" v-if="!item.noDropdown">
                <template slot="title">
                    <Icon :icon-name="item.icon" :size="14"/>{{item.name}}
                </template>
                <router-link v-for="child in item.children" :key="child.path" v-if="!child.hidden" class="title-link" :to="item.path+'/'+child.path">
                    <el-menu-item :index="item.path+'/'+child.path">
                        {{child.name}}
                    </el-menu-item>
                </router-link>
            </el-submenu>
            <router-link v-if="item.noDropdown&&item.children.length>0"  :to="item.path+'/'+item.children[0].path">
                <el-menu-item :index="item.path+'/'+item.children[0].path">
                    <Icon :icon-name="item.icon" :size="14"/>{{item.children[0].name}}
                </el-menu-item>
            </router-link>
        </template>
    </el-menu>
</template>

<script>
    import permissionRoutes from 'store/permission';
    export default {
      name: 'Sidebar',
      data() {
        return {
          permissionRoutes: permissionRoutes.get()
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";

    .el-menu {
        min-height: 100%;
    }
    .icon {
        margin: 0 12px 0 1px;
    }
    .hideSidebar .title-link{
        display: inline-block;
        padding-left: 10px;
    }

</style>
<style lang="scss">
    @import "src/styles/mixin.scss";
    .el-menu-item, .el-submenu__title {
        @include flex;
        @include flex-align-center;
    }
    .logo-container {
        height: 50px;
        background: #424A57;
        color: #fff;
        width: 100%;
        @include flex;
        @include flex-justify-center;
        @include flex-align-center;
        .logo {
            overflow: hidden;
            transition: all .5s linear;
        }
    }
    .hideSidebar .logo-container .logo {
        width: 0;
        
    }
    .sidebar-wrapper:hover .logo {
        width:auto;
    }
</style>


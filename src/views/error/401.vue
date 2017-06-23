<template>
  <div class="errPage-container">
    <el-button @click="back" icon='arrow-left' class="pan-back-btn">返回</el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <h2>你没有权限去该页面</h2>
        <ul class="list-unstyled">
          <li><router-link to="/">回首页</router-link></li>
        </ul>
      </el-col>
      <el-col :span="12">
        <Icon icon-name="construction" :size="300" color="#1482f0"></Icon>
      </el-col>
    </el-row>
  </div>
</template>
<script>
    export default {
      data() {
        return {
        }
      },
      methods: {
        back() {
          this.$router.go(-1)
        }
      }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .errPage-container {
        width: 800px;
        margin: 100px auto;
        .pan-back-btn {
            background: #1482f0;
            color: #fff;
        }
        .pan-gif {
            margin: 0 auto;
            display: block;
        }
        .pan-img{
            display: block;
            margin: 0 auto;
        }
        .text-jumbo {
            font-size: 60px;
            font-weight: 700;
            color: #484848;
        }
        .list-unstyled {
            font-size: 14px;
            li {
                padding-bottom: 5px;
            }
            a {
                color: #1482f0;
                text-decoration: none;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
</style>

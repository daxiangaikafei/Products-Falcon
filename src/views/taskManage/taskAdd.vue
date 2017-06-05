<template>
  <div class="form-container">
    <el-form ref="form" :model="form" label-width="110px" class="form">
    <el-form-item label="任务名称">
      <el-input v-model="form.jobName"></el-input>
    </el-form-item>
    <el-form-item label="任务脚本名">
      <el-input v-model="form.scriptName"></el-input>
    </el-form-item>
    <el-form-item label="操作人">
      <el-input v-model="form.author"></el-input>
    </el-form-item>
    <el-form-item label="数据库仓库层级">
      <el-select v-model="form.db" placeholder="请选择">
        <el-option label="SSA" value="SSA"></el-option>
        <el-option label="SOR" value="SOR"></el-option>
        <el-option label="DPA" value="DPA"></el-option>
        <el-option label="DM" value="DM"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="依赖任务">
      <!--<el-col :span="21">-->
      <!--<el-input v-model="form.depend"></el-input>-->
      <el-select
          v-model="form.depend"
          multiple
          filterable
          remote
          placeholder="查询并选择依赖"
          :remote-method="getDepend"
          :loading="loading"
          style="width:100%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      <!--</el-col>-->
      <!--<el-col :span="1" :offset="1">
        <el-popover
          ref="popover4"
          placement="right"
          width="400"
          trigger="click">
        </el-popover>
        <el-button type="text" v-popover:popover4><Icon :icon-name="'plus-circle'" :size="18" /></el-button>
        </el-col>-->
    </el-form-item>
    <el-form-item label="所属组">
      <el-input v-model="form.group"></el-input>
    </el-form-item>
    <el-form-item label="运行周期">
      <el-select v-model="form.cycle" placeholder="请选择">
        <el-option label="每日" value="daily"></el-option>
        <el-option label="单次" value="once"></el-option>
        <el-option label="每周" value="weekly"></el-option>
        <el-option label="每月" value="monthly"></el-option>
        <el-option label="每年" value="yearly"></el-option>
        <el-option label="每小时" value="hourly"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="运行时间点">
        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" format="HH:mm" style="width: 50%;"></el-time-picker>
    </el-form-item>
    <el-form-item label="首次运行日期">
        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 50%;"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <!--<el-button type="success" >保存</el-button>-->
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button type="warning" >重置</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          id: undefined,
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          db: 'SSA',
          cycle: 'daily',
          depend: [],
          dependList: []

        },
        loading: false,
        options: [{
          value: 'HTML',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }],
        states: ["HTML","CSS","JavaScript","PHP", "Java", "Ruby",
        "Python", "NodeJS", "C","C++", "C#", "Perl","Swift", "Go", "R", "Object-C",
        "Visual Basic", "SQL", "Scala", "Lua","Dart", "Lisp","Bash"]
      
      }
    },
    mounted() {
      this.form.dependList = this.states.map(item => {
        return { value: item, label: item };
      });
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      getDepend(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.form.dependList.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "src/styles/mixin.scss";

  .form-container {
      @include flex;
      @include flex-justify;
      padding: 20px;
      .form {
        width: 500px;
      }
  }
</style>

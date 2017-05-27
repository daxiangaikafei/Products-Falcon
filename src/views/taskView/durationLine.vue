<template>
    <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>
<script>
    // 引入 ECharts 主模块
    const echarts = require('echarts/lib/echarts');

    require('echarts/lib/chart/line');
    // 引入提示框和标题组件
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    export default {
      name: 'durationLine',
      props: {
        className: {
          type: String,
          default: 'chart'
        },
        id: {
          type: String,
          default: 'chart'
        },
        width: {
          type: String,
          default: '200px'
        },
        height: {
          type: String,
          default: '200px'
        },
        options: Object
      },
      data() {
        return {
          chart: null
        };
      },
      mounted() {
        // this.initChart();
      },
      watch: {
        options: {
          handler(options) {
            if(!this.chart && options) {
              this.initChart()
            } else {
              this.chart.setOption(this.options, true)
            }
          },
          deep: true
        }
      },
      methods: {
        initChart() {
          if(this.chart) {
            return
          }
          let chart = echarts.init(document.getElementById(this.id));

          chart.setOption(this.options)
          this.chart = chart
        }
      }
    }
</script>

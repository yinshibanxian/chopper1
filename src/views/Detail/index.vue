<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <div style="font-weight: 600;cursor:pointer;" @click="handleNavigateToHome">回到首页</div>
      </div>
      <div class="header-center"></div>
      <div class="header-right">
        <div class="date">
          {{ refreshCurrenTime }}
        </div>
        <div class="filter">
          <el-select placeholder="" popper-class="filter-popper" value="24h" class="custom-select">
            <el-option value="24h">24h</el-option>
          </el-select>
        </div>
        <div class="exit-img"></div>
      </div>
    </div>
    <div class="body">
      <div class="chopper-status-wrapper">
        <div class="chopper-main-status">
          <div class="title">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}状态监测</div>
          <div class="main-status">
            <div class="main-status-item">
              <div class="status">正常</div>
              <div class="status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}是否启动</div>
            </div>
            <div class="main-status-item">
              <div class="status">正常</div>
              <div class="status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}相位控制是否达标</div>
            </div>
            <div class="main-status-item">
              <div class="status">正常</div>
              <div class="status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}电机电流报警</div>
            </div>
            <div class="main-status-item">
              <div class="status">正常</div>
              <div class="status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}振动报警</div>
            </div>
            <div class="main-status-item">
              <div class="status" style="color: red">故障</div>
              <div class="status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}超差报警</div>
            </div>
            <div class="main-status-item">
              <div class="status" style="color: #f5a623">异常</div>
              <div class="status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}其他报警</div>
            </div>
          </div>
        </div>
        <div class="chopper-sub-status">
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">26</div>
            <div class="sub-status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}设定速度</div>
          </div>
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">7722μs</div>
            <div class="sub-status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}设定相位</div>
          </div>
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">7721μs</div>
            <div class="sub-status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}实际相位</div>
          </div>
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">3.20°</div>
            <div class="sub-status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}设定TDC角度</div>
          </div>
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">100.0%</div>
            <div class="sub-status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}相位控制达标百分比</div>
          </div>
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">0.15A</div>
            <div class="sub-status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}电机电流</div>
          </div>
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">26</div>
            <div class="sub-status-desc">{{ type === 'last-node' ? '谱仪' : 'T1 斩波器' }}设定速度</div>
          </div>
        </div>
      </div>
      <div class="chopper-statistic">
        <div class="title">数据统计</div>
        <div class="charts-wrapper">
          <div class="chart-wrapper" id="chart4"></div>
          <div class="chart-wrapper" id="chart5"></div>
        </div>
      </div>
      <div class="chopper-trend-wrapper">
        <div class="title">
          <div>趋势分析</div>
          <div class="filter" v-if="type === 'last-node'">
            <el-select
              placeholder=""
              popper-class="filter-popper"
              value="斩波器1"
               class="custom-select"
            >
              <el-option value="斩波器1">斩波器1</el-option>
              <el-option value="斩波器1">斩波器2</el-option>
              <el-option value="斩波器1">斩波器3</el-option>
              <el-option value="斩波器1">斩波器4</el-option>
            </el-select>
          </div>
        </div>
      
        <!-- <el-input class="test-input" placeholder="aa" style="z-index: 10000;background: #fff;"></el-input> -->
        <div class="charts-wrapper">
          <div class="chart-wrapper" id="chart1"></div>
          <div class="chart-wrapper" id="chart2">
          </div>
          <div class="chart-wrapper" id="chart3"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  mounted() {
    const { id, type } = this.$route.query;
    this.id = id;
    this.type = type;
    this.refreshCurrentTimeTimer = setInterval(() => {
      this.currentTime = this.$dayjs();
    }, 1000);
    this.initChart("chart1");
    this.initChart("chart2");
    this.initChart("chart3");
    this.initPieChart();
    this.initBarChart();
  },
  computed: {
    refreshCurrenTime: function () {
      return this.$dayjs(this.currentTime).format("YYYY年MM月DD日 HH:mm:ss");
    },
  },
  watch: {
    max(newValue){
      
      // const updateYAxis = {
      //   type: 'value',
      //   min: 0,
      //   max: newVal
      // };
      // this.chart.setOption({
      //   yAxis: updateYAxis
      // })
    }
  },
  methods: {
    handleNavigateToHome() {
      this.$router.push({
        path: '/dashboard'
      })
    },
    initChart(id) {
      const firstChart = echarts.init(document.getElementById(id));
      // 自定义 tooltip 样式
      const option = {
        title: {
          text: "T1斩波器相位误差/°",
          textStyle: {
            fontSize: 14,
            color: "#00F2FF",
          },
        },
        tooltip: {
          trigger: "axis",
          color: "#3dc579",
        },
        legend: {
          data: ["mr_chop_pv"],
          top: 24,
          right: 0,
          icon: "rect",
          fontWeight: 400,
          textStyle: {
            color: "rgba(255, 255, 255, .65)",
          },
          axisPointer: {
            lineStyle: {
              color: "#00F2FF",
              type: "dashed",
            },
          },
          itemStyle: {
            color: "#3dc579",
          },
        },
        xAxis: {
          type: "category",
          data: ["16:00", "17:00", "18:00", "19:00", "20:00"],
          axisLine: {
            lineStyle: {
              color: "#00B7FD",
              opacity: 0.2,
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
            opacity: 0.45,
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#00B7FD",
              opacity: 0.5,
            },
          },
          axisLabel: {
            color: "#fff",
            opacity: 0.45,
          },
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            data: [10, 22, 28, 23, 19, 11, 22, 13],
            type: "line",
            smooth: true,
            name: "mr_chop_pv",
            symbol: "none",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(139, 255, 151, .7)",
                },
                {
                  offset: 1,
                  color: "transparent",
                },
              ]),
            },
            lineStyle: {
              color: "#3dc579",
            },
          },
        ],
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            start: 0,
            end: 100,
            top: '90%' // 设置滑动条的位置
          }
        ],
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
      };
      firstChart.setOption(option);
      this[id] = firstChart;
    },
    initPieChart() {
      const option = {
        title: {
          text: "斩波器状态分布",
          left: "center",
          top: "center",
        },
        series: [
          {
            type: "pie",
            data: [
              {
                value: 7,
                name: "达标",
              },
              {
                value: 2,
                name: "报警",
              },
              {
                value: 1,
                name: "故障",
              },
            ],
            radius: ["50%", "90%"],
          },
        ],
        label: {
          show: true,
          formatter: "{b}: {c}",
        },
      };
      const pieChart = echarts.init(document.getElementById("chart4"));
      pieChart.setOption(option);
    },
    initBarChart() {
      const tooltipFormatter = (params) => {
        let tooltip = `${params[0].name}<br>`;
        tooltip += `
                  <div style="width:232px;height:25px;line-height:12px;margin-top:10px;">
                    <div style="display: inline-block;width:12px;height:12px;background-color:rgba(0, 188, 255, 1);"/>
                    <div style="display: inline-block;line-height:12px;margin-left:20px;margin-bottom:10px;">
                    ${params[0].value}<br>
                    </div>
                  <div>
                  `;
        return tooltip;
      };
      const option = {
        title: {
          text: "斩波器报警次数（Top 5)",
          textStyle: {
            fontSize: 14,
            color: "#00F2FF",
          },
        },
        xAxis: {
          data: ["斩波器1", "斩波器2", "斩波器3", "斩波器4", "斩波器5"],
          axisTick: {
            show: false,
          },
        },
        tooltip: {
          trigger: 'axis',
          formatter: tooltipFormatter,
        },
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(0, 183, 253, .2)",
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#00B7FD",
              opacity: 0.5,
            },
          },
          axisLabel: {
            color: "#fff",
            opacity: 0.45,
          },
        },
        series: [
          {
            type: "bar",
            data: [23, 24, 18, 25, 27],
            barWidth: 12,
            itemStyle: {
              emphasis: {
                barBorderRadius: [10, 10, 10, 10],
              },
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 71, 255, 1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(0, 188, 255, 1)", // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
          },
        ],
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
      };
      const barChart = echarts.init(document.getElementById("chart5"));
      barChart.setOption(option);
    },
  },
  beforeDestroy() {
    this.refreshCurrentTimeTimer && clearInterval(this.refreshCurrentTimeTimer);
  },
  data() {
    return {
      currentTime: this.$dayjs(),
      refreshCurrentTimeTimer: null,
      type: "custom-node",
      id: null,
      max: 30,
      min: 0,
      chart: null,
      inputMap: {
        chart1: {
          min: 0,
          max: 30
        }
      }
    };
  },
};
</script>

<style lang="scss" scoped>
$design_width: 1920;
$design_height: 1080;

@function px2vw($px) {
  @return $px / ($design_width / 100) + vw;
}

@function px2vh($px) {
  @return $px / ($design_height / 100) + vh;
}

.container {
  .header {
    height: px2vh(88);
    display: flex;
    align-items: center;
    background: rgba(29, 67, 84, 1);
    width: 100%;
    .header-left {
      flex: 1;
      height: 100%;
      background-image: url("../../assets/svgs/detail-header-left.svg");
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: cover;
      display: flex;
      align-items: center;
      padding-left: px2vw(30);
      color: rgba(0, 242, 255, 1);
      font-weight: 400;
    }
    .header-center {
      width: 488px;
      height: 100%;
      background-image: url("../../assets/svgs/detail-header-title1.svg");
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 242, 255, 1);
      font-weight: 400;
      font-size: 36px;
    }

    .header-right {
      flex: 1;
      height: 100%;
      background-image: url("../../assets/svgs/detail-header-right.svg");
      background-repeat: no-repeat;
      background-position: 0 0;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: px2vw(27);
      color: rgba(0, 242, 255, 1);
      font-size: 14px;
      .filter {
        background-image: url("../../assets/svgs/detail-header-filter.svg");
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
        height: px2vh(30);
        width: px2vw(166);
        display: flex;
        align-items: center;
        margin-left: px2vw(24);
        padding-left: px2vw(10);
        padding-right: px2vw(10);

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .body {
    height: calc(100vh - 88px);
    width: 100%;
    background-image: url("../../assets/images/big-board-bg1.png");
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
    vertical-align: middle;
    overflow-y: hidden;
    padding: 24px;
    box-sizing: border-box;
    padding: 16px;
    overflow: scroll;
    .chopper-status-wrapper {
      width: 100%;
      .chopper-main-status {
        width: 100%;
        .title {
          font-size: 2rem;
          color: #00f2ff;
          line-height: 32px;
          font-weight: 600;
        }
        .main-status {
          margin-top: px2vh(24);
          height: px2vh(107);
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          .main-status-item {
            display: flex;
            justify-content: center;
            flex-direction: column;
            border-right: 1px solid #45c4ff;
            border-image: linear-gradient(
              180deg,
              rgba(0, 197, 255, 0.103855) 0%,
              rgba(0, 197, 255, 0.493744) 48.55%,
              rgba(0, 197, 255, 0.103969) 100%
            );
            border-image-slice: 1;
            padding-left: px2vw(34);
            flex: 1;
            &:first-of-type {
              align-items: flex-start;
              padding-left: 0;
            }

            &:last-of-type {
              border-right: none;
              flex: 1;
            }

            .status {
              color: #3dc479;
              display: flex;
              align-items: flex-end;
              font-size: px2vw(60);
              font-weight: 700;
              line-height: 81px;
            }

            .status-desc {
              line-height: 22px;
              color: #00f2ff;
              font-weight: 600;
              font-size: px2vw(25);
            }
          }
        }
      }

      .chopper-sub-status {
        margin-top: px2vh(24);
        height: px2vh(62);
        box-sizing: border-box;
        border-top: 1px solid #45c4ff;
        border-bottom: 1px solid #45c4ff;
        border-image: linear-gradient(
          270deg,
          rgba(0, 197, 255, 0.103855) 0%,
          rgba(0, 197, 255, 0.493744) 48.55%,
          rgba(0, 197, 255, 0.103969) 100%
        );
        border-image-slice: 10;
        display: flex;
        justify-content: space-between;
        &-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #45c4ff;
          border-image: linear-gradient(
            180deg,
            rgba(0, 197, 255, 0.103855) 0%,
            rgba(0, 197, 255, 0.493744) 48.55%,
            rgba(0, 197, 255, 0.103969) 100%
          );
          border-image-slice: 2;
          margin: 0 auto;
          &:last-of-type {
            border-right: none;
          }

          &:nth-of-type(2n + 1) {
            flex: 2;
          }

          &:nth-of-type(2n) {
            flex: 3;
          }

          .sub-status-num {
            line-height: 22.4px;
            font-weight: 400;
            font-size: px2vw(22);
            color: #00fefe;
          }

          &:nth-of-type(2n) {
            .sub-status-num {
              color: #f5a623;
            }
          }

          .sub-status-desc {
            line-height: 16px;
            font-weight: 400;
            font-size: px2vw(16);
            color: #fff;
          }
        }
      }
    }

    .chopper-statistic {
      margin-top: 24px;
      .title {
        font-size: 24px;
        color: #00f2ff;
        line-height: 32px;
        font-weight: 600;
      }
      .charts-wrapper {
        margin-top: 24px;
        width: 100%;
        position: relative;
        display: flex;
        .chart-wrapper {
          flex: 1;
          height: 300px;
          margin-right: 16px;
          width: 90%;
        }
      }
    }

    .chopper-trend-wrapper {
      margin-top: 24px;
      .title {
        font-size: 24px;
        color: #00f2ff;
        line-height: 32px;
        font-weight: 600;
        display: flex;
        position: relative;
        align-items: center;
        .filter {
          position: absolute;
          right: 80px;
          background-image: url("../../assets/svgs/detail-header-filter.svg");
          background-repeat: no-repeat;
          background-position: 0 0;
          background-size: 100% 100%;
          height: 30px;
          width: 166px;
          display: flex;
          align-items: center;
          margin-left: 24px;
          padding-left: 10px;
          padding-right: 10px;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .charts-wrapper {
        margin-top: 32px;
        width: 100%;
        display: flex;
        .chart-wrapper {
          flex: 1;
          height: 300px;
          margin-right: 16px;
          &:nth-of-type(3n) {
            margin-right: 0px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.custom-select {
  .el-input__inner {
  height: 30px;
  width: 166px;
  background: transparent;
  border: none;
  color: #00f2ff;
}
.el-input__suffix {
  display: none;
}
}


.filter-popper {
  border: 1px solid #00c7ff;
}

.popper__arrow {
  display: none !important;
}

.el-select-dropdown__item.selected {
  color: #00f2ff;
  background: #1d4354 !important;
}
.el-select-dropdown {
  background: #1d4354 !important;
}
</style>

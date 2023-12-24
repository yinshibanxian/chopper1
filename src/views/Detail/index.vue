<template>
  <div class="container">
    <div class="main-info">
      <div class="main-alert">
        <div class="title">MP1斩波器停止报警</div>
        <div class="info">无报警</div>
      </div>
      <div class="main-alert">
        <div class="title">MP1斩波器停止报警</div>
        <div class="info">无报警</div>
      </div>
    </div>
    <div class="sub-info">
      <div class="sub-alert">
        <div class="title">斩波器驱动故障报警</div>
        <div class="info">无报警</div>
      </div>
      <div class="sub-alert">
        <div class="title">斩波器驱动故障报警</div>
        <div class="info">无报警</div>
      </div>
      <div class="sub-alert">
        <div class="title">斩波器驱动故障报警</div>
        <div class="info">无报警</div>
      </div>
      <div class="sub-alert">
        <div class="title">斩波器驱动故障报警</div>
        <div class="info">无报警</div>
      </div>
    </div>
    <div class="chopper-charts">
      <div id="chopper-charts-container" />
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  mounted() {
    // 准备数据
    const xAxisData = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    const seriesData = [
      {
        name: "系列1",
        data: [120, 200, 150, 80, 70, 110, 130],
      },
      {
        name: "系列2",
        data: [90, 150, 120, 100, 80, 70, 60],
      },
    ];

    // 创建图表实例
    const myChart = echarts.init(
      document.getElementById("chopper-charts-container")
    );

    // 设置图表配置项
    const option = {
      grid: {
        left: 0,
        right: 0,
        top: 16,
        bottom: 10,
        containLabel: true,
        show: true,
        borderColor: "#ccc",
        borderWidth: 1,
        lineStyle: {
          color: "#ddd",
          type: "dashed",
        },
      },
      legend: {
        show: true,
        data: ["系列1", "系列2"],
        textStyle: {
          color: "#333",
        },
        bottom: -10,
        right: 10
      },
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: {
        type: "value",
      },
      series: seriesData.map(function (item) {
        return {
          name: item.name,
          type: "line",
          data: item.data,
        };
      }),
    };

    // 将配置项应用到图表中
    myChart.setOption(option);
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 8px;
  .main-info {
    width: 100%;
    display: flex;
    .main-alert {
      flex: 1;
      background: green;
      margin-right: 10px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      color: #fff;
      padding: 8px 0px 8px 0px;
      font-weight: 600;
      .title {
        font-size: 12px;
      }
      .info {
        font-size: 16px;
        margin-top: 12px;
      }
    }
  }
  .sub-info {
    width: 100%;
    display: flex;
    .sub-alert {
      margin-top: 8px;
      flex: 1;
      background: green;
      flex: 1;
      background: green;
      margin-right: 10px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      color: #fff;
      padding: 8px 0px 8px 0px;
      font-weight: 600;
      .title {
        font-size: 12px;
      }
      .info {
        font-size: 16px;
        margin-top: 12px;
      }
    }
  }
  .chopper-charts {
    width: 100%;
    padding-right: 8px;
    #chopper-charts-container {
      width: 100%;
      height: 300px;
      margin-top: 8px;
      padding-right: 8px;
    }
  }
}
</style>>
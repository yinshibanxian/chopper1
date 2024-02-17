<template>
  <div class="app-container">
    <div class="header">
      <div class="filter">
        <div>
          <el-select
            v-model="searchCondition.spect_code"
            placeholder="请选择谱仪"
          >
            <el-option
              v-for="item in spectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div style="margin-left: 12px">
          <el-select
            v-model="searchCondition.chopper_code"
            placeholder="请选择斩波器"
          >
            <el-option
              v-for="item in chopperList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div style="margin-left: 12px">
          <el-select
            v-model="searchCondition.chopper_standard_list"
            placeholder="请选择斩波器参数"
            multiple
          >
            <el-option
              v-for="item in chopperStandardList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div style="margin-left: 12px">
          <el-date-picker
            v-model="searchCondition.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="operate-btn">
        <el-button size="small" type="primary" @click="handleSearch"
          >搜索</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="handleCreateSpectBtnClick"
          >上传 h5 数据</el-button
        >
      </div>
    </div>
    <div class="empty-text-wrapper" v-show="!renderData.length && !loading">
      暂无数据
    </div>
    <div class="empty-text-wrapper" v-show="loading">数据加载中</div>
    <div style="margin-top: 16px">
      <el-switch
        v-model="split"
        active-text="分离"
        inactive-text="合并"
        inactive-color="#fff"
        @change="handleSplitChange"
      ></el-switch>
    </div>
    <div class="total-charts-wrapper" v-show="renderData.length && !split">
      <div id="totalChart" class="chart-wrapper"></div>
    </div>
    <div id="independent-charts-wrapper"></div>
    <el-dialog title="上传h5" :visible.sync="modalVisible">
      <el-form
        :model="form"
        ref="form"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="h5 文件" prop="file">
          <el-upload
            class="upload-demo"
            drag
            action="/api/algorithm/"
            v-model="form.file"
            :headers="{ authorization: `Bearer ${access}` }"
            :auto-upload="false"
            :on-change="onFileChange"
            :on-remove="onFileRemove"
            :before-upload="onBeforeUpload"
            :limit="1"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="斩波器" prop="chopper_code">
          <el-select v-model="form.chopper_code" placeholder="请选择斩波器">
            <el-option
              v-for="item in chopperList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modalVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateSpect">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateSpect, getSpectList } from "@/api/spect";
import { getChopperList } from "@/api/chopper";
import { createH5, getChopperHistoryData } from "@/api/h5Management";
import { getChopperStandardList } from "@/api/chopperStandard";
import dayjs from "dayjs";
import * as echarts from "echarts";

export default {
  data() {
    return {
      modalVisible: false,
      popoverVisible: false,
      loading: false,
      split: false,
      renderData: [],
      searchCondition: {
        spect_code: "",
        chopper_standard_list: "",
        time: "",
        chopper_code: "",
      },
      form: {
        // 谱仪代号
        algorithm_name: "",
        // 谱仪名称
        file: null,
        start_time: "",
        end_time: "",
        chopper_code: "",
        method_name: "",
      },
      spectList: [],
      chopperList: [],
      chopperStandardList: [],
      totalCount: 0,
      time: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.getSpectList();
  },
  watch: {
    "searchCondition.spect_code": {
      handler: function (newVal) {
        this.fetchChopperList();
      },
    },
    "searchCondition.chopper_code": {
      handler: function (newVal) {
        this.fetchChopperStandardList();
      },
    },
  },
  methods: {
    renderIndependentChart() {
      const independentChartWrapper = document.querySelector(
        "#independent-charts-wrapper"
      );
      this.renderData.forEach((item) => {
        const container = document.createElement("div");
        container.id = item.standardId;
        container.className = "split-chart";
        container.style.width = "40vw";
        container.style.height = "300px";
        container.style.marginBottom = "12px";
        container.style.marginRight = "12px";
        independentChartWrapper.appendChild(container);
        const xAxisData = item.data.map((_item) => _item.created_time);
        const currentStandard = this.chopperStandardList.find(
          (standard) => standard.value == item.standardId
        );
        const name = currentStandard ? currentStandard.label : item.standardId;
        const seriesData = {
          type: "line",
          data: item.data.map((_item) => _item.value),
          name,
          smooth: true,
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
        };
        const option = {
          tooltip: {
            trigger: "axis",
            color: "#3dc579",
          },
          legend: {
            show: true,
            top: 24,
            right: 0,
            icon: "rect",
            fontWeight: 400,
            textStyle: {
              color: "rgba(255, 255, 255, .65)",
            },
            itemStyle: {
            color: "#3dc579",
          },
          },
          xAxis: {
            type: "category",
            data: xAxisData,
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
          series: seriesData,
          dataZoom: [
            {
              type: "slider",
              xAxisIndex: 0,
              start: 0,
              end: 100,
              top: "93%", // 设置滑动条的位置
            },
          ],
          grid: {
            left: 0,
            right: 0,
            bottom: 0,
            containLabel: true,
          },
        };
        const chart = echarts.init(container);
        chart.setOption(option);
      });
    },
    renderTotalChart() {
      const chart = echarts.init(document.getElementById("totalChart"));
      const seriesData = this.renderData.map((item) => {
        const currentStandard = this.chopperStandardList.find(
          (standard) => standard.value == item.standardId
        );
        const name = currentStandard ? currentStandard.label : item.standardId;
        return {
          data: item.data.map((_item) => _item.value),
          type: "line",
          smooth: true,
          name: name,
        };
      });
      const xAxisData = this.renderData[0].data.map(
        (item) => item.created_time
      );
      const option = {
        tooltip: {
          trigger: "axis",
          color: "#3dc579",
        },
        legend: {
          show: true,
          top: 24,
          right: 0,
          icon: "rect",
          fontWeight: 400,
          textStyle: {
            color: "rgba(255, 255, 255, .65)",
          },
        },
        xAxis: {
          type: "category",
          data: xAxisData,
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
        series: seriesData,
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            start: 0,
            end: 100,
            top: "93%", // 设置滑动条的位置
          },
        ],
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
      };
      chart.setOption(option);
    },
    handleSplitChange() {
      if (!this.split) {
        const independentChartWrapper = document.querySelector(
          "#independent-charts-wrapper"
        );
        while (independentChartWrapper.firstChild) {
          independentChartWrapper.removeChild(
            independentChartWrapper.firstChild
          );
        }

        this.renderTotalChart();
      } else {
        this.renderIndependentChart();
      }
    },
    async handleSearch() {
      if (!this.searchCondition.spect_code) {
        return this.$message("请选择谱仪");
      }

      if (!this.searchCondition.chopper_code) {
        return this.$message("请选择斩波器");
      }

      if (!this.searchCondition.chopper_standard_list) {
        return this.$message("请选择参数");
      }

      if (!this.searchCondition.time) {
        return this.$message("请选择起始时间和结束时间");
      }

      this.loading = true;
      const res = await getChopperHistoryData({
        start_time: dayjs(this.searchCondition.time[0]).format(
          "YYYY-MM-DD hh:mm"
        ),
        end_time: dayjs(this.searchCondition.time[1]).format(
          "YYYY-MM-DD hh:mm"
        ),
        chopper_standard_id_list:
          this.searchCondition.chopper_standard_list.join(","),
      });

      const renderData = [];

      Object.keys(res.data).forEach((standardId) => {
        if (res.data[standardId].length) {
          renderData.push({
            standardId: standardId,
            data: res.data[standardId],
          });
        }
      });
      this.renderData = renderData;
      this.loading = false;
      this.renderTotalChart();
    },
    async fetchChopperStandardList() {
      const res = await getChopperStandardList({
        page: 1,
        size: 1000,
        chopper_code: this.searchCondition.chopper_code,
      });
      const list = res.data.list || [];

      this.chopperStandardList = list.map((item) => ({
        value: item.id,
        label: item.parameter_code,
      }));
    },
    async fetchChopperList() {
      const res = await getChopperList({
        page: 1,
        size: 1000,
        spect_code: this.searchCondition.spect_code,
      });
      const list = res.data.list || [];
      this.chopperList = list.map((item) => ({
        label: item.chopper_name,
        value: item.chopper_code,
      }));
    },
    async onFileChange(file, fileList) {
      this.form.file = file.raw;
    },
    onBeforeUpload(file) {
      console.log(file, "file");
    },
    onFileRemove(file, fileList) {},
    handleCreateSpectBtnClick() {
      this.modalVisible = true;
    },
    async getSpectList() {
      const res = await getSpectList({
        page: 1,
        size: 1000,
      });
      this.spectList = (res.data.list || []).map((item) => ({
        value: item.spect_code,
        label: item.spect_name,
      }));
    },
    async handleCreateH5() {
      const formData = new FormData();
      formData.append("file", this.form.file);
      formData.append("chopper_code", this.form.chopper_code);

      await createH5(formData);
      this.currentPage = 1;
      this.getSpectList();
    },
    async handleEditSpect() {
      const { id } = this.editingSpect;
      const { spect_name, spect_code } = this.form;
      await updateSpect({
        id,
        spect_code,
        spect_name,
      });
      this.getSpectList();
    },
    confirmCreateSpect() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.editingSpect) {
            await this.handleEditSpect();
          } else {
            await this.handleCreateH5();
          }
          this.modalVisible = false;
          this.editingSpect = null;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .filter {
      display: flex;
      align-items: center;
      .search-input {
        width: 200px !important;
        margin-right: 16px;
      }
    }
    .operate-btn {
    }
  }
  .empty-text-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    color: #00f2ff;
    font-weight: 600;
    font-size: 16px;
  }
  .total-charts-wrapper {
    margin-top: 16px;
    width: 100%;
    .chart-wrapper {
      width: 85vw;
      height: 500px;
    }
  }

  #independent-charts-wrapper {
    width: 86vw;
    display: flex;
    flex-wrap: wrap;
    .split-chart {
      flex: 1;
      height: 300px;
      width: 28vw;
    }
  }
}
</style>
<style lang="scss">
.custom-input {
  .el-input {
    width: 100px;
    display: inline-block;
  }
  .el-input__inner {
    width: 100px;
  }
}

.el-date-range-picker.has-sidebar {
  width: 900px;
}
</style>

<template>
  <div class="app-container">
    <div class="header">
      <div class="filter">
        <div>
          <el-select
            placeholder="请选择斩波器"
            v-model="searchCondition.chopper_code"
            clearable
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
          <el-date-picker
            v-model="searchCondition.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            clearable
          >
          </el-date-picker>
        </div>
      </div>
      <div class="operate-btn">
        <el-button
          size="small"
          type="primary"
          @click="handleCreateSpectBtnClick"
          >新建检修维护记录</el-button
        >
      </div>
    </div>
    <div class="table">
      <el-table :data="maintenanceList">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column
          prop="chopper_code"
          label="关联斩波器"
        ></el-table-column>
        <el-table-column prop="event_name" label="事件名称"></el-table-column>
        <el-table-column prop="event_type" label="事件类型"></el-table-column>
        <el-table-column
          prop="event_describe"
          label="事件描述"
        ></el-table-column>
        <el-table-column
          prop="total_online_time"
          label="累计运行时长/h"
        ></el-table-column>
        <el-table-column prop="error_type" label="故障类型"></el-table-column>
        <el-table-column prop="backup" label="备注"></el-table-column>
        <el-table-column
          prop="total_error_time"
          label="总故障机时/h"
        ></el-table-column>
        <el-table-column
          prop="total_beam_time"
          label="束流故障机时/h"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="handleEditMainTenanceBtnClick(scope.row)"
              type="text"
              size="small"
              style="margin-right: 8px"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              style="color: rgba(255, 0, 0, 0.7)"
              @click="handleDeleteSpectBtnClick(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          :total="totalCount"
          layout="prev, pager, next"
          :page-size="pageSize"
          @current-change="handleCurrentPageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :title="`${editingMaintenance ? '编辑' : '新建'}检修维护记录`"
      :visible.sync="modalVisible"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="关联斩波器" prop="chopper_code">
          <el-select
            size="small"
            v-model="form.chopper_code"
            placeholder="请选择斩波器"
          >
            <el-option
              v-for="item in chopperList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件名称" prop="event_name">
          <el-input size="small" v-model="form.event_name"></el-input>
        </el-form-item>
        <el-form-item label="事件类型" prop="event_type">
          <el-input size="small" v-model="form.event_type"></el-input>
        </el-form-item>
        <el-form-item label="事件描述" prop="event_describe">
          <el-input size="small" v-model="form.event_describe"></el-input>
        </el-form-item>
        <el-form-item label="累计运行时长/h" prop="total_online_time ">
          <el-input size="small" v-model="form.total_online_time"></el-input>
        </el-form-item>
        <el-form-item label="故障类型" prop="error_type">
          <el-input size="small" v-model="form.error_type"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="backup">
          <el-input size="small" v-model="form.backup"></el-input>
        </el-form-item>
        <el-form-item label="总故障机时/h" prop="total_error_time">
          <el-input size="small" v-model="form.total_error_time"></el-input>
        </el-form-item>
        <el-form-item label="束流故障机时/h" prop="total_beam_time ">
          <el-input size="small" v-model="form.total_beam_time"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modalVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateMainTenance"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  createSpect,
  getSpectList,
  deleteSpect,
  updateSpect,
  searchSpectById,
} from "@/api/spect";
import { getChopperList } from "@/api/chopper";
import {
  createOperationAndMaintenance,
  getOperationAndMaintenanceList,
  updateOperationAndMainTenance,
  deleteOperationAndMaintenance,
} from "@/api/operationAndMaintenance";
import dayjs from "dayjs";
export default {
  data() {
    return {
      searchText: "",
      modalVisible: false,
      popoverVisible: false,
      editingMaintenance: null,
      chopperList: [],
      searchCondition: {
        time: "",
        chopper_code: "",
      },
      form: {
        chopper_code: "",
        event_name: "",
        event_type: "",
        event_describe: "",
        total_online_time: "",
        error_type: "",
        backup: "",
        total_error_time: "",
        total_beam_time: "",
      },
      rules: {
        spect_code: [
          {
            required: true,
            message: "谱仪代号必填",
          },
        ],
        spect_name: [
          {
            required: true,
            message: "谱仪名称必填",
          },
        ],
      },
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
      currentPage: 1,
      pageSize: 15,
      maintenanceList: [],
      totalCount: 0,
      chopperList: [],
    };
  },
  mounted() {
    this.getMaintenanceList();
    this.fetchChopperList();
  },
  watch: {
    currentPage(newVal, oldVal) {
      this.getMaintenanceList();
    },
    modalVisible(newVal) {
      if (newVal) {
        this.fetchChopperList();
      }
    },
    "searchCondition.time": {
      handler: function (newVal) {
        console.log(newVal, "newVal");
        const start_time = newVal
          ? dayjs(this.searchCondition.time[0]).format("YYYY-MM-DD hh:mm")
          : null;
        const end_time = newVal
          ? dayjs(this.searchCondition.time[1]).format("YYYY-MM-DD hh:mm")
          : null;
        this.getMaintenanceList({
          start_time,
          end_time,
          chopper_code: this.searchCondition.chopper_code,
        });
      },
    },
    "searchCondition.chopper_code": {
      handler: function (newVal) {
        const start_time = this.searchCondition.time
          ? dayjs(this.searchCondition.time[0]).format("YYYY-MM-DD hh:mm")
          : null;
        const end_time = this.searchCondition.time
          ? dayjs(this.searchCondition.time[1]).format("YYYY-MM-DD hh:mm")
          : null;
        this.getMaintenanceList({
          chopper_code: newVal,
          start_time,
          end_time,
        });
      },
    },
  },
  methods: {
    async fetchChopperList() {
      const res = await getChopperList({
        page: 1,
        size: 1000,
      });
      const list = res.data.list || [];
      this.chopperList = list.map((item) => ({
        label: item.chopper_name,
        value: item.chopper_code,
      }));
    },
    async searchSpect() {
      if (this.searchText === "") {
        this.currentPage = 1;
        this.getMaintenanceList();
        return;
      }
      const res = await searchSpectById(this.searchText);
      if (res.data) {
        this.spectList = [
          {
            id: res.data.id,
            spect_code: res.data.spect_code,
            spect_name: res.data.spect_name,
          },
        ];
      }
    },
    async _deleteMaintenance(id) {
      await deleteOperationAndMaintenance({ id });
      this.$info("删除成功");
      this.getMaintenanceList();
    },
    async fetchChopperList() {
      const res = await getChopperList({ page: 1, size: 50 });
      const list = res.data.list || [];
      this.chopperList = list.map((item) => ({
        label: item.chopper_name,
        value: item.chopper_code,
      }));
    },
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
    },
    handleCreateSpectBtnClick() {
      this.modalVisible = true;
    },
    handleEditMainTenanceBtnClick(maintenance) {
      this.editingMaintenance = maintenance;
      this.form.chopper_code = maintenance.chopper_code;
      this.form.event_name = maintenance.event_name;
      this.form.event_type = maintenance.event_type;
      this.form.event_describe = maintenance.event_describe;
      this.form.total_online_time = maintenance.total_online_time;
      this.form.error_type = maintenance.error_type;
      this.form.backup = maintenance.backup;
      this.form.total_error_time = maintenance.total_error_time;
      this.form.total_beam_time = maintenance.total_beam_time;
      this.modalVisible = true;
    },
    handleDeleteSpectBtnClick(spect) {
      this.$confirm(`确定删除当前检修维护记录？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this._deleteMaintenance(spect.id);
      });
    },
    async getMaintenanceList(params) {
      const { chopper_code, start_time, end_time, page } = params || {};
      const res = await getOperationAndMaintenanceList({
        page: page || this.currentPage,
        size: this.pageSize,
        chopper_code,
        start_time,
        end_time,
      });
      this.maintenanceList = res.data.list;
      this.totalCount = res.data.count;
    },
    async handleCreateMaintenance() {
      await createOperationAndMaintenance({
        chopper_code: this.form.chopper_code,
        event_name: this.form.event_name,
        event_type: this.form.event_type,
        event_describe: this.form.event_describe,
        total_online_time: this.form.total_online_time,
        error_type: this.form.error_type,
        backup: this.form.backup,
        total_error_time: this.form.total_error_time,
        total_beam_time: this.form.total_beam_time,
      });
      this.currentPage = 1;
      this.getMaintenanceList();
    },
    async handleEditMaintenance() {
      const { id } = this.editingMaintenance;
      const {
        chopper_code,
        event_name,
        event_type,
        event_describe,
        total_online_time,
        error_type,
        backup,
        total_error_time,
        total_beam_time,
      } = this.form;
      await updateOperationAndMainTenance({
        id,
        chopper_code,
        event_name,
        event_type,
        event_describe,
        total_online_time,
        error_type,
        backup,
        total_error_time,
        total_beam_time,
      });
      this.getMaintenanceList();
    },
    confirmCreateMainTenance() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.editingMaintenance) {
            await this.handleEditMaintenance();
          } else {
            await this.handleCreateMaintenance();
          }
          this.modalVisible = false;
          this.editingMaintenance = null;
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
      .search-input {
        width: 200px !important;
        margin-right: 16px;
      }
    }
    .operate-btn {
    }
  }
  .table {
    margin-top: 16px;
    position: relative;
    .pagination-wrapper {
      position: absolute;
      right: 0;
    }
  }
}
</style>
<style lang="scss">
.el-input {
  width: 200px;
}
.el-input__inner {
  width: 200px;
}
.el-date-range-picker.has-sidebar {
  width: 1000px;
}
</style>

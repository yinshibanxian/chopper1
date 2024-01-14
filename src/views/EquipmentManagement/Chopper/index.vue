<template>
  <div class="app-container">
    <div class="header">
      <div class="filter">
        <el-input
          size="small"
          class="search-input"
          placeholder="请输入谱仪ID"
          v-model="searchText"
        />
        <el-button size="small" type="primary" @click="searchSpect"
          >搜索</el-button
        >
      </div>
      <div class="operate-btn">
        <el-button
          size="small"
          type="primary"
          @click="handleCreateChopperBtnClick"
          >新建斩波器</el-button
        >
      </div>
    </div>
    <div class="table">
      <el-table :data="chopperList">
        <el-table-column
          prop="chopper_code"
          label="斩波器代号"
        ></el-table-column>
        <el-table-column
          prop="chopper_name"
          label="斩波器名称"
        ></el-table-column>
        <el-table-column prop="is_in_service" label="是否在役">
          <template slot-scope="scope">
            {{ scope.row.is_in_service ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column prop="motor_model" label="电机型号"></el-table-column>
        <el-table-column prop="normal_color" label="斩波器正常颜色">
          <template slot-scope="scope">
            <div
              :style="`background: ${scope.row.normal_color};height:23px;width:50px;`"
            ></div>
          </template>
        </el-table-column>
        <el-table-column prop="alarm_color" label="斩波器报警颜色">
          <template slot-scope="scope">
            <div
              :style="`background: ${scope.row.alarm_color};height:23px;width:50px;`"
            ></div>
          </template>
        </el-table-column>
        <el-table-column prop="error_color" label="斩波器故障颜色">
          <template slot-scope="scope">
            <div
              :style="`background: ${scope.row.error_color};height:23px;width:50px;`"
            ></div>
          </template>
        </el-table-column>
        <el-table-column prop="spect_code" label="关联谱仪表"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="handleEditChopperBtnClick(scope.row)"
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
              @click="handleDeleteChopperBtnClick(scope.row)"
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
      :title="`${editingChopper ? '编辑' : '新建'}斩波器`"
      :visible.sync="modalVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="斩波器代号" prop="chopper_code">
          <el-input size="small" v-model="form.chopper_code"></el-input>
        </el-form-item>
        <el-form-item label="斩波器名称" prop="chopper_name">
          <el-input size="small" v-model="form.chopper_name"></el-input>other
        </el-form-item>
        <el-form-item label="是否在役" prop="is_in_service">
          <el-switch size="small" v-model="form.is_in_service"></el-switch>
        </el-form-item>
        <el-form-item label="电机型号" prop="motor_model ">
          <el-input size="small" v-model="form.motor_model"></el-input>
        </el-form-item>
        <el-form-item label="斩波器正常颜色" prop="normal_color">
          <el-color-picker
            size="small"
            v-model="form.normal_color"
          ></el-color-picker>
        </el-form-item>
        <el-form-item label="斩波器报警颜色" prop="alarm_color">
          <el-color-picker
            size="small"
            v-model="form.alarm_color"
          ></el-color-picker>
        </el-form-item>
        <el-form-item label="斩波器故障颜色" prop="error_color">
          <el-color-picker
            size="small"
            v-model="form.error_color"
          ></el-color-picker>
        </el-form-item>
        <el-form-item label="关联谱仪表" prop="spect_code">
          <el-select
            size="small"
            placeholder="请选择关联谱仪"
            v-model="form.spect_code"
          >
            <el-option
              v-for="item in spectList"
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
import {
  getSpectList,
  searchSpectById,
} from "@/api/spect";
import { getChopperList, createChopper, deleteChopper, updateChopper } from "@/api/chopper";
export default {
  data() {
    return {
      searchText: "",
      modalVisible: false,
      popoverVisible: false,
      editingChopper: null,
      form: {
        // 谱仪代号
        chopper_code: "",
        // 谱仪名称
        chopper_name: "",
        is_in_service: true,
        motor_model: "",
        normal_color: "",
        alarm_color: "",
        error_color: "",
        spect_code: "",
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
      currentPage: 1,
      pageSize: 15,
      spectList: [],
      totalCount: 0,
      chopperList: [],
    };
  },
  mounted() {
    this.getChopperList();
  },
  watch: {
    currentPage(newVal, oldVal) {
      this.getChopperList();
    },
    modalVisible(newVal, oldVal) {
      if (newVal) {
        this.fetchSpectList();
      }
    },
  },
  methods: {
    async searchSpect() {
      if (this.searchText === "") {
        this.currentPage = 1;
        this.getChopperList();
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
    async _deleteChopper(id) {
      await deleteChopper({ id });
      this.$info("删除成功");
      this.getChopperList();
    },
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
    },
    async fetchSpectList() {
      const res = await getSpectList({ page: 1, size: 50 });
      const list = res.data.list || [];
      this.spectList = list.map((item) => ({
        label: item.spect_name,
        value: item.spect_code,
      }));
    },
    handleCreateChopperBtnClick() {
      this.modalVisible = true;
    },
    handleEditChopperBtnClick(chopper) {
      this.editingChopper = chopper;
      this.form.chopper_name = chopper.chopper_name;
      this.form.chopper_code = chopper.chopper_code;
      this.form.is_in_service = chopper.is_in_service;
      this.form.motor_model = chopper.motor_model;
      this.form.normal_color = chopper.normal_color;
      this.form.alarm_color = chopper.alarm_color;
      this.form.error_color = chopper.error_color;
      this.form.spect_code = chopper.spect_code;
      this.modalVisible = true;
    },
    handleDeleteChopperBtnClick(chopper) {
      this.$confirm(`确定删除${chopper.chopper_name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this._deleteChopper(chopper.id);
      });
    },
    async getChopperList() {
      const res = await getChopperList({
        page: this.currentPage,
        size: this.pageSize,
      });
      this.chopperList = res.data.list;
      this.totalCount = res.data.count;
    },
    async handleCreateSpect() {
      await createChopper({
        chopper_code: this.form.chopper_code,
        chopper_name: this.form.chopper_name,
        is_in_service: this.form.is_in_service,
        motor_model: this.form.motor_model,
        normal_color: this.form.normal_color,
        alarm_color: this.form.alarm_color,
        error_color: this.form.error_color,
        spect_code: this.form.spect_code,
      });
      this.currentPage = 1;
      this.getChopperList();
    },
    async handleEditChopper() {
      const { id } = this.editingChopper;
      const {
        chopper_name,
        chopper_code,
        is_in_service,
        motor_model,
        normal_color,
        alarm_color,
        error_color,
        spect_code,
      } = this.form;
      console.log(this.form, 'form>>>');
      await updateChopper({
        id,
        chopper_name,
        chopper_code,
        is_in_service,
        motor_model,
        normal_color,
        alarm_color,
        error_color,
        spect_code,
      });
      this.getChopperList();
    },
    confirmCreateSpect() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.editingChopper) {
            await this.handleEditChopper();
          } else {
            await this.handleCreateSpect();
          }
          this.modalVisible = false;
          this.editingChopper = null;
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
</style>

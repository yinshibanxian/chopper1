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
          >新建巡检记录</el-button
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
        <el-form-item label="关联斩波器" prop="chopper_code">
          <el-select size="small" v-model="form.chopper_code">
            <el-option
              v-for="item in chopperList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运行转速" prop="running_speed">
          <el-input size="small" v-model="form.running_speed"></el-input>
        </el-form-item>
        <el-form-item label="温度" prop="running_temp">
          <el-input size="small" v-model="form.running_temp"></el-input>
        </el-form-item>
        <el-form-item label="振动" prop="running_vibration">
          <el-input size="small" v-model="form.running_vibration"></el-input>
        </el-form-item>
        <el-form-item label="Veto率" prop="running_veto_rate">
          <el-input size="small" v-model="form.running_veto_rate"></el-input>
        </el-form-item>
        <el-form-item label="周运行时长" prop="running_time_week">
          <el-input size="small" v-model="form.running_time_week"></el-input>
        </el-form-item>
        <el-form-item label="其他" prop="running_other">
          <el-input size="small" v-model="form.running_other"></el-input>
        </el-form-item>
        <el-form-item label="工作氛围条件" prop="working_condition">
          <el-input size="small" v-model="form.working_condition"></el-input>
        </el-form-item>
        <el-form-item label="工作氛围状态" prop="working_status">
          <el-input size="small" v-model="form.working_status"></el-input>
        </el-form-item>
        <el-form-item label="工作氛围其他" prop="working_other">
          <el-input size="small" v-model="form.working_other"></el-input>
        </el-form-item>
        <el-form-item label="冷却温度" prop="cool_temp">
          <el-input size="small" v-model="form.cool_temp"></el-input>
        </el-form-item>
        <el-form-item label="冷却压力" prop="cool_heat">
          <el-input size="small" v-model="form.cool_heat"></el-input>
        </el-form-item>
        <el-form-item label="冷却流量" prop="cool_flux">
          <el-input size="small" v-model="form.cool_flux"></el-input>
        </el-form-item>
        <el-form-item label="冷却水位" prop="cool_water_level">
          <el-input size="small" v-model="form.cool_water_level"></el-input>
        </el-form-item>
        <el-form-item label="冷却其他参数" prop="cool_other">
          <el-input size="small" v-model="form.cool_other"></el-input>
        </el-form-item>
        <el-form-item label="控制柜电气状态" prop="electrical_control_cabinet">
          <el-input
            size="small"
            v-model="form.electrical_control_cabinet"
          ></el-input>
        </el-form-item>
        <el-form-item label="控制柜电气状态" prop="electrical_vacuum_pump">
          <el-input
            size="small"
            v-model="form.electrical_vacuum_pump"
          ></el-input>
        </el-form-item>
        <el-form-item label="冷水机电气状态" prop="electrical_chiller">
          <el-input size="small" v-model="form.electrical_chiller"></el-input>
        </el-form-item>
        <el-form-item label="故障记录" prop="error_record">
          <el-input size="small" v-model="form.error_record"></el-input>
        </el-form-item>
        <el-form-item label="other" prop="其他">
          <el-input size="small" v-model="form.other"></el-input>
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
import { getSpectList, searchSpectById } from "@/api/spect";
import { getChopperList } from "@/api/chopper";
import { createInspectRecord } from "@/api/inspectRecord";
export default {
  data() {
    return {
      searchText: "",
      modalVisible: false,
      popoverVisible: false,
      editingChopper: null,
      form: {
        // 斩波器代号
        chopper_code: "",
        running_speed: "",
        running_temp: "",
        running_vibration: "",
        running_veto_rate: "",
        running_time_week: "",
        running_other: "",
        working_condition: "",
        working_status: "",
        cool_temp: "",
        cool_heat: "",
        cool_flux: "",
        cool_water_level: "",
        cool_other: "",
        electrical_control_cabinet: "",
        electrical_vacuum_pump: "",
        electrical_chiller: "",
        error_record: "",
        other: "",
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
        this.fetchChopperList();
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
    async fetchChopperList() {
      const res = await getChopperList({ page: 1, size: 50 });
      const list = res.data.list || [];
      this.chopperList = list.map((item) => ({
        label: item.chopper_name,
        value: item.chopper_code,
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
    async handleCreateInspectRecord() {
      await createInspectRecord({
        chopper_code: this.form.chopper_code,
        running_speed: this.form.running_speed,
        running_temp: this.form.running_temp,
        running_vibration: this.form.running_vibration,
        running_veto_rate: this.form.running_veto_rate,
        running_time_week: this.form.running_time_week,
        running_other: this.form.running_other,
        working_condition: this.form.working_condition,
        working_status: this.form.working_status,
        working_other: this.form.working_other,
        cool_temp: this.form.cool_temp,
        cool_heat: this.form.cool_heat,
        cool_flux: this.form.cool_flux,
        cool_water_level: this.form.cool_water_level,
        cool_other: this.form.cool_other,
        electrical_control_cabinet: this.form.electrical_control_cabinet,
        electrical_vacuum_pump: this.form.electrical_vacuum_pump,
        electrical_chiller: this.form.electrical_chiller,
        error_record: this.form.error_record,
        other: this.form.other,
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
            await this.handleCreateInspectRecord();
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

.el-form-item {
  display: inline-block;
  .el-form-item__label {
    width: 120px;
  }
}
</style>

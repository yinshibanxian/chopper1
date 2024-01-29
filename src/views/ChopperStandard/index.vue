<template>
  <div class="app-container">
    <div class="header">
      <!-- <div class="filter">
        <el-input
          size="small"
          class="search-input"
          placeholder="请输入谱仪ID"
          v-model="searchText"
        />
        <el-button size="small" type="primary" @click="searchSpect"
          >搜索</el-button
        >
      </div> -->
      <div></div>
      <div class="operate-btn">
        <el-button
          size="small"
          type="primary"
          @click="handleCreateChopperParameterBtnClick"
          >新建斩波器参数</el-button
        >
      </div>
    </div>
    <div class="table">
      <el-table :data="spectList">
        <el-table-column prop="is_show" label="是否展示在首页">
          <template slot-scope="scope">
            {{ scope.row.is_show ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column prop="show_type" label="展示形式"></el-table-column>
        <el-table-column prop="standard" label="标准参考值"></el-table-column>
        <el-table-column
          prop="chopper_code"
          label="关联斩波器"
        ></el-table-column>
        <el-table-column
          prop="parameter_code"
          label="参数编码"
        ></el-table-column>

        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="handleEditSpectBtnClick(scope.row)"
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
      :title="`${editingSpect ? '编辑' : '新建'}斩波器参数`"
      :visible.sync="modalVisible"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="是否展示在首页" prop="is_show">
          <el-switch size="small" v-model="form.is_show"></el-switch>
        </el-form-item>
        <el-form-item label="展示形式" prop="show_type">
          <el-select size="small" v-model="form.show_type">
            <el-option
              v-for="item in showTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标准参考值" prop="standard">
          <el-input size="small" v-model="form.standard"></el-input>
        </el-form-item>
        <el-form-item label="关联斩波器表" prop="chopper_code">
          <el-select size="small" v-model="form.chopper_code">
            <el-option
              v-for="item in chopperList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数编码" prop="parameter_code">
          <el-select size="small" v-model="form.parameter_code">
            <el-option
              v-for="item in parameterList"
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
import { deleteSpect, searchSpectById } from "@/api/spect";
import { getChopperList } from "@/api/chopper";
import { getStandardList } from "@/api/standarManagement";
import {
  createChopperStandard,
  getChopperStandardList,
  updateChopperStandard,
} from "@/api/chopperStandard";
export default {
  data() {
    return {
      searchText: "",
      modalVisible: false,
      popoverVisible: false,
      editingSpect: null,
      form: {
        is_show: false,
        show_type: "",
        standard: "",
        chopper_code: "",
        parameter_code: "",
      },
      showTypeOptions: [
        {
          label: "数值",
          value: "NUM",
        },
        {
          label: "图表",
          value: "CHART",
        },
        {
          label: "状态",
          value: "STATE",
        },
      ],
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
      chopperList: [],
      parameterList: [],
      totalCount: 0,
    };
  },
  mounted() {
    this.getChopperStandardList();
  },
  watch: {
    currentPage(newVal, oldVal) {
      this.getChopperStandardList();
    },
    modalVisible(newVal) {
      if (newVal) {
        this.fetchChopperList();
        this.fetchParameterList();
      }
    },
  },
  methods: {
    async fetchParameterList() {
      const res = await getStandardList({ page: 1, size: 100 });
      const list = res.data.list || [];
      this.parameterList = list.map((item) => ({
        label: item.parameter_name,
        value: item.parameter_code,
      }));
    },
    async fetchChopperList() {
      const res = await getChopperList({ page: 1, size: 100 });
      const list = res.data.list || [];
      this.chopperList = list.map((item) => ({
        label: item.chopper_name,
        value: item.chopper_code,
      }));
    },
    async searchSpect() {
      if (this.searchText === "") {
        this.currentPage = 1;
        this.getChopperStandardList();
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
    async _deleteSpect(id) {
      await deleteSpect({ id });
      this.$info("删除成功");
      this.getChopperStandardList();
    },
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
    },
    handleCreateChopperParameterBtnClick() {
      this.modalVisible = true;
    },
    handleEditSpectBtnClick(chopperParameter) {
      this.editingSpect = chopperParameter;
      this.form.is_show = chopperParameter.is_show;
      this.form.show_type = chopperParameter.show_type;
      this.form.standard = chopperParameter.standard;
      this.form.chopper_code = chopperParameter.chopper_code;
      this.form.parameter_code = chopperParameter.parameter_code;

      this.modalVisible = true;
    },
    handleDeleteSpectBtnClick(spect) {
      this.$confirm(`确定删除${spect.spect_name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this._deleteSpect(spect.id);
      });
    },
    async getChopperStandardList() {
      const res = await getChopperStandardList({
        page: this.currentPage,
        size: this.pageSize,
      });
      this.spectList = res.data.list;
      this.totalCount = res.data.count;
    },
    async handleCreateChopperParameter() {
      await createChopperStandard({
        is_show: this.form.is_show,
        show_type: this.form.show_type,
        standard: this.form.standard,
        chopper_code: this.form.chopper_code,
        parameter_code: this.form.parameter_code,
      });
      this.currentPage = 1;
      this.getChopperStandardList();
    },
    async handleEditSpect() {
      const { id } = this.editingSpect;
      const { spect_name, spect_code } = this.form;
      await updateChopperStandard({
        id,
        spect_code,
        spect_name,
      });
      this.getChopperStandardList();
    },
    confirmCreateSpect() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.editingSpect) {
            await this.handleEditSpect();
          } else {
            await this.handleCreateChopperParameter();
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

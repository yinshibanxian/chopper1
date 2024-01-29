<template>
  <div class="app-container">
    <div class="header">
      <div class="filter">
        <!-- <el-input
            size="small"
            class="search-input"
            placeholder="请输入谱仪ID"
            v-model="searchText"
          />
          <el-button size="small" type="primary" @click="searchSpect"
            >搜索</el-button
          > -->
      </div>
      <div class="operate-btn">
        <el-button
          size="small"
          type="primary"
          @click="handleCreateSpectBtnClick"
          >新建算法</el-button
        >
      </div>
    </div>
    <div class="table">
      <el-table :data="algorithmList">
        <el-table-column
          prop="algorithm_name"
          label="算法名称"
        ></el-table-column>
        <el-table-column prop="start_time" label="开始时间"></el-table-column>
        <el-table-column prop="end_time" label="结束时间"></el-table-column>
        <el-table-column
          prop="chopper_standard"
          label="斩波器参数"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <!-- <el-button
              @click.native.prevent="handleEditSpectBtnClick(scope.row)"
              type="text"
              size="small"
              style="margin-right: 8px"
            >
              编辑
            </el-button> -->
            <el-button type="text" size="small" @click="handleRun(scope.row)">
              运行
            </el-button>
            <el-button type="text" size="small" @click="handleRun(scope.row)">
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
      :title="`${editingSpect ? '编辑' : '新建'}算法`"
      :visible.sync="modalVisible"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="算法名称" prop="algorithm_name ">
          <el-input
            size="small"
            v-model="form.algorithm_name"
            class="custom-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="算法文件" prop="file">
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
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="斩波器参数" prop="chopper_standard">
          <el-select v-model="form.chopper_standard" placeholder="斩波器参数">
            <el-option
              v-for="item in chopperStandardList"
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
import { deleteSpect, updateSpect, searchSpectById } from "@/api/spect";
import { createAlgorithm, getAlgorithmList } from "@/api/algorithm";
import { getChopperStandardList } from "@/api/chopperStandard";
import dayjs from "dayjs";

export default {
  data() {
    return {
      searchText: "",
      modalVisible: false,
      popoverVisible: false,
      editingSpect: null,
      form: {
        // 谱仪代号
        algorithm_name: "",
        // 谱仪名称
        file: null,
        start_time: "",
        end_time: "",
        chopper_standard: "",
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
      algorithmList: [],
      spectList: [],
      chopperStandardList: [],
      totalCount: 0,
    };
  },
  mounted() {
    this.getSpectList();
  },
  watch: {
    currentPage(newVal, oldVal) {
      this.getSpectList();
    },
    modalVisible(newVal) {
      if (newVal) {
        this.fetchChopperStandardList();
      }
    },
  },
  methods: {
    handleRun() {
      console.log(this, "this", this.$info);
      this.$message("算法文件开始运行，运行结束会进行通知，或者在算法日志查看");
    },
    async fetchChopperStandardList() {
      const res = await getChopperStandardList({ page: 1, size: 1000 });
      const list = res.data.list || [];
      this.chopperStandardList = list.map((item) => ({
        label: item.parameter_code,
        value: item.id,
      }));
    },
    async onFileChange(file, fileList) {
      console.log(file, "file");
      this.form.file = file.raw;
    },
    onBeforeUpload(file) {
      console.log(file, "file");
    },
    onFileRemove(file, fileList) {},
    async searchSpect() {
      if (this.searchText === "") {
        this.currentPage = 1;
        this.getSpectList();
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
      this.getSpectList();
    },
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
    },
    handleCreateSpectBtnClick() {
      this.modalVisible = true;
    },
    handleEditSpectBtnClick(spect) {
      this.editingSpect = spect;
      this.form.spect_name = spect.spect_name;
      this.form.spect_code = spect.spect_code;
      this.modalVisible = true;
    },
    handleDeleteSpectBtnClick(spect) {
      this.$confirm(`确定删除${spect.algorithm_name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this._deleteSpect(spect.id);
      });
    },
    async getSpectList() {
      const res = await getAlgorithmList({
        page: this.currentPage,
        size: this.pageSize,
      });
      console.log(res, "res>>>");
      this.algorithmList = res.data.list;
      this.totalCount = res.data.count;
    },
    async handleCreateSpect() {
      const formData = new FormData();
      console.log("file>>>", this.form.file);
      formData.append("algorithm_name", this.form.algorithm_name);
      formData.append("file", this.form.file);
      formData.append(
        "start_time",
        dayjs(this.form.start_time).format("YYYY-MM-DD hh:mm")
      );
      formData.append(
        "end_time",
        dayjs(this.form.start_time).format("YYYY-MM-DD hh:mm")
      );
      formData.append("chopper_standard", this.form.chopper_standard);

      await createAlgorithm(formData);
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
            await this.handleCreateSpect();
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
.custom-input {
  .el-input {
    width: 100px;
    display: inline-block;
  }
  .el-input__inner {
    width: 100px;
  }
}
</style>

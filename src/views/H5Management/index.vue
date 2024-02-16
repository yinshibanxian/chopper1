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
        <div style="margin-left: 12px;">
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
       <el-button
          size="small"
          type="primary"
          @click="handleSearch"
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
    <div class="table">
    </div>
    <el-dialog title="上传h5" :visible.sync="modalVisible">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
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
import { deleteSpect, updateSpect, searchSpectById, getSpectList } from "@/api/spect";
import { createAlgorithm, getAlgorithmList } from "@/api/algorithm";
import { getChopperList } from "@/api/chopper";
import { createH5, getChopperHistoryData } from "@/api/h5Management";
import { getChopperStandardList } from '@/api/chopperStandard';
import dayjs from "dayjs";

export default {
  data() {
    return {
      searchText: "",
      modalVisible: false,
      popoverVisible: false,
      editingSpect: null,
      searchCondition: {
        spect_code: '',
        chopper_standard_list: "",
        time: "",
        chopper_code: ''
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
      }
    },
     "searchCondition.chopper_code": {
        handler: function(newVal) {
          this.fetchChopperStandardList();
        }
     }
  },
  methods: {
    async handleSearch() {
      console.log(this.searchCondition, 'sss');
      const res = await getChopperHistoryData({
        start_time: dayjs(this.searchCondition.time[0]).format('YYYY-MM-DD hh:mm'),
        end_time: dayjs(this.searchCondition.time[1]).format('YYYY-MM-DD hh:mm'),
        chopper_standard_id_list: this.searchCondition.chopper_standard_list.join(',')
      });
      console.log(res, 'res');
    },
    handleRun() {
      this.$message("算法文件开始运行，运行结束会进行通知，或者在算法日志查看");
    },
    async fetchChopperStandardList() {
      const res = await getChopperStandardList({ page: 1, size: 1000, chopper_code: this.searchCondition.chopper_code });
      const list = res.data.list || [];
      console.log(list, 'list');

      this.chopperStandardList = list.map(item => ({
        value: item.id,
        label: item.parameter_code
      }))
    },
    async fetchChopperList() {
      const res = await getChopperList({ page: 1, size: 1000, spect_code: this.searchCondition.spect_code });
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
      this.spectList = (res.data.list || []).map(item => ({
        value: item.spect_code,
        label: item.spect_name
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

.el-date-range-picker.has-sidebar {
  width: 900px;
}
</style>

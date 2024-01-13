<template>
  <div class="app-container">
    <div class="header">
      <div class="filter">
        <el-input
          size="small"
          class="search-input"
          placeholder="请输入谱仪ID"
        />
        <el-button size="small" type="primary">搜索</el-button>
      </div>
      <div class="operate-btn">
        <el-button
          size="small"
          type="primary"
          @click="handleCreateSpectBtnClick"
          >新建谱仪</el-button
        >
      </div>
    </div>
    <div class="table">
      <el-table :data="spectList">
        <el-table-column prop="spect_code" label="谱仪代号"></el-table-column>
        <el-table-column prop="spect_name" label="谱仪名称"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editSpect(scope.$index, spectList)"
              type="text"
              size="small"
              style="margin-right: 8px;"
            >
              编辑
            </el-button>
           <el-popconfirm
              :title="`确定删除${scope.row.spect_name}`"
              @confirm="alert('abc')"
            >
            <el-button
              slot="reference"
              type="text"
              size="small"
              style="color: rgba(255, 0, 0, 0.7);"
            >
              删除
            </el-button>
           </el-popconfirm>
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
    <el-dialog title="新建谱仪" :visible.sync="modalVisible">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="谱仪代号" prop="spect_code">
          <el-input size="small" v-model="form.spect_code"></el-input>
        </el-form-item>
        <el-form-item label="谱仪名称" prop="spect_name">
          <el-input size="small" v-model="form.spect_name"></el-input>
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
import { createSpect, getSpectList } from "@/api/spect";
export default {
  data() {
    return {
      modalVisible: false,
      form: {
        // 谱仪代号
        spect_code: "",
        // 谱仪名称
        spect_name: "",
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
    };
  },
  mounted() {
    this.getSpectList();
  },
  watch: {
    currentPage(newVal, oldVal) {
      this.getSpectList();
    },
  },
  methods: {
    editSpect(index, rows) {

    },
    deleteSpect(index, rows) {
      console.log(index, rows, 'rows');
    },
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
    },
    handleCreateSpectBtnClick() {
      this.modalVisible = true;
    },
    async getSpectList() {
      const res = await getSpectList({
        page: this.currentPage,
        size: this.pageSize,
      });
      this.spectList = res.data.list;
      this.totalCount = res.data.count;
    },
    async handleCreateSpect() {
      const res = await createSpect({
        spect_code: this.form.spect_code,
        spect_name: this.form.spect_name,
      });
      if (res.code === 201) {
        this.currentPage = 1;
        this.getSpectList();
      }
    },
    confirmCreateSpect() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await this.handleCreateSpect();
          this.modalVisible = false;
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

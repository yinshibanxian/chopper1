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
            @click="handleCreateStandardBtnClick"
            >新建谱仪</el-button
          >
        </div>
      </div>
      <div class="table">
        <el-table :data="standardList" class="parameter-table">
          <el-table-column prop="parameter_code" label="参数编码"></el-table-column>
          <el-table-column prop="parameter_name" label="参数名称"></el-table-column>
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
        :title="`${editingStandard ? '编辑' : '新建'}谱仪`"
        :visible.sync="modalVisible"
      >
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item label="参数编码" prop="parameter_code">
            <el-input size="small" v-model="form.parameter_code"></el-input>
          </el-form-item>
          <el-form-item label="参数名称" prop="parameter_name">
            <el-input size="small" v-model="form.parameter_name"></el-input>
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
    searchSpectById,
  } from "@/api/spect";
  import { getStandardList, createStandard, updateStandard, deleteStandard } from '@/api/standarManagement';
  export default {
    data() {
      return {
        searchText: "",
        modalVisible: false,
        popoverVisible: false,
        editingStandard: null,
        form: {
          parameter_code: "",
          parameter_name: "",
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
        standardList: [],
        totalCount: 0,
      };
    },
    mounted() {
      this.getStandardList();
    },
    watch: {
      currentPage(newVal, oldVal) {
        this.getStandardList();
      },
    },
    methods: {
      async searchSpect() {
        if (this.searchText === "") {
          this.currentPage = 1;
          this.getStandardList();
          return;
        }
        const res = await searchSpectById(this.searchText);
        if (res.data) {
          this.standardList = [
            {
              id: res.data.id,
              spect_code: res.data.spect_code,
              spect_name: res.data.spect_name,
            },
          ];
        }
      },
      async _deleteStandard(id) {
        await deleteStandard({ id });
        this.$info("删除成功");
        this.getStandardList();
      },
      handleCurrentPageChange(currentPage) {
        this.currentPage = currentPage;
      },
      handleCreateStandardBtnClick() {
        this.modalVisible = true;
      },
      handleEditSpectBtnClick(standard) {
        this.editingStandard = standard;
        this.form.parameter_code = standard.parameter_code;
        this.form.parameter_name = standard.parameter_name;
        this.modalVisible = true;
      },
      handleDeleteSpectBtnClick(standard) {
        this.$confirm(`确定删除${standard.parameter_name}？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        }).then(() => {
          this._deleteStandard(standard.id);
        });
      },
      async getStandardList() {
        const res = await getStandardList({
          page: this.currentPage,
          size: this.pageSize,
        });
        this.standardList = res.data.list;
        this.totalCount = res.data.count;
      },
      async handleCreateStandard() {
        await createStandard({
          parameter_code: this.form.parameter_code,
          parameter_name: this.form.parameter_name,
        });
        this.currentPage = 1;
        this.getStandardList();
      },
      async handleEditStandard() {
        const { id } = this.editingStandard;
        const { parameter_code, parameter_name } = this.form;
        await updateStandard({
          id,
          parameter_code,
          parameter_name,
        });
        this.getStandardList();
      },
      confirmCreateSpect() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            if (this.editingStandard) {
              await this.handleEditStandard();
            } else {
              await this.handleCreateStandard();
            }
            this.modalVisible = false;
            this.editingStandard = null;
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
  .parameter-table {
    td {
      background: rgba(29, 67, 84, 1);
      border-bottom: none;
      color: #fff;
    }
    th {
      background: rgba(29, 67, 84, 1);
      border-bottom: none;
      color: #fff;
    }
    border: none;
    
  }
  .el-pagination {
    .btn-prev {
      background: transparent !important;
    }
    .el-pager {
      background: transparent !important;
      .number {
        background: transparent;
      }
      .btn-next {
        background: transparent !important;
      }
     
    }

  }
  .el-pagination button:disabled {
      color: #C0C4CC;
      background-color: transparent !important;
      cursor: not-allowed;
    }
  </style>
  
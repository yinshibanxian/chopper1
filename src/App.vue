<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
<style lang="scss">
.el-table {
  tr {
    background: rgba(29, 67, 84, 1) !important;
  }
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
.el-table__body tr.hover-row>td {
  background: none !important;
}
.el-table__empty-block {
  background: rgba(29, 67, 84, 1);
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

.el-pagination .btn-next {
    background: transparent;
  }
.el-dialog {
  background: rgba(29, 67, 84, 1);
}
.el-dialog__header {
  border-bottom: 1px solid #fff;
  .el-dialog__title {
    color: #fff !important;
    font-weight: 600;
  }

}
.el-pagination button:disabled {
  color: #c0c4cc;
  background-color: transparent !important;
  cursor: not-allowed;
}

.el-select-dropdown__item.selected {
  color: #00f2ff;
  background: #1d4354 !important;
}
.el-select-dropdown {
  background: #1d4354 !important;
}

.el-message-box {
  background: rgba(29, 67, 84, 1);
  .el-message-box__title {
    color: #fff;
  }
  .el-message-box__content {
    color: #fff;
  }
}

.el-form-item__label {
  color: #fff;
}
</style>

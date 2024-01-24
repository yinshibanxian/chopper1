<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
.el-table {
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
  .el-pagination button:disabled {
      color: #C0C4CC;
      background-color: transparent !important;
      cursor: not-allowed;
    }
</style>

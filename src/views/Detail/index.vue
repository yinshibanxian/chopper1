<template>
  <div class="container">
    <div class="header">
      <div class="header-left"></div>
      <div class="header-center"></div>
      <div class="header-right">
        <div class="date"></div>
        <div class="filter"></div>
        <div class="exit-img"></div>
      </div>
    </div>
    <div class="body"></div>
  </div>
</template> 

<script>
export default {
  mounted() {
    
  },
};
</script>

<style lang="scss" scoped>
$design_width: 1920;
$design_height: 1080;

@function px2vw($px) {
  @return $px / ($design_width / 100) + vw;
}

@function px2vh($px) {
  @return $px / ($design_height / 100 ) + vh;
}
.container {
  .header {
    height: 88px;
    display: flex;
    align-items: center;
    background: rgba(29, 67, 84, 1);
    width: 100%;
    .header-left {
      flex: 1;
      height: 100%;
      background-image: url("../../assets/svgs/detail-header-left.svg");
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: cover;
      display: flex;
      align-items: center;
      padding-left: px2vw(30);
      color: rgba(0, 242, 255, 1);
      font-weight: 400;
    }
    .header-center {
      width: 488px;
      height: 100%;
      background-image: url("../../assets/svgs/detail-header-title.svg");
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 242, 255, 1);
      font-weight: 400;
      font-size: 36px;
    }

    .header-right {
      flex: 1;
      height: 100%;
      background-image: url("../../assets/svgs/detail-header-right.svg");
      background-repeat: no-repeat;
      background-position: 0 0;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: px2vw(27);
      color: rgba(0, 242, 255, 1);
      font-size: 14px;
    }
  }

  .body {
    height: calc(100vh - 88px);
    width: 100%;
    background-image: url("../../assets/images/big-board-bg1.png");
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
    vertical-align: middle;
    overflow-y: hidden;
    padding: 24px;
    display: flex;
    box-sizing: border-box;
  }
}
</style>>
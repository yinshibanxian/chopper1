<template>
  <div class="container">
    <div class="header">
      <div class="header-left"></div>
      <div class="header-center"></div>
      <div class="header-right">
        <div class="date">
          {{ refreshCurrenTime }}
        </div>
        <div class="filter">
          <el-select placeholder="" popper-class="filter-popper">
            <el-option value="24h">24h</el-option>
          </el-select>
        </div>
        <div class="exit-img"></div>
      </div>
    </div>
    <div class="body">
      <div class="chopper-status-wrapper">
        <div class="chopper-main-status">
          <div class="title">T1 斩波器状态监测</div>
          <div class="main-status">
            <div class="main-status-item">
              <div class="status">正常</div>
              <div class="status-desc">T1斩波器是否启动</div>
            </div>
            <div class="main-status-item">
              <div class="status">达标</div>
              <div class="status-desc">T1斩波器相位控制是否达标</div>
            </div>
            <div class="main-status-item">
              <div class="status">正常</div>
              <div class="status-desc">T1斩波器电机电流报警</div>
            </div>
            <div class="main-status-item">
              <div class="status">正常</div>
              <div class="status-desc">T1斩波器振动报警</div>
            </div>
            <div class="main-status-item">
              <div class="status">正常</div>
              <div class="status-desc">T1斩波器超差报警</div>
            </div>
          </div>
        </div>
        <div class="chopper-sub-status">
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">26</div>
            <div class="sub-status-desc">T1斩波器设定速度</div>
          </div>
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">7722μs</div>
            <div class="sub-status-desc">T1斩波器设定相位</div>
          </div>
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">7721μs</div>
            <div class="sub-status-desc">T1斩波器实际相位</div>
          </div>
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">3.20°</div>
            <div class="sub-status-desc">T1斩波器设定TDC角度</div>
          </div>
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">100.0%</div>
            <div class="sub-status-desc">T1斩波器相位控制达标百分比</div>
          </div>
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">0.15A</div>
            <div class="sub-status-desc">T1斩波器电机电流</div>
          </div>
          <div class="chopper-sub-status-item">
            <div class="sub-status-num">26</div>
            <div class="sub-status-desc">T1斩波器设定速度</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 

<script>
export default {
  mounted() {
    this.refreshCurrentTimeTimer = setInterval(() => {
      this.currentTime = this.$dayjs();
    }, 1000);
  },
  computed: {
    refreshCurrenTime: function () {
      return this.$dayjs(this.currentTime).format("YYYY年MM月DD日 HH:mm:ss");
    },
  },
  beforeDestroy() {
    this.refreshCurrentTimeTimer && clearInterval(this.refreshCurrentTimeTimer);
  },
  data() {
    return {
      currentTime: this.$dayjs(),
      refreshCurrentTimeTimer: null,
    };
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
  @return $px / ($design_height / 100) + vh;
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
      background-image: url("../../assets/svgs/detail-header-title1.svg");
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
      .filter {
        background-image: url("../../assets/svgs/detail-header-filter.svg");
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
        height: 30px;
        width: 166px;
        display: flex;
        align-items: center;
        margin-left: 24px;
        padding-left: 10px;
        padding-right: 10px;

        &:hover {
          cursor: pointer;
        }
      }
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
    padding: 16px;
    .chopper-status-wrapper {
      width: 100%;
      .chopper-main-status {
        width: 100%;
        .title {
          font-size: 24px;
          color: #00f2ff;
          line-height: 32px;
          font-weight: 600;
        }
        .main-status {
          margin-top: 32px;
          height: 107px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          .main-status-item {
            display: flex;
            justify-content: center;
            flex-direction: column;
            border-right: 1px solid #45c4ff;
            border-image: linear-gradient(
              180deg,
              rgba(0, 197, 255, 0.103855) 0%,
              rgba(0, 197, 255, 0.493744) 48.55%,
              rgba(0, 197, 255, 0.103969) 100%
            );
            border-image-slice: 1;
            padding-left: px2vw(34);
            flex: 1;
            &:first-of-type {
              align-items: flex-start;
              padding-left: 0;
            }

            &:last-of-type {
              border-right: none;
              flex: 1;
            }

            .status {
              color: #f5a623;
              display: flex;
              align-items: flex-end;
              font-size: 70px;
              font-weight: 700;
              line-height: 81px;
            }

            .status-desc {
              line-height: 22px;
              color: #00f2ff;
              font-weight: 600;
            }
          }
        }
      }

      .chopper-sub-status {
        margin-top: 32px;
        height: 62px;
        box-sizing: border-box;
        border-top: 1px solid #45c4ff;
        border-bottom: 1px solid #45c4ff;
        border-image: linear-gradient(270deg, rgba(0, 197, 255, .103855) 0%, rgba(0, 197, 255, .493744) 48.55%, rgba(0, 197, 255, .103969) 100%);
        border-image-slice: 10;
        display: flex;
        justify-content: space-between;
        &-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #45c4ff;
          border-image: linear-gradient(180deg, rgba(0, 197, 255, .103855) 0%, rgba(0, 197, 255, .493744) 48.55%, rgba(0, 197, 255, .103969) 100%);
          border-image-slice: 2;
          margin: 0 auto;
          &:last-of-type {
            border-right: none;
          }

          &:nth-of-type(2n+1) {
            flex: 2;
          }

          &:nth-of-type(2n) {
            flex: 3;
          }

          .sub-status-num {
            line-height: 22.4px;
            font-weight: 400;
            font-size: 16px;
            color: #00fefe;
          }

          &:nth-of-type(2n) {

            .sub-status-num {
              color: #f5a623;
              ;
            }
          }

          .sub-status-desc {
            line-height: 16px;
            font-weight: 400;
            font-size: 12px;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-input__inner {
  height: 30px;
  width: 166px;
  background: transparent;
  border: none;
}
.el-input__suffix {
  display: none;
}

.filter-popper {
  border: 1px solid #00c7ff;
}

.popper__arrow {
  display: none !important;
}

.el-select-dropdown__item.selected {
  color: #00f2ff;
  background: rgb(2, 12, 12);
}
.el-select-dropdown {
  background: rgb(2, 12, 12);
}
</style>
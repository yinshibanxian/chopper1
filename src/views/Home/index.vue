<template>
  <div class="content" id="home-content">
    <div class="title-wrapper">
      <div class="english-title">Layout of neutron chopper system for CSNS</div>
      <div class="cn-title">| CSNS中子斩波器系统布局图</div>
    </div>
    <div id="container"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import { getShapedData } from "@/mock/chopper";
import { getSpectList } from '@/api/spect';
import { getChopperList } from '@/api/chopper';
import { groupBy } from 'lodash';
export default {
  async mounted() {
    const { edges, nodes } = await this.fetchSpectList();
    console.log(nodes, 'nodes>>>', edges)
    G6.registerNode("centerNode", {
      draw: (_cfg, group) => {
        const keyShape = group.addShape("rect", {
          attrs: {
            width: 0,
            height: 0,
            shadowColor: "red",
          },
        });
        return keyShape;
      },
    });

    G6.registerNode("first-node", {
      draw: (cfg, group) => {
        const keyShape = group.addShape("circle", {
          attrs: {
            x: 0,
            y: 0,
            r: 10,
            fill: "#f08c25",
            stroke: "white",
            lineWidth: 1,
          },
          name: "first-node-shape",
        });

        group.addShape("text", {
          attrs: {
            x: 0,
            y: 0,
            text: cfg.label,
            fill: "white",
            fontSize: 12,
            textAlign: "center",
            textBaseline: "middle",
          },
          afterDraw() {
            // 调整文本到节点中心
            const bbox = this.getBBox();
            const labelWidth = bbox.maxX - bbox.minX;
            this.attr("x", -labelWidth / 2);
          },
          name: "first-node-text",
        });

        return keyShape;
      },
    });

    G6.registerNode("custom-node", {
      draw: (cfg, group) => {
        const size = [60, 30];
        const keyShape = group.addShape("rect", {
          attrs: {
            width: size[0],
            height: size[1],
            x: -size[0] / 2,
            y: -size[1] / 2,
            fill: "#49af43",
            radius: size[1] / 2,
            text: cfg.label,
          },
          draggable: true,
          name: "custom-node-keyshape",
        });

        const border = group.addShape('rect', {
          attrs: {
            x: -size[0] / 2 + 10,
            y: -size[1] / 2 + 5,
            width: size[0] - 20,
            height: size[1] - 10,
            stroke: '#438e63',
            lineWidth: 1,
            fill: '#49af43'
          }
        });

        border.animate(
          (ratio) => {
            // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
            // 旋转通过矩阵来实现
            // 当前矩阵
            const matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            // 目标矩阵
            const toMatrix = G6.Util.transform(matrix, [
              ["r", cfg.deg || Math.PI / 2],
            ]);
            // 返回这一帧需要的参数集，本例中只有目标矩阵
            return {
              matrix: toMatrix,
            };
          },
          {
            repeat: false,
            duration: 1000,
            easing: "easeCubic",
          }
        );
        const textShape = group.addShape("text", {
          attrs: {
            text: cfg.label,
            fill: "white",
            x: 0,
            y: 0,
            fontWeight: 400,
            textAlign: "center",
            textBaseline: 'middle',
            fontSize: 10,
          },
          afterDraw() {
            // 调整文本到节点中心
            const bbox = this.getBBox();
            const labelWidth = bbox.maxX - bbox.minX;
            const labelHeight = bbox.maxY - bbox.minY;
            this.attr("x", -labelWidth / 2);
            this.attr("y", -labelHeight / 2);
          },
          name: "text-shape",
        });

        textShape.animate(
          (ratio) => {
            // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
            // 旋转通过矩阵来实现
            // 当前矩阵
            const matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            // 目标矩阵
            const toMatrix = G6.Util.transform(matrix, [
              ["r", cfg.deg || Math.PI / 2],
            ]);
            // 返回这一帧需要的参数集，本例中只有目标矩阵
            return {
              matrix: toMatrix,
            };
          },
          {
            repeat: false,
            duration: 1000,
            easing: "easeCubic",
          }
        );

        keyShape.animate(
          (ratio) => {
            // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
            // 旋转通过矩阵来实现
            // 当前矩阵
            const matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            // 目标矩阵
            const toMatrix = G6.Util.transform(matrix, [
              ["r", cfg.deg || Math.PI / 2],
            ]);
            // 返回这一帧需要的参数集，本例中只有目标矩阵
            return {
              matrix: toMatrix,
            };
          },
          {
            repeat: false,
            duration: 1000,
            easing: "easeCubic",
          }
        );
        return keyShape;
      },
      getAnchorPoints: () => {
        return [
          [0, 0.5],
          [1, 0.5],
        ];
      },
    });

    G6.registerNode('last-node', {
      draw(cfg, group) {
        const size = [160, 40];
        const keyShape = group.addShape('rect', {
          attrs: {
            width: size[0],
            height: size[1],
            x: -size[0] / 2,
            y: -size[1] / 2,
            text: cfg.label,
            fill: '#fff',
            stroke: '#f08c25',
            lineDash: [4, 4],
            radius: size[1] / 2
          }
        });

        const textShape = group.addShape('text', {
          attrs: {
            text: cfg.label,
            fill: "#f08c25",
            x: 0,
            y: 0,
            fontWeight: 400,
            textAlign: "center",
            textBaseline: 'middle',
            fontSize: 14,
          }
        });

        textShape.animate(
          (ratio) => {
            // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
            // 旋转通过矩阵来实现
            // 当前矩阵
            const matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            // 目标矩阵
            const toMatrix = G6.Util.transform(matrix, [
              ["r", cfg.deg || Math.PI / 2],
            ]);
            // 返回这一帧需要的参数集，本例中只有目标矩阵
            return {
              matrix: toMatrix,
            };
          },
          {
            repeat: false,
            duration: 1000,
            easing: "easeCubic",
          }
        );

        keyShape.animate(
          (ratio) => {
            // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
            // 旋转通过矩阵来实现
            // 当前矩阵
            const matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            // 目标矩阵
            const toMatrix = G6.Util.transform(matrix, [
              ["r", cfg.deg || Math.PI / 2],
            ]);
            // 返回这一帧需要的参数集，本例中只有目标矩阵
            return {
              matrix: toMatrix,
            };
          },
          {
            repeat: false,
            duration: 1000,
            easing: "easeCubic",
          }
        );

        return keyShape;
      }
    })

    G6.registerEdge("custom-edge", {
      draw(cfg, group) {
        const { startPoint, endPoint } = cfg;
        const keyShape = group.addShape("line", {
          attrs: {
            x1: startPoint.x,
            y1: startPoint.y,
            x2: endPoint.x,
            y2: endPoint.y,
            stroke: "#f08c25",
            lineWidth: 1,
            lineDash: [4, 4],
          },
        });
        return keyShape;
      },
    });
    
    
    const graph = new G6.Graph({
      width: document.body.clientWidth + 200,
      height: document.body.clientHeight + 200,
      container: "container",
      linkCenter: true,
      fitCenter: true,
      modes: {
        default: ["drag-canvas", "zoom-canvas"],
      },
      defaultNode: {
        type: "rect",
        shape: "anchor",
      },
    });
    graph.data({
      nodes,
      edges,
    });

    graph.on("node:click", this.handleNodeClick);

    graph.render();

  },
  methods: {
    async fetchSpectList() {
      const spectData = await getSpectList({
        page: 1,
        size: 100
      });
      const chopperData = await getChopperList({
        page: 1,
        size: 100
      });
      const sepectList = spectData.data.list || [];
      const chopperList = chopperData.data.list || [];
      const groupedChopper = groupBy(chopperList, 'spect_code');
      const originalData = [];
      Object.keys(groupedChopper).forEach((key, index) => {
        const choppers = groupedChopper[key];
        console.log(choppers, 'choppers>>>', choppers.map((chopper, innerIndex) => ({
            id: chopper.chopper_code,
            type: 'custom-node',
            label: `T${innerIndex}`,
            ...chopper
          })));
        const currentSpect = sepectList.find(spect => choppers[0].spect_code === spect.spect_code);
        let chopperArr = [];
        chopperArr.push({
          type: 'first-node',
          label: index + 1,
          id: `${index+1}`
        });
        chopperArr = [
          ...chopperArr,
          ...choppers.map((chopper, innerIndex) => ({
            type: 'custom-node',
            label: `T${innerIndex}`,
            ...chopper,
            id: chopper.chopper_code,
          })),
          {
            id: currentSpect.spect_code,
            label: currentSpect.spect_name,
            type: 'last-node'
          }
        ];
        originalData.push(chopperArr);

      })
      return getShapedData({ originalData });
      // console.log('res>>>', originalData, 'spect_code', chopperList);
    },
    handleNodeClick(evt) {
      const id = evt.item._cfg.id;
      this.$router.push({
        path: "/chopper-detail",
        query: { id },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  width: 100%;
  .title-wrapper {
    color: #fff;
    line-height: 30px;
    padding-left: 28px;
    padding-top: 30px;
    .english-title {
      font-size: 24px;
      font-weight: bold;
    }
    .cn-title {
      display: flex;
      align-items: center;
    }
  }
}
</style>
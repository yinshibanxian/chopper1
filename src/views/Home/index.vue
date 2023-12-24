<template>
  <div id="container"></div>
</template>

<script>
import G6 from "@antv/g6";
import mockData from "@/mock/chopper";
export default {
  mounted() {
    const { edges, nodes } = mockData;
    G6.registerNode("centerNode", {
      draw: (cfg, group) => {
        const keyShape = group.addShape("rect", {
          attrs: {
            width: 0,
            height: 0,
          },
        });
        return keyShape;
      },
    });
    G6.registerNode("custom-node", {
      draw: (cfg, group) => {
        const size = [60, 40];
        const keyShape = group.addShape("rect", {
          attrs: {
            width: size[0],
            height: size[1],
            x: -size[0] / 2,
            y: -size[1] / 2,
            fill: "rgb(213, 225, 247)",
            radius: 5,
            text: cfg.label,
          },
          draggable: true,
          name: "custom-node-keyshape",
        });
        const textShape = group.addShape("text", {
          attrs: {
            text: cfg.label,
            fill: "red",
            x: 0,
            y: 0,
            fontWeight: 400,
            textAlign: 'center',
            fontSize: 10
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
              ["r",  cfg.deg || Math.PI / 2],
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
        )

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

    const graph = new G6.Graph({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
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

    graph.on('node:click', this.handleNodeClick)

    graph.render();
  },
  methods: {
    handleNodeClick(evt) {
      const id = evt.item._cfg.id;
      this.$router.push({
        path: '/chopper-detail',
        query: { id }
      })
    }
  }
};
</script>

<style>
</style>
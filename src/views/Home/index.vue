<template>
  <div id="container"></div>
</template>

<script>
import G6 from "@antv/g6";
import mockData from "@/mock/chopper";
function roteNode(id, graph) {
  // 获取要旋转的节点
  const node = graph.findById(id);
  // 旋转角度（单位：弧度）
  const angle = Math.PI / 4;

  // 获取节点的图形元素
  const shape = node.getKeyShape();

  // 获取节点的中心点坐标
  const centerX = node.getModel().x + node.getModel().width / 2;
  const centerY = node.getModel().y + node.getModel().height / 2;

  // 设置节点的旋转变换
  shape.setMatrix([1, 0, 0, 1, centerX, centerY]);
  shape.rotateAtPoint(angle, 0, 0);
}
export default {
  mounted() {
    const { edges, nodes } = mockData;
    G6.registerNode('centerNode', {
      draw: (cfg, group) => {
        const keyShape = group.addShape('rect', {
          attrs: {
            width: 0,
            height: 0
          }
        });
        return keyShape;
      }
    })
    G6.registerNode("test-node", {
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
          },
          draggable: true,
          name: "level1node-keyshape",
        });
        console.log(keyShape.animate, "ss");
        keyShape.animate((ratio) => {
          // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
          // 旋转通过矩阵来实现
          // 当前矩阵
          const matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
          // 目标矩阵
          const toMatrix = G6.Util.transform(matrix, [["r", ratio * Math.PI / 2]]);
          // 返回这一帧需要的参数集，本例中只有目标矩阵
          return {
            matrix: toMatrix,
          };
        }, {
          repeat: false,
          duration: 1000,
          easing: 'easeCubic',
        });
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

    graph.render();
  },
};
</script>

<style>
</style>
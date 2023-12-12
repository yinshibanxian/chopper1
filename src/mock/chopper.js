import { chunk } from "lodash";
const StatusColorMap = {
  success: "#67C23A",
  warning: "#E6A23C",
  error: "#F56C6C",
};

const GroupNum = 4;
const centerNodeId = "centerNode";
const CenterNodeX = 0;
const CenterNodeY = 0;

const originalData = new Array(GroupNum).fill(1).map((_item, outerIndex) => {
  return new Array(4).fill(1).map((_index, innerIndex) => {
    return {
      id: `${outerIndex}-${innerIndex}`,
      label: `斩波器${outerIndex + 1}-${innerIndex + 1}`,
    };
  });
});

const modifiedNodes = [
  {
    id: centerNodeId,
    x: CenterNodeX,
    y: CenterNodeY,
    label: "靶站",
    size: 100,
    style: {
      fill: "#409EFF",
    },
    type: "centerNode",
  },
];

// 将全部数据分成两组，左右对称排列
const chunkedData = chunk(originalData, Math.floor(GroupNum / 4));


chunkedData.forEach((chopperArr, outerIndex) => {
  switch (outerIndex) {
    case 0:
      // 第一组数据从y轴正轴右侧PI / 6处顺时针旋转
      chopperArr.forEach((choppers, index) => {
        const length = chopperArr.length;
        const totalDeg = Math.PI / 2 - Math.PI / 6;
        const avgDeg =
          choppers.length - 2 > 0 ? totalDeg / (choppers.length - 2) : totalDeg;
        const curDeg =
          index === 0
            ? totalDeg
            : index === length - 1
            ? 0
            : (length - index) * avgDeg;
        choppers.forEach((chopper, innerIndex) => {
          const currentX =
            (innerIndex + 1) * 200 * Math.cos(curDeg) + CenterNodeX;
          const currentY =
            (innerIndex + 1) * 200 * - Math.sin(curDeg) + CenterNodeY;
          const { id, label } = chopper;
          modifiedNodes.push({
            id,
            x: currentX,
            y: currentY,
            label,
          });
        });
      });

      break;
    case 1:
      // 第二组数据从x轴正轴顺时针旋转
      chopperArr.forEach((choppers, index) => {
        const length = chopperArr.length;
        const totalDeg = Math.PI / 2 - Math.PI / 6;
        const avgDeg =
          choppers.length - 2 > 0 ? totalDeg / (choppers.length - 2) : totalDeg;
        const curDeg = index === length - 1 ? totalDeg : (index + 1) * avgDeg;
        choppers.forEach((chopper, innerIndex) => {
          const currentX =
            (innerIndex + 1) * 200 * Math.cos(curDeg) + CenterNodeX;
          const currentY =
            (innerIndex + 1) * 200 * Math.sin(curDeg) + CenterNodeY;
          const { id, label } = chopper;
          modifiedNodes.push({
            id,
            x: currentX,
            y: currentY,
            label,
          });
        });
      });
      break;
    case 2:
      // 第三组数据从y轴负轴左侧PI / 6处顺时针旋转
      chopperArr.forEach((choppers, index) => {
        const length = chopperArr.length;
        const totalDeg = Math.PI / 2 - Math.PI / 6;
        const avgDeg =
          choppers.length - 2 > 0 ? totalDeg / (choppers.length - 2) : totalDeg;
        const curDeg = index === length - 1 ? Math.PI : index === 0 ? (Math.PI / 6 + Math.PI / 2) : (index + 1) * avgDeg + Math.PI / 2;
        choppers.forEach((chopper, innerIndex) => {
          const currentX =
            (innerIndex + 1) * 200 *  Math.cos(curDeg) + CenterNodeX;
          const currentY =
            (innerIndex + 1) * 200 * Math.sin(curDeg) + CenterNodeY;
          console.log(currentX, 'currentX', currentY, curDeg, Math.sin(curDeg));

          const { id, label } = chopper;
          modifiedNodes.push({
            id,
            x: currentX,
            y: currentY,
            label,
          });
        });
      });
      break;
    case 3:
      // 第一组数据从x轴负轴顺时针旋转
      chopperArr.forEach((choppers, index) => {
        const length = chopperArr.length;
        const totalDeg = Math.PI / 2 - Math.PI / 6;
        const avgDeg =
          choppers.length - 2 > 0 ? totalDeg / (choppers.length - 2) : totalDeg;
          const curDeg = index === length - 1 ? totalDeg : (index + 1) * avgDeg;
        choppers.forEach((chopper, innerIndex) => {
          const currentX =
            (innerIndex + 1) * 200 * - Math.cos(curDeg) + CenterNodeX;
          const currentY =
            (innerIndex + 1) * 200 * - Math.sin(curDeg) + CenterNodeY;
          const { id, label } = chopper;
          modifiedNodes.push({
            id,
            x: currentX,
            y: currentY,
            label,
          });
        });
      });
      break;
  }
});

// originalData.forEach((item, outerIndex) => {
//   item.forEach((_item, innerIndex) => {
//     // 均分角度
//     const avgDeg = (2 * Math.PI) / GroupNum;
//     // 从最右边开始算
//     let curDeg = outerIndex * avgDeg;
//     /**
//        *  假设旋转的角度为curDeg，那么当前点距离中心点的距离应该遵循以下公式
//           假设边长是edgeLength，那么点到中心点的距离distance = edgeLength * (innerIndex + 1)
//           那么点到中心点x方向上的距离
//           x = distance * cos(deg);
//           y方向上的距离
//           y = distance * sin(deg)
//        */
//     // 假设旋转的角度为curDeg，那么当前点距离中心点的距离应该遵循以下公式
//     // 假设边长是edgeLength，那么点到中心点的距离distance = edgeLength * (innerIndex + 1)
//     // 那么点到中心点x方向上的距离
//     // x = distance * cos(deg);
//     // y方向上的距离
//     // y = distance * sin(deg)
//     const edgeLength = 100;
//     const nodeWidth = 75;
//     const num = innerIndex + 1;
//     const currentX = CenterNodeX + edgeLength * num * Math.cos(curDeg);
//     const currentY = CenterNodeY + edgeLength * num * Math.sin(curDeg);
//     const color =
//       innerIndex % 3 === 0
//         ? StatusColorMap["success"]
//         : innerIndex % 3 === 1
//         ? StatusColorMap["warning"]
//         : StatusColorMap["error"];
//     modifiedNodes.push({
//       id: _item.id,
//       x: currentX,
//       y: currentY,
//       label: _item.label,
//       style: {
//         fill: color,
//         lineWidth: 2,
//         lineDash: [4, 2], // 设置虚线样式，[4, 2] 表示每个虚线段的长度和间隔
//         stroke: color,
//         radius: 5,
//         width: nodeWidth,
//       },
//       anchorPoints: [
//         [0, 0.5],
//         [1, 0.5],
//       ],
//         type: "test-node",
//     });
//   });
// });

const edges = [];

originalData.forEach((itemArr) => {
  itemArr.forEach((item, index) => {
    if (index === 0) {
      edges.push({
        source: centerNodeId,
        target: item.id,
        style: {
          width: 50,
        },
        // 该边连入 source 点的第 0 个 anchorPoint，
        sourceAnchor: 0,
        // 该边连入 target 点的第 0 个 anchorPoint，
        targetAnchor: 0,
      });
    } else {
      edges.push({
        source: itemArr[index - 1].id,
        target: item.id,
        // 该边连入 source 点的第 0 个 anchorPoint，
        sourceAnchor: 1,
        // 该边连入 target 点的第 0 个 anchorPoint，
        targetAnchor: 0,
      });
    }
  });
});

const data = {
  nodes: [
    {
      id: "node1",
      label: "node1",
      x: 0,
      y: 0,
      // 该节点可选的连接点集合，该点有两个可选的连接点
      anchorPoints: [
        [0, 0.5], // 左侧中间
        [1, 0.5], // 右侧中间
      ],
      type: "test-node",
    },
    {
      id: "node2",
      label: "node2",
      x: 300,
      y: 300,
      // 该节点可选的连接点集合，该点有两个可选的连接点
      anchorPoints: [
        [0, 0.5], // 左侧中间
        [1, 0.5], // 右侧中间
      ],
      type: "test-node",
    },
  ],
  edges: [
    {
      source: "node1",
      target: "node2",
      // 该边连入 source 点的第 0 个 anchorPoint，
      sourceAnchor: 1,
      // 该边连入 target 点的第 0 个 anchorPoint，
      targetAnchor: 0,
      style: {
        endArrow: true,
      },
      type: "test-node",
    },
    {
      source: "node2",
      target: "node1",
      // 该边连入 source 点的第 1 个 anchorPoint，
      sourceAnchor: 1,
      // 该边连入 source 点的第 1 个 anchorPoint，
      targetAnchor: 1,
      style: {
        endArrow: true,
      },
    },
  ],
};

export default {
  edges: edges,
  nodes: modifiedNodes,
};

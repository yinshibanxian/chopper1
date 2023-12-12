import { chunk } from "lodash";
const StatusColorMap = {
  success: "#67C23A",
  warning: "#E6A23C",
  error: "#F56C6C",
};

const GroupNum = 20;
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
            type: 'custom-node',
            deg: Math.PI - curDeg
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
            type: 'custom-node',
            deg: curDeg
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
        const curDeg = index === 0 ? (Math.PI / 6 + Math.PI / 2) : index === length - 1 ? Math.PI  : (index + 1) * avgDeg + Math.PI / 2;
        choppers.forEach((chopper, innerIndex) => {
          const currentX =
            (innerIndex + 1) * 200 *  Math.cos(curDeg) + CenterNodeX;
          const currentY =
            (innerIndex + 1) * 200 * Math.sin(curDeg) + CenterNodeY;

          const { id, label } = chopper;
          modifiedNodes.push({
            id,
            x: currentX,
            y: currentY,
            label,
            type: 'custom-node',
            deg: curDeg
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
            type: 'custom-node',
            deg: curDeg
          });
        });
      });
      break;
  }
});


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


export default {
  edges: edges,
  nodes: modifiedNodes,
};

import { chunk } from "lodash";
const StatusColorMap = {
  success: "#67C23A",
  warning: "#E6A23C",
  error: "#F56C6C",
};

const GroupNum = 20;
const centerNodeId = "centerNode";
const CenterNodeX = document.body.clientWidth / 2;
const CenterNodeY = document.body.clientHeight / 2;

const originalData = new Array(GroupNum).fill(1).map((_item, outerIndex) => {
  return new Array(4).fill(1).map((_index, innerIndex) => {
    return {
      id: `${outerIndex}-${innerIndex}`,
      label: `T${innerIndex}`,
      status: 1,
    };
  });
});

// const originData = [
//   [
//     {
//       id: ''
//     }
//   ]
// ];

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
const chunkedData = chunk(originalData, Math.floor(originalData.length / 2));

chunkedData.forEach((chopperArr, outerIndex) => {
  switch (outerIndex) {
    case 0:
      // 第一组数据从y轴负轴右侧PI / 6处顺时针旋转
      chopperArr.forEach((choppers, index) => {
        const length = chopperArr.length;
        const totalDeg = (Math.PI / 2 - Math.PI / 6) * 2;
        const startDeg = -Math.PI / 2 + Math.PI / 6;
        const endDeg = Math.PI / 2 - Math.PI / 6;
        const avgDeg = length - 2 > 0 ? totalDeg / (length - 2) : totalDeg;
        const curDeg =
          index === length - 1 ? endDeg : startDeg + index * avgDeg;
        let edgeDistance;
        choppers.forEach((chopper, innerIndex) => {
          // 点与点之间的距离
          edgeDistance = innerIndex === 0 ? 200 : 150;
          console.log(edgeDistance, 'edgeDistance')
          const currentX =
            (innerIndex + 1) * edgeDistance * Math.cos(curDeg) + CenterNodeX;
          const currentY =
            (innerIndex + 1) * edgeDistance * -Math.sin(curDeg) + CenterNodeY;
          const { id, label } = chopper;
          modifiedNodes.push({
            id,
            x: currentX,
            y: currentY,
            label: innerIndex === 0 ? index + 1 : label,
            type: innerIndex === 0 ? "first-node" : "custom-node",
            deg: Math.PI - curDeg,
          });
        });
      });
      break;
    case 1:
      // 第二组数据从y轴正轴顺时针旋转
      chopperArr.forEach((choppers, index) => {
        const length = chopperArr.length;
        const totalDeg = (Math.PI / 2 - Math.PI / 6) * 2;
        const startDeg = Math.PI / 2 + Math.PI / 6;
        const endDeg = (2 * Math.PI * 3) / 4 - Math.PI / 6;
        const avgDeg = totalDeg / (length - 2);
        const curDeg =
          index === length - 1 ? endDeg : startDeg + index * avgDeg;
        // 点与点之间的距离
        let edgeDistance;
        choppers.forEach((chopper, innerIndex) => {
          edgeDistance = innerIndex === 0 ? 200 : 150;
          const currentX =
            (innerIndex + 1) * edgeDistance * Math.cos(curDeg) + CenterNodeX;
          const currentY =
            (innerIndex + 1) * edgeDistance * -Math.sin(curDeg) + CenterNodeY;
          const { id, label } = chopper;
          modifiedNodes.push({
            id,
            x: currentX,
            y: currentY,
            label: innerIndex === 0 ? index + chunkedData[0].length + 1 : label,
            type: innerIndex === 0 ? "first-node" : "custom-node",
            deg: Math.PI - curDeg,
          });
        });
      });
      break;
      // 第一组数据从x轴负轴顺时针旋转
      chopperArr.forEach((choppers, index) => {
        const length = chopperArr.length;
        const totalDeg = Math.PI / 2 - Math.PI / 6;
        const avgDeg =
          choppers.length - 2 > 0 ? totalDeg / (choppers.length - 2) : totalDeg;
        const curDeg = index === length - 1 ? totalDeg : (index + 1) * avgDeg;
        choppers.forEach((chopper, innerIndex) => {
          const currentX =
            (innerIndex + 1) * 200 * -Math.cos(curDeg) + CenterNodeX;
          const currentY =
            (innerIndex + 1) * 200 * -Math.sin(curDeg) + CenterNodeY;
          const { id, label } = chopper;
          modifiedNodes.push({
            id,
            x: currentX,
            y: currentY,
            label: innerIndex === 0 ? index : label,
            type: innerIndex === 0 ? "first-node" : "custom-node",
            deg: curDeg,
          });
        });
      });
      break;
  }
});

console.log(modifiedNodes, 'modifiedNodes')

const edges = [];

originalData.forEach((itemArr) => {
  itemArr.forEach((item, index) => {
    if (index === 0) {
      edges.push({
        type: "custom-edge",
        source: centerNodeId,
        target: item.id,
        style: {
          // width: 50,
        },
        // 该边连入 source 点的第 0 个 anchorPoint，
        // sourceAnchor: 0,
        // // 该边连入 target 点的第 0 个 anchorPoint，
        // targetAnchor: 0,
      });
    } else {
      edges.push({
        type: "custom-edge",
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

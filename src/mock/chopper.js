import { chunk } from "lodash";

const centerNodeId = "centerNode";
export const CenterNodeX = document.body.clientWidth / 2;
export const CenterNodeY = document.body.clientHeight / 2;

export function getShapedData({ originalData }) {
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

console.log(chunkedData, 'chunkData');



chunkedData.forEach((chopperArr, outerIndex) => {
  switch (outerIndex) {
    case 0:
      // 第一组数据从y轴负轴右侧PI / 6处顺时针旋转
      chopperArr.forEach((choppers, index) => {
        const length = chopperArr.length;
        const totalDeg = (Math.PI / 2 - Math.PI / 6) * 2;
        const startDeg = -Math.PI / 2 + Math.PI / 6;
        const endDeg = Math.PI / 2 - Math.PI / 6;
        const avgDeg = length - 2 > 0 ? totalDeg / (length - 1) : totalDeg;
        const curDeg =
          index === length - 1 ? endDeg : startDeg + index * avgDeg;
        let edgeDistance;
        choppers.forEach((chopper, innerIndex) => {
          // 点与点之间的距离
          edgeDistance = innerIndex === 0 ? 120 : 150;
          const currentX =
            (innerIndex + 1) * edgeDistance * Math.cos(curDeg) + CenterNodeX;
          const currentY =
            (innerIndex + 1) * edgeDistance * -Math.sin(curDeg) + CenterNodeY;
          const { id, label, type } = chopper;
          modifiedNodes.push({
            id,
            x: currentX,
            y: currentY,
            label: label,
            type: type,
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
        const avgDeg = totalDeg / (length - 1);
        const curDeg =
          index === length - 1 ? endDeg : startDeg + index * avgDeg;
        // 点与点之间的距离
        let edgeDistance;
        choppers.forEach((chopper, innerIndex) => {
          edgeDistance = innerIndex === 0 ? 120 : 150;
          const currentX =
            (innerIndex + 1) * edgeDistance * Math.cos(curDeg) + CenterNodeX;
          const currentY =
            (innerIndex + 1) * edgeDistance * -Math.sin(curDeg) + CenterNodeY;
          const { id, label, type } = chopper;
          modifiedNodes.push({
            id,
            x: currentX,
            y: currentY,
            label: label,
            type: type,
            deg: Math.PI - curDeg,
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
        type: "custom-edge",
        source: centerNodeId,
        target: item.id,
        style: {
          // width: 50,
        },
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

return {
  nodes: modifiedNodes,
  edges: edges
}
}



// export default {
//   edges: edges,
//   nodes: modifiedNodes,
// };

import si from "systeminformation"
import { getFileSize } from "../utils.js"
import { Circle } from "./index.js"
let memLayout = null;
let memLayoutProbe = null;

// 首次调用
function ensureMemLayout() {
  memLayoutProbe ??= si.memLayout()
    .then(r => { memLayout = r })
    .catch(() => { memLayout = [] })
  return memLayoutProbe
}

/** 获取当前内存占用 */
export default async function getMemUsage() {
  const [, memData] = await Promise.all([
    ensureMemLayout(),
    si.get({ mem: "total,used,active,buffcache" })
  ])
  const { total, used, active, buffcache } = memData?.mem ?? {}
  if (!total) return false
  const usedPercentage = (used / total).toFixed(2)
  const activePercentage = (active / total).toFixed(2)
  // const buffcachePercentage = (buffcache / total).toFixed(2)

  const buffcacheMem = getFileSize(buffcache)
  const totalMem = getFileSize(total)
  const activeMem = getFileSize(active)

  const isBuff = buffcache && buffcache != 0
  // const buffcacheInner = isBuff ? `/${Math.round(buffcachePercentage * 100)}` : ""

  return {
    percentage: activePercentage,
    inner: `${Math.round(activePercentage * 100)}%`,
    title: "RAM",
    detailed: memLayout?.[0]?.clockSpeed ? `${memLayout[0].clockSpeed}MHz` : false,
    info: [
        `${activeMem} / ${totalMem}`,
        isBuff ? `缓冲区/缓存 ${buffcacheMem}` : ""
    ],
    buffcache: {
      percentage: {
        ...Circle(usedPercentage),
        color: "#bcbbbbb0"
      },
      isBuff
    }
  }
}

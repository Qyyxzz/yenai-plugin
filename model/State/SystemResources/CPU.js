import si from "systeminformation"

let cpu = null;
let cpuProbe = null;

// 首次调用
function ensureCpu() {
  cpuProbe ??= si.cpu()
    .then(r => { cpu = r })
    .catch(() => { cpu = {} })
  return cpuProbe
}

export default async function getCpuInfo() {
  const [, loadData] = await Promise.all([
    ensureCpu(),
    si.get({ currentLoad: "currentLoad" })
  ])
  const currentLoad = loadData?.currentLoad?.currentLoad
  let { manufacturer, speed, cores, brand } = cpu ?? {}
  if (currentLoad == null || currentLoad == undefined) return false
  manufacturer = manufacturer?.split(" ")?.[0] ?? "unknown"
  return {
    percentage: currentLoad / 100,
    inner: Math.round(currentLoad) + "%",
    title: "CPU",
    detailed: brand || false,
    info: [ `${manufacturer} ${cores}核 ${speed ? `${speed}GHz` : ""}` ]

  }
}

export interface CylinderDimensions {
  width: number
  height: number
  bodyTop: number
  bodyHeight: number
  rx: number
  ry: number
  cx: number
  bottomCy: number
  topCy: number
}

export function getCylinderDimensions(width: number, height: number): CylinderDimensions {
  const rx = width / 2 - 4
  const ry = Math.round(rx * 0.22)
  const cx = width / 2
  const topCy = ry + 2
  const bottomCy = height - ry - 2
  const bodyTop = topCy
  const bodyHeight = bottomCy - topCy

  return { width, height, bodyTop, bodyHeight, rx, ry, cx, bottomCy, topCy }
}


export function getFillHeight(levelPercent: number, bodyHeight: number): number {
  return Math.min(Math.max(levelPercent / 100, 0), 1) * bodyHeight
}

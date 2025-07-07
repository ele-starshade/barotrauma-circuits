/**
 * Converts an HSV color value to RGB.
 *
 * @param   {number}  h       The hue (0-360)
 * @param   {number}  s       The saturation (0-1)
 * @param   {number}  v       The value (0-1)
 * @returns {Object}          The RGB representation { r, g, b }
 */
export default function hsvToRgb (h, s, v) {
  let r, g, b

  const i = Math.floor(h / 60) % 6
  const f = h / 60 - Math.floor(h / 60)
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  switch (i) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

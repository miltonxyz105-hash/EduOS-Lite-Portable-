const LOW_RES_BREAKPOINTS = {
  LOW: { width: 1024, height: 600, scale: 0.85 },
  MED: { width: 1366, height: 768, scale: 0.92 },
  HIGH: { width: 1920, height: 1080, scale: 1.0 },
}

function getUiScale(innerWidth) {
  if (!Number.isFinite(innerWidth)) return LOW_RES_BREAKPOINTS.HIGH.scale
  if (innerWidth <= LOW_RES_BREAKPOINTS.LOW.width) {
    return LOW_RES_BREAKPOINTS.LOW.scale
  }
  if (innerWidth <= LOW_RES_BREAKPOINTS.MED.width) {
    return LOW_RES_BREAKPOINTS.MED.scale
  }
  return LOW_RES_BREAKPOINTS.HIGH.scale
}

const DEFAULT_APP_STATES = Object.freeze({
  studyModeActive: false,
  batteryModeActive: false,
  locked: true,
})

export { LOW_RES_BREAKPOINTS, getUiScale, DEFAULT_APP_STATES }

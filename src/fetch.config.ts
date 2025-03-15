export const fetchconfig = {
  timers: { done: 0.5, undone: 0.5, cancel: 0.3, delete: 1 }
}

export const FETCH_STALE_TIME = 60 * 60 * 1000

export const defaultSetting = {
  darkMode: false,
  editorTimeZone: "utc",
  preferredTimeZone: "local",
  identities: [],
  compactView:false,
}

export const visibleTasksRefetchInterval = 60 * 1000 // 1 minute

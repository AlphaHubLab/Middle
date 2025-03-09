import type {
  IBackupConfig,
  IBackupData,
  IDraft,
  IGroupedItems,
  IRecurrence,
  IShareConfig,
  IShareData,
  IStoreParams,
  ITask,
  ITaskParams
} from "./types"

/**
 * Create local Id to handle grouping items
 */
const getReccurenceGroupId = (item: ITask) =>
  item.params.identities.length === 1
    ? `${item.recurrenceId}|${item.params.identities[0].id}`
    : `${item.recurrenceId}`

/**
 * Group similar items
 */
export const groupItems = (items: ITask[], skipSimilarIdentities: boolean) => {
  // return new Promise
  const sortedItems = [...items].sort((a, b) => a.dateAdded - b.dateAdded)
  const groupedItems: IGroupedItems = {}

  const multiRgids = []
  let groupId = 0

  // Sort in category
  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i]
    // If non-recurrence
    if (item.recurrenceId.length === 0) {
      groupedItems[`t-${groupId}`] = [item]
      groupId++
      continue
    }

    // if recurrence, so need to group
    // skip similar tasks with different identities
    if (item.params.identities.length === 1 && skipSimilarIdentities) {
      let skip = false

      for (let j = 0; j < multiRgids.length; j++) {
        const splitted = multiRgids[j].split("|")
        if (
          item.recurrenceId === splitted[0] &&
          item.params.identities[0].id !== Number(splitted[1])
        ) {
          skip = true
          break
        }
      }

      if (skip) continue
    }

    const rgId = getReccurenceGroupId(item)
    // for skipping idenetities
    if (skipSimilarIdentities) multiRgids.push(rgId)

    // if group not created before
    if (!groupedItems.hasOwnProperty(rgId)) groupedItems[rgId] = [item]
    // if group existed
    else {
      // if item is done, push it to the start
      if (item.dateDone > 0) groupedItems[rgId].unshift(item)
      // push it to the end
      else groupedItems[rgId].push(item)
    }
  }

  return groupedItems
}

/**
 *
 */
const addItemToBackup = (
  item: ITask,
  itemType: "tasks" | "history",
  recurrences: IRecurrence[],
  store: IBackupData | IShareData,
  type: "backup" | "share"
) => {
  if (type === "backup") {
    store[itemType].push(item)
  }

  if (type === "share") {
    const { params } = item
    const publicParams: ITaskParams = { ...params, identities: [] }

    const publicItem: ITask = {
      ...item,
      done: false,
      dateDone: -1,
      params: publicParams
    }

    store[itemType].push(publicItem)
  }

  if (item.recurrenceId.length > 0) {
    if (!store.recurrences.find((r) => r.id === item.recurrenceId)) {
      const recurrence = recurrences.find((r) => r.id === item.recurrenceId)
      if (type === "backup") {
        store.recurrences.push(recurrence)
      }

      if (type === "share") {
        const { params } = recurrence
        const publicParams: IStoreParams = { ...params, identities: [] }

        const publicReccurence: IRecurrence = {
          ...recurrence,
          params: publicParams
        }

        store.recurrences.push(publicReccurence)
      }
    }
  }
}

/**
 *
 */
export const createBackup = async (
  tasks: ITask[],
  history: ITask[],
  drafts: IDraft[],
  recurrences: IRecurrence[],
  setting: any,
  selectedItems: string[],
  config: IBackupConfig
): Promise<IBackupData> => {
  const backup: IBackupData = {
    tasks: [],
    history: [],
    drafts: [],
    recurrences: [],
    setting: {}
  }

  return new Promise((resolve) => {
    if (config.customSelection) {
      tasks.forEach((item) => {
        if (selectedItems.includes(item.id)) {
          addItemToBackup(item, "tasks", recurrences, backup, "backup")
        }
      })

      history.forEach((item) => {
        if (selectedItems.includes(item.id)) {
          addItemToBackup(item, "history", recurrences, backup, "backup")
        }
      })

      drafts.forEach((item) => {
        if (selectedItems.includes(item.id)) {
          backup.drafts.push(item)
        }
      })
    } else {
      if (config.tasks) {
        tasks.forEach((item) => {
          addItemToBackup(item, "tasks", recurrences, backup, "backup")
        })
      }

      if (config.history) {
        history.forEach((item) => {
          addItemToBackup(item, "history", recurrences, backup, "backup")
        })
      }

      if (config.drafts) {
        drafts.forEach((item) => {
          backup.drafts.push(item)
        })
      }
    }

    if (config.setting) {
      backup.setting = setting
    }

    resolve(backup)
  })
}

/**
 *
 */
export const createShare = async (
  tasks: ITask[],
  history: ITask[],
  recurrences: IRecurrence[],
  selectedItems: string[],
  config: IShareConfig
): Promise<IShareData> => {
  
  const share: IShareData = {
    tasks: [],
    recurrences: []
  }

  return new Promise((resolve) => {
    if (config.customSelection) {
      tasks.forEach((item) => {
        if (selectedItems.includes(item.id)) {
          addItemToBackup(item, "tasks", recurrences, share, "share")
        }
      })

      history.forEach((item) => {
        if (selectedItems.includes(item.id)) {
          addItemToBackup(item, "tasks", recurrences, share, "share")
        }
      })
    } else {
      if (config.tasks) {
        tasks.forEach((item) => {
          addItemToBackup(item, "tasks", recurrences, share, "share")
        })
      }

      if (config.history) {
        history.forEach((item) => {
          addItemToBackup(item, "tasks", recurrences, share, "share")
        })
      }
    }

    resolve(share)
  })
}

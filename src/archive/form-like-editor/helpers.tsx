const urlRegex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi

export const isTaskEmpty = (_task) =>
  _task.length === 1 && _task[0].value === ""

export const hasTitle = (_task) => _task[0].type === "h"

export const splitTextByUrls = (e, _task, focusedNode, createTitle = true) => {
  const current =
    _task[focusedNode].value + e.clipboardData.getData("Text").trim()
  const splittedByLine = current.trim().split(/\n/)
  const urls = current.match(urlRegex) || []

  const nodes = []
  const splittedBySpace = []

  splittedByLine.forEach((s) => splittedBySpace.push(s.split(" ")))

  for (let i = 0; i < splittedBySpace.length; i++) {
    if (splittedBySpace[i][0] === "") {
      nodes.push({ type: "p", value: "" })
      continue
    }

    let str = ""

    for (let j = 0; j < splittedBySpace[i].length; j++) {
      const isUrl = urls.includes(splittedBySpace[i][j])
      if (isUrl === false) {
        str = str + " " + splittedBySpace[i][j]
        if (j === splittedBySpace[i].length - 1) {
          const trimmed = str.trim()
          if (trimmed.length > 0) {
            nodes.push({ type: "p", value: trimmed })
          }
        }
      } else {
        const trimmed = str.trim()
        if (trimmed.length > 0) {
          nodes.push({ type: "p", value: trimmed })
        }
        str = ""
        nodes.push({ type: "a", value: splittedBySpace[i][j] })
      }
    }
  }
  if (isTaskEmpty(_task) && hasTitle(_task)) {
    nodes[0].type = "h"
  }
  return nodes
}

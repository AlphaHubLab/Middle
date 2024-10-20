const ExampleDocument = [
  {
    type: "h1",
    children: [{ text: "Heading 1" }]
  },
  {
    type: "paragraph",
    children: [
      // { text: "Hello World! This is my paragraph inside a sample document. " },
      // { text: "Bold text. ", bold: true, code: true },
      // { text: "Italic text. ", italic: true },
      // { text: "Bold and underlined text. ", bold: true, underline: true },
      // { text: "variableFoo ", code: true },

      { text: "Hello World! This is my paragraph inside a sample document. " },
      { text: "Bold text. " },
      { text: "Italic text. " },
      { text: "Bold and underlined text. " },
      { text: "variableFoo " }

      // {
      //   type: "link",
      //   url: "https://www.google.com",
      //   children: [
      //     { text: "Link text " },
      //     { text: "Bold text inside link", bold: true }
      //   ]
      // }
    ]
  }
]

export default ExampleDocument

export const toolbars = [
  ["heading", "bold", "italic"],
  ["hr", "quote", "strike"],
  ["ul", "ol", "task", "indent", "outdent"],
  ["table", "image", "link"],
  ["code", "codeblock"],
  ["scrollSync"],
  [
    {
      name: "myItem",
      tooltip: "myItem",
      command: "italic",
      text: "@",
      className: "toastui-editor-toolbar-icons",
      style: { backgroundImage: "none", color: "#333", fontSize: "20px" },
    },
  ],
];

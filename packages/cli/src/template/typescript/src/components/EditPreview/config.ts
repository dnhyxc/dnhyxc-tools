import { IToolbarConfig, IEditorConfig } from "@wangeditor/editor";

export const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    // 菜单 key
    "headerSelect",
    // 分割线
    "|",
    // "|",
    "undo",
    "redo",
    // 菜单 key
    "bold",
    "italic",
    "blockquote",
    "color",
    "bgColor",
    "through",
    "clearStyle",
    "|",
    // "todo", // 代办
    {
      key: "group-justify",
      title: "对齐",
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
      menuKeys: [
        "justifyLeft",
        "justifyRight",
        "justifyCenter",
        "justifyJustify",
      ],
    },
    {
      key: "group-indent",
      title: "缩进",
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
      menuKeys: ["indent", "delIndent"],
    },
    // "|",
    "bulletedList",
    "numberedList",
    // "|",
    "insertLink",
    // "emotion", // 表情
    "insertTable",
    {
      key: "group-image",
      title: "图片",
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
      menuKeys: ["insertImage", "uploadImage"],
    },
    // "|",
    "codeBlock",
    "code",
    "|",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "|",
    // 菜单组，包含多个菜单
    {
      key: "group-more-style",
      title: "更多",
      iconSvg: "<span>更多</span>",
      menuKeys: ["divider", "sup", "sub"],
    },
    // "fullScreen",
  ],
};

export const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  MENU_CONF: {},
};

editorConfig.MENU_CONF!.uploadImage = {
  // 上传图片的配置
  server: "/api/upload",
  fieldName: "dnhyxc",
  // 单个文件的最大体积限制，默认为 2M
  maxFileSize: 5 * 1024 * 1024,
  // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
  allowedFileTypes: ["image/*"],
  // 上传之前触发
  onBeforeUpload(file: File) {
    // file 选中的文件，格式如 { key: file }
    // 可以 return
    // 1. return file 或者 new 一个 file ，接下来将上传
    // 2. return false ，不上传这个 file
    return file;
  },
  // 上传进度的回调函数
  onProgress(progress: number) {
    // progress 是 0-100 的数字
    console.log("progress", progress);
  },
  // 单个文件上传成功之后
  onSuccess(file: File, res: any) {
    console.log(`${file.name} 上传成功`, res);
  },
  // 单个文件上传失败
  onFailed(file: File, res: any) {
    console.log(`${file.name} 上传失败`, res);
  },
  // 上传错误，或者触发 timeout 超时
  onError(file: File, err: any, res: any) {
    console.log(`${file.name} 上传出错`, err, res);
  },
};

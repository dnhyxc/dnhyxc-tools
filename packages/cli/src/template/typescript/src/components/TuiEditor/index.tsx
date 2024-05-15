import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import "@toast-ui/editor/dist/i18n/zh-cn";
import "highlight.js/styles/github.css";
import "prismjs/themes/prism-solarizedlight.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";

// toolbar 文字颜色选项样式
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";

import "@toast-ui/chart/dist/toastui-chart.css";
import chart from "@toast-ui/editor-plugin-chart";
// import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import React, { useEffect } from "react";
import Editor from "@toast-ui/editor";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import tableMergedCell from "@toast-ui/editor-plugin-table-merged-cell";
import uml from "@toast-ui/editor-plugin-uml";
import Prism from "prismjs";
import * as Service from "@/service";
import { toolbars } from "./toobars";
import styles from "./index.less";

interface IProps {
  onGetMackdown: Function;
}

const TuiEditor: React.FC<IProps> = ({ onGetMackdown }) => {
  useEffect(() => {
    const instance = new Editor({
      el: document.querySelector("#editor")!,
      placeholder: "请输入文章内容",
      initialEditType: "markdown",
      previewStyle: "vertical", // 预览方式
      language: "zh-CN",
      height: "100%",
      previewHighlight: false, // 输入时是否高亮显示右侧预览区
      hideModeSwitch: true, // 不展示底部tab切换
      toolbarItems: toolbars,
      // theme: "dark",
      plugins: [
        chart,
        [codeSyntaxHighlight, { highlighter: Prism }],
        tableMergedCell,
        uml,
        colorSyntax,
      ],
      events: {
        change: () => {
          onGetMackdown && onGetMackdown(instance.getMarkdown());
        },
      },
      hooks: {
        addImageBlobHook: (fileOrBlob, callback) => {
          console.log(fileOrBlob, "fileOrBlob");
          uploadImage(fileOrBlob, callback);
        },
      },
    });
  }, []);

  const uploadImage = async (file: Blob, callback: Function) => {
    const res = await Service.upload(file);
    console.log(res, "res");
    callback(res);
    console.log(callback, "callbackcallbackcallbackcallback");
  };

  return <div className={styles.editContainer} id="editor" />;
};

export default TuiEditor;

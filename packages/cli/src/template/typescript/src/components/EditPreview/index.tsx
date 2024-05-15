import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import React, { useState, useEffect, useRef } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor } from "@wangeditor/editor";
import { Scrollbars } from "react-custom-scrollbars";
import { toolbarConfig, editorConfig } from "./config";
import Preview from "../Preview";
import md from "../../../README.md";
import testHtml from "./test.md";
import styles from "./index.less";

interface IProps {}

const EditPreview: React.FC<IProps> = () => {
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const [html, setHtml] = useState<string>(testHtml); // 编辑器内容
  const [text, setText] = useState<string>(md); // 编辑器内容

  const editRef: any = useRef(null);
  const previewRef: any = useRef(null);

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const onEditValueChange = (value: {
    getText: () => React.SetStateAction<string>;
    getHtml: () => React.SetStateAction<string>;
  }) => {
    setHtml(value.getHtml());
    setText(value.getText());
  };

  const onEditScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const percent = scrollTop / (scrollHeight - clientHeight);
    const previewScrollHeight = previewRef.current.getScrollHeight();
    const previewClientHeight = previewRef.current.getClientHeight();
    const previewScrollTop =
      percent * (previewScrollHeight - previewClientHeight);

    if (previewScrollTop < 30) {
      previewRef.current.scrollTop(Math.floor(previewScrollTop));
    } else {
      previewRef.current.scrollTop(Math.ceil(previewScrollTop));
    }
  };

  const onPreviewScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const percent = scrollTop / (scrollHeight - clientHeight);
    const editRefScrollHeight = editRef.current.getScrollHeight();
    const editRefClientHeight = editRef.current.getClientHeight();
    const editScrollTop = percent * (editRefScrollHeight - editRefClientHeight);

    if (editScrollTop < 30) {
      editRef.current.scrollTop(Math.floor(editScrollTop));
    } else {
      editRef.current.scrollTop(Math.ceil(editScrollTop));
    }
  };

  return (
    <div className={styles.container}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: "1px solid #ddd" }}
      />
      <div className={styles.content}>
        <div className={styles.edit}>
          <Scrollbars ref={editRef} onScroll={onEditScroll}>
            <Editor
              defaultConfig={editorConfig}
              value={html}
              onCreated={setEditor}
              onChange={(value) => onEditValueChange(value)}
              mode="default"
            />
          </Scrollbars>
        </div>
        <div className={styles.preview}>
          <Scrollbars autoHide ref={previewRef} onScroll={onPreviewScroll}>
            <div className={styles.previewScroll}>
              <Preview mackdown={text} />
            </div>
          </Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default EditPreview;

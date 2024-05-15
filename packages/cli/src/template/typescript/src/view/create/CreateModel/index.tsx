import React, { useState } from "react";
import { Modal, Input, DatePicker } from "antd";
import type { Moment } from "moment";
import styles from "./index.less";

interface IProps {
  visible: boolean;
  onCancel: Function;
  htmlCode: string;
}

const CreateModel: React.FC<IProps> = ({ visible, onCancel, htmlCode }) => {
  const [time, setTime] = useState<Moment | null>(null);
  const [keyword, setKeyword] = useState<string>("");

  const onChangeTime = (date: Moment | null) => {
    setTime(date);
  };

  const onDateOk = (value: Moment | null) => {
    setTime(value);
  };

  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onSubmit = () => {
    console.log(htmlCode, "htmlCode");
    console.log(keyword, "keyword");
    console.log(time?.valueOf(), "date");
    onCancel();
    setTime(null);
    setKeyword("");
  };

  return (
    <Modal
      title="新建文档"
      visible={visible}
      onOk={onSubmit}
      okText="创建"
      cancelText="取消"
      onCancel={() => onCancel()}
    >
      <div className={styles.container}>
        <div className={styles.title}>
          <span className={styles.label}>文章标题：</span>
          <Input
            className={styles.input}
            placeholder="请输入标题"
            value={keyword}
            onChange={(e) => onChangeKeyword(e)}
          />
        </div>
        <div className={styles.date}>
          <span className={styles.label}>创建时间：</span>
          <DatePicker
            showTime
            className={styles.input}
            placeholder="请选择日期"
            value={time}
            onChange={onChangeTime}
            onOk={onDateOk}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateModel;

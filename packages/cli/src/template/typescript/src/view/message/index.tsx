/*
 * @Description: 消息页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\message\index.tsx
 */
import { Button } from "antd";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./index.less";

const Message: React.FC = () => {
  // 接受 state 传参
  const navigate = useNavigate();

  const location = useLocation();

  const { from } = (location.state as any) || {};

  const onClickMessage = (index: number) => {
    navigate(`/about/message/detail?id=${index}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {[0, 1, 2].map((i) => {
          return (
            <div key={i} className={styles.item}>
              {from}
              <Button type="primary" onClick={() => onClickMessage(i)}>
                to detail
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Message;

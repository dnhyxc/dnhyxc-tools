/*
 * @Description: 消息页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\news\index.tsx
 */
import { Button } from "antd";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./index.less";

const News: React.FC = () => {
  // 接受 state 传参
  const navigate = useNavigate();

  const [search] = useSearchParams();

  const from = search.get("from");

  const onClickMessage = (index: number) => {
    navigate(`/about/news/detail?id=${index}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {[100, 200, 300].map((i) => {
          return (
            <div key={i} className={styles.item}>
              我从 {from} 来
              <Button type="primary" onClick={() => onClickMessage(i)}>
                详情
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default News;

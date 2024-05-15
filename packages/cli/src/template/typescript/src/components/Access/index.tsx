/*
 * @Description: 处理页面访问权限的组件
 * @Author: dnh
 * @Date: 2022-06-13 14:29:56
 * @LastEditors: dnh
 * @FilePath: \src\components\Access\index.tsx
 */
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import Header from "@/components/Header";
import styles from "./index.less";

interface IProps {
  allow: any;
  children?: ReactNode;
}

const Access: React.FC<IProps> = ({ allow, children }) => {
  const navigate = useNavigate();

  const onBack = () => {
    navigate("home");
  };

  return allow ? (
    <>{children}</>
  ) : (
    <div>
      <div className={styles.container}>
        <Header>Detail</Header>
        <div className={styles.wrap}>
          <div className={styles.content}>
            <p>暂无权限访问</p>
            <Button onClick={onBack} type="primary">
              返回首页
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Access;

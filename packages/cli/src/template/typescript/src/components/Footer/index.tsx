/*
 * @Description: 头部组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\Footer\index.tsx
 */
import React, { ReactNode } from "react";
import styles from "./index.less";

interface IProps {
  children?: ReactNode;
}

const Footer: React.FC<IProps> = ({ children }) => {
  return <div className={styles.footerWrap}>{children || "Footer"}</div>;
};

export default Footer;

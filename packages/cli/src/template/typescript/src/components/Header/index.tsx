/*
 * @Description: 头部组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\Header\index.tsx
 */
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import styles from "./index.less";

interface IProps {
  children?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  needLeft?: boolean;
}

const Header: React.FC<IProps> = ({
  children,
  left,
  right,
  needLeft = true,
}) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.herderWrap}>
      <div className={styles.left}>
        {needLeft &&
          (left || (
            <div className={styles.back} onClick={goBack}>
              <LeftOutlined />
            </div>
          ))}
        <div className={styles.child}>{children}</div>
      </div>
      {right && <div className={styles.right}>{right}</div>}
    </div>
  );
};

export default Header;

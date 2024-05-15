/*
 * @Description: 菜单组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\MenuList\index.tsx
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Layout } from "antd";
import { items } from "./config";
import styles from "./index.less";

const { Sider } = Layout;

const MenuList: React.FC = () => {
  const [selectMenu, setSelectMenu] = useState<string>("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const sliceName = pathname !== "/" ? pathname.slice(1) : pathname;
    if (sliceName === "/") {
      setSelectMenu("home");
      navigate("home");
    } else {
      const index = sliceName.indexOf("/", 1);
      if (index > -1) {
        const path = sliceName.slice(0, index);
        setSelectMenu(path);
      } else {
        setSelectMenu(sliceName);
      }
    }
    return () => {
      // console.log(pathname, "后置路由守卫");
    };
  }, [pathname]);

  const onSelectMenu = (value: { key: string }) => {
    setSelectMenu(value.key);
    navigate(value.key);
  };

  return (
    <Sider
      theme="light"
      trigger={null}
      collapsible
      width={180}
      className={styles.siderWrap}
    >
      <div className={styles.logo}>React Template</div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["home"]}
        selectedKeys={[selectMenu]}
        items={items}
        onClick={(e) => onSelectMenu(e)}
      />
    </Sider>
  );
};

export default MenuList;

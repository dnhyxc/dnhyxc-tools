/*
 * @Description: 布局组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\layout\index.tsx
 */
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import MenuList from "@/components/MenuList";
import Footer from "@/components/Footer";
import Decorator from "@/components/Decorator";
import styles from "./index.less";

const { Content } = Layout;

const AppLayout = () => {
  return (
    <div className={styles.container}>
      <MenuList />
      <Layout className={styles.layout}>
        <Content>
          <Outlet />
        </Content>
        <Footer />
      </Layout>
      <Decorator />
    </div>
  );
};

export default AppLayout;

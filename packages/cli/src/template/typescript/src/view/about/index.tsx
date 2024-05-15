/*
 * @Description: About 页面
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\about\index.tsx
 */
import { useEffect } from "react";
import { Button } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Content from "@/components/Content";
import Header from "@/components/Header";
import styles from "./index.less";

const About = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/about") {
      navigate("message", {
        state: {
          from: "state 传参 => 我从 message 来",
        },
      });
    }
  }, [pathname]);

  const toMessage = () => {
    navigate("message", {
      state: {
        from: "state 传参 => 我从 message 来",
      },
      replace: false, // 默认 replace 是 false
    });
  };

  const toNews = () => {
    navigate("news?from=news");
  };

  const goBack = () => {
    navigate(-1);
  };

  const headerLeft = () => {
    return (
      <div className={styles.left}>
        <Button onClick={goBack}>返回</Button>
      </div>
    );
  };

  const onAddItem = () => {
    console.log("添加～～～");
  };

  const headerRight = () => {
    return (
      <div className={styles.left}>
        <Button onClick={onAddItem}>添加</Button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Header needLeft left={headerLeft()} right={headerRight()}>
        About
      </Header>
      <Content>
        <div className={styles.wrap}>
          <Button type="primary" className={styles.btn} onClick={toMessage}>
            click show message
          </Button>
          <Button className={styles.btn} onClick={toNews}>
            click show news
          </Button>
          <Outlet />
        </div>
      </Content>
    </div>
  );
};

export default About;

/*
 * @Description: 路由配置
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\router\config.tsx
 */
import { lazy, Suspense, ReactNode } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { Spin } from "antd";
import AppLayout from "@/layout";
import Access from "@/components/Access";
import styles from "./index.less";

const Home = lazy(() => import("@/view/home"));
const Message = lazy(() => import("@/view/message"));
const About = lazy(() => import("@/view/about"));
const Detail = lazy(() => import("@/view/detail"));
const Login = lazy(() => import("@/view/login"));
const News = lazy(() => import("@/view/news"));
const CreateContent = lazy(() => import("@/view/create"));
const PreviewMackdown = lazy(() => import("@/view/preview"));
const Mackdown = lazy(() => import("@/view/mackdown"));

const lazyLoad = (children: ReactNode, needSpin = true): ReactNode => {
  return (
    <Suspense fallback={needSpin ? <Spin className={styles.loading} /> : null}>
      {children}
    </Suspense>
  );
};

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />, // 指定路由渲染容器
    children: [
      {
        path: "home",
        element: lazyLoad(<Home />),
      },
      {
        path: "about",
        element: lazyLoad(<About />),
        children: [
          {
            path: "message",
            element: lazyLoad(<Message />, false),
          },
          {
            path: "news",
            element: lazyLoad(<News />, false),
          },
        ],
      },
      {
        path: "create",
        element: lazyLoad(<CreateContent />),
      },
      {
        path: "preview",
        element: lazyLoad(<PreviewMackdown />),
      },
      {
        path: "mackdown",
        element: lazyLoad(<Mackdown />),
      },
      {
        path: "home/detail/:id",
        element: lazyLoad(<Detail />),
      },
      {
        path: "about/news/detail",
        element: lazyLoad(
          <Access allow>
            <Detail />
          </Access>
        ),
      },
      {
        path: "about/message/detail",
        element: lazyLoad(
          <Access allow={false}>
            <Detail />
          </Access>
        ),
      },
    ],
  },
  {
    path: "login",
    element: lazyLoad(<Login />),
  },
  {
    path: "*",
    element: <Navigate to="/" />, // 路由重定向
  },
];

export default routes;

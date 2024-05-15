/*
 * @Description: 路由组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\router\index.tsx
 */
import React from "react";
import { useRoutes, BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import routeConfig from "./config";

const RouterConfig = () => {
  return useRoutes(routeConfig);
};

interface IProps {
  children?: any;
}

const App: React.FC<IProps> = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <RouterConfig />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;

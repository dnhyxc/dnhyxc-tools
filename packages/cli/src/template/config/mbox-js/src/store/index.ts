/*
 * @Description: store
 * @Author: dnh
 * @Date: 2022-06-10 14:40:30
 * @LastEditors: dnh
 * @FilePath: \example\react\mobx\src\store\index.ts
 * @LastEditTime: 2022-06-10 14:52:26
 */
import { createContext, useContext } from "react";
import addMobx from "./add";
import detailMobx from "./detail";
import createMobx from "./create";

class RootStore {
  add = addMobx;

  detail = detailMobx;

  create = createMobx;
}

const store = new RootStore();

const Context = createContext(store);

export default function useStore() {
  return useContext(Context);
}

/*
 * @Description: AddMobx
 * @Author: dnh
 * @Date: 2022-06-10 14:40:48
 * @LastEditors: dnh
 * @FilePath: \example\react\mobx\src\store\add.ts
 * @LastEditTime: 2022-06-10 14:44:45
 */
import { makeAutoObservable, runInAction } from "mobx";

class AddMobx {
  constructor() {
    makeAutoObservable(this);
  }

  count = 0;

  timer: any = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }

  // runInAction，处理一部逻辑
  incrementAsync() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setTimeout(() => {
      runInAction(() => {
        this.count++;
      });
    }, 1000);
  }
}

export default new AddMobx();

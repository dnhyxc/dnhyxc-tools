/*
 * @Description: 详情数据管理
 * @Author: dnh
 * @Date: 2022-06-14 11:44:09
 * @LastEditors: dnh
 * @FilePath: \src\store\detail.ts
 */
import { makeAutoObservable } from "mobx";


class DetailStore {
  constructor() {
    makeAutoObservable(this);
  }

  list = [
    {
      name: "initName",
      id: 1,
    },
  ];

  initList() {
    this.list = [
      {
        name: "name1",
        id: 2,
      },
      {
        name: "name2",
        id: 3,
      },
      {
        name: "name3",
        id: 4,
      },
    ];
  }

  addItem(keyword) {
    this.list.unshift({
      name: keyword,
      id: this.list.length + 999,
    });
  }

  deleteItem(index) {
    const id = this.list.findIndex((i) => i.id === index);
    this.list.splice(id, 1);
  }

  deleteAllChecked(list) {
    const filterList = this.list.filter((i) => !list.includes(i.id));
    this.list = filterList;
  }
}

export default new DetailStore();

/*
 * @Description: 详情页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\detail\index.tsx
 */
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react";
import { Button, Checkbox, Input, message } from "antd";
import Content from "@/components/Content";
import Header from "@/components/Header";

import useStore from "@/store";

import styles from "./index.less";

const { Search } = Input;

const Detail = () => {
  const [checkList, setCheckList] = useState<number[]>([]);
  const [keyWord, setKeyWord] = useState<string>("");
  // 接收query传参
  const [search] = useSearchParams();
  const id = search.get("id");
  const { id: paramsId } = useParams();

  const { add, detail } = useStore();

  const onIncrement = () => {
    add.increment();
  };

  const onIncrementAsync = () => {
    add.incrementAsync();
  };

  const onDecrement = () => {
    add.decrement();
  };

  const onReset = () => {
    add.reset();
  };

  const onChangeKeyWord = (e: any) => {
    setKeyWord(e.target.value);
  };

  const onSearch = (value: string) => {
    if (value) {
      detail.addItem(value);
      setKeyWord("");
    } else {
      message.info("请输入内容再添加");
    }
  };

  const onInitList = () => {
    setCheckList([]);
    detail.initList();
  };

  const deleteItem = (index: number) => {
    const filterList = checkList.filter((i) => i !== index);
    setCheckList(filterList);
    detail.deleteItem(index);
  };

  const onDeleteAllChecked = () => {
    setCheckList([]);
    detail.deleteAllChecked(checkList);
  };

  const onSelect = (value: any) => {
    const checked = checkList.some((i) => i === value);
    if (checked) {
      const filterList = checkList.filter((i) => i !== value);
      setCheckList(filterList);
    } else {
      checkList.push(value);
      setCheckList([...checkList]);
    }
  };

  const onSelectAll = () => {
    const ids = detail.list.map((i) => i.id);
    if (ids.length === checkList.length) {
      setCheckList([]);
    } else {
      setCheckList(ids);
    }
  };

  return (
    <div className={styles.container}>
      <Header>Detail</Header>
      <Content>
        <div className={styles.wrap}>
          <div>详情ID为：{id || paramsId}</div>
          <div className={styles.countAction}>
            <h1>{add.count}</h1>
            <div className={styles.list}>
              <div className={styles.createWrap}>
                <Search
                  value={keyWord}
                  onChange={(e) => onChangeKeyWord(e)}
                  placeholder="请输入名称"
                  allowClear
                  enterButton="创建"
                  onSearch={onSearch}
                />
              </div>
              <div className={styles.actions}>
                <Button onClick={onIncrement}>点我加</Button>
                <Button onClick={onIncrementAsync}>异步加</Button>
                <Button onClick={onDecrement}>点我减</Button>
                <Button onClick={onReset}>重置</Button>
                <Button
                  type="primary"
                  onClick={onDeleteAllChecked}
                  disabled={checkList.length === 0}
                >
                  批量删除
                </Button>
                <Button type="primary" onClick={onInitList}>
                  重新获取LIST
                </Button>
              </div>
              {detail.list.length > 0 && (
                <div className={styles.checkAll}>
                  <Checkbox
                    className={styles.checkbox}
                    checked={
                      detail.list.length === checkList.length &&
                      checkList.length > 0
                    }
                    onChange={onSelectAll}
                  />
                  <span>全选</span>
                </div>
              )}
              {detail.list.map((i) => {
                return (
                  <div key={i.id} className={styles.item}>
                    <div className={styles.info}>
                      <Checkbox
                        className={styles.checkbox}
                        checked={checkList.includes(i.id)}
                        onChange={() => onSelect(i.id)}
                      />
                      <span>{i.name}</span>
                    </div>
                    <Button type="link" onClick={() => deleteItem(i.id)}>
                      删除
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default observer(Detail);

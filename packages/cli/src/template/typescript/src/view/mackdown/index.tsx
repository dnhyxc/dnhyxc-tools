import React from "react";
import { observer } from "mobx-react";
import useStore from "@/store";
import Header from "@/components/Header";
import Content from "@/components/Content";
import TuiEditor from "@/components/TuiEditor";

import styles from "./index.less";

interface IProps {}

const CreateArticle: React.FC<IProps> = () => {
  const { create } = useStore();

  const onGetMackdown = (mackdown: any) => {
    create.createMackdown(mackdown);
  };

  return (
    <div className={styles.container}>
      <Header>Create Article</Header>
      <Content needScroll={false}>
        <TuiEditor onGetMackdown={onGetMackdown} />
      </Content>
    </div>
  );
};

export default observer(CreateArticle);

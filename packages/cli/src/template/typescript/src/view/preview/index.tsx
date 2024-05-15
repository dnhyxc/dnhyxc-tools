import React from "react";
import useStore from "@/store";
import Header from "@/components/Header";
import Content from "@/components/Content";
import Preview from "@/components/Preview";

const CreateMackdown: React.FC = () => {
  const { create } = useStore();
  return (
    <div>
      <Header>Preview mackdown</Header>
      <Content>
        <Preview mackdown={create.mackdown} />
      </Content>
    </div>
  );
};

export default CreateMackdown;

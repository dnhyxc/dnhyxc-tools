import { makeAutoObservable } from 'mobx';

class CreateMobx {
  constructor() {
    makeAutoObservable(this);
  }

  mackdown = '';

  createMackdown(value: string) {
    this.mackdown = value;
  }

  clearMackdown() {
    this.mackdown = '';
  }
}

export default new CreateMobx();

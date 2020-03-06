import uniquid from "uniquid";

export default class List {
  constructor() {
    this.items = [];
  }
  addItem(count, unit, ingredient) {
    const item = {
      id: uniquid(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item;
  }
  deleteItem(id) {
    const start = this.items.findIndex(el => el.id === id);
    this.items.splice(start, 1);
  }
  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
  }
}

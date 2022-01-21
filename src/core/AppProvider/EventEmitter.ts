export class EventEmitter {
  constructor() {
    this.callbacks = {};
  }

  add = (event, cb) => {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(cb);
  };

  remove = (event, cb) => {
    const list = this.callbacks[event] || [];
    const index = list.findIndex((i) => i === cb);
    if (index < 0) {
      return;
    }
    this.callbacks[event].splice(index, 1);
  };

  emit = (event, data) => {
    let cbs = this.callbacks[event];
    if (cbs) {
      cbs.forEach((cb) => cb(data));
    }
  };
}

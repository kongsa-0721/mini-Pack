import { SyncHook, AsyncParallelHook } from "tapable";

class List {
  getRoutes() {}
}
class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"]),
    };
  }
  setSpeed(newSpeed) {
    // following call returns undefined even when you returned values
    this.hooks.accelerate.call(newSpeed);
  }

  useNavigationSystemPromise(source, target) {
    const routesList = new List();
    return this.hooks.calculateRoutes.promise(source, target, routesList).then((res) => {
      // res is undefined for AsyncParallelHook
      console.log("nice");
      return routesList.getRoutes();
    });
  }

  useNavigationSystemAsync(source, target, callback) {
    const routesList = new List();
    this.hooks.calculateRoutes.callAsync(source, target, routesList, (err) => {
      if (err) return callback(err);
      callback(null, routesList.getRoutes());
    });
  }
}

//注册事件
const car = new Car();
car.hooks.accelerate.tap("task1", () => {
  console.log("this is task1");
});

car.hooks.calculateRoutes.tapPromise("task2", (source, target) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(source, target);
    }, 3000);
    resolve();
  });
});
//触发事件
car.setSpeed();
car.useNavigationSystemPromise([1, 2, 3], "task2");

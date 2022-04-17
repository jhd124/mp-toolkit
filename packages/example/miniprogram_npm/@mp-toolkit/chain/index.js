module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1650199672545, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
/// <reference path="../node_modules/@mp-toolkit/mp-type/index.d.ts" />
const setup_1 = require("./setup");
exports.setup = setup_1.setup;
// import * as types from './types'

}, function(modId) {var map = {"./setup":1650199672546}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650199672546, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const chain_1 = require("./chain");
const event_1 = require("./event");
function setup(options) {
    const { eventNames } = options;
    const eventBus = new event_1.EventBus(eventNames || []);
    return function chain() {
        const instance = new chain_1.Chain(eventBus);
        console.log('instance', instance);
        return instance;
    };
    // const {
    //   eventNames = []
    // } = options
    // if(!eventBus){
    //   type A = O["eventDefine"] extends undefined ? {} : O["eventDefine"]
    //   type B = O["eventDefine"] extends undefined ? {} : O["eventDefine"]
    //   eventBus = new EventBus<B>(eventNames)
    // }
    // var c = 0
    // var e: EventDefine = {onIncrease: (n: number) => {
    //   c += 0
    // }}
}
exports.setup = setup;

}, function(modId) { var map = {"./chain":1650199672547,"./event":1650199672548}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650199672547, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = void 0;
const event_1 = require("./event");
function getIDGenerator() {
    let currentCount = 0;
    return () => currentCount++;
}
const IDGenerator = getIDGenerator();
class ComponentTreeNode {
    constructor(parent) {
        this.children = [];
        this.ID = IDGenerator();
        this.parent = parent;
    }
}
class Chain {
    constructor(eventBus) {
        this.refs = {};
        this.eventBus = eventBus;
    }
    app(option) {
        this.constructorType = 'App';
        return new ChainApp(option, this.eventBus);
    }
    page(option) {
        this.constructorType = 'Page';
        return new ChainPage(Object.assign(Object.assign({}, option), { $eventBus: this.eventBus }), this.eventBus);
    }
    component(option) {
        this.constructorType = 'Component';
        return new ChainComponent(option, this.eventBus);
    }
    // public registerEvents(){
    // }
    provide() {
    }
    consume() {
    }
    debounce() {
    }
    throttle() {
    }
    registerComponentTreeNode() {
    }
    removeComponentTreeNode() {
    }
}
exports.Chain = Chain;
class ChainApp {
    constructor(option, eventBus) {
        this.eventBus = eventBus;
        console.log('this.eventBus', eventBus, this.eventBus);
        this.option = Object.assign(Object.assign({}, option), { $eventBus: eventBus });
    }
    subscribeEvents(...args) {
        event_1.EventBus.prototype.addListener(...args);
        const { eventBus } = this;
        const { onLaunch, onUnload } = this.option;
        this.option.onLaunch = function (...onLaunchArgs) {
            eventBus.addListener(...args);
            onLaunch === null || onLaunch === void 0 ? void 0 : onLaunch.call(this, ...onLaunchArgs);
        };
        return this;
    }
    create() {
        return App(this.option);
    }
}
class ChainPage {
    constructor(option, eventBus) {
        this.eventBus = eventBus;
        this.option = option;
    }
    subscribeEvents(...args) {
        const { eventBus } = this;
        const { onLoad, onUnload } = this.option;
        this.option.onLoad = function (...onLoadArgs) {
            eventBus.addListener(...args);
            onLoad === null || onLoad === void 0 ? void 0 : onLoad.call(this, ...onLoadArgs);
        };
        this.option.onUnload = function (...onLoadArgs) {
            eventBus.removeListener(...args);
            onUnload === null || onUnload === void 0 ? void 0 : onUnload.call(this, ...onLoadArgs);
        };
        return this;
    }
    create() {
        return Page(this.option);
    }
}
class ChainComponent {
    constructor(option, eventBus) {
        this.eventBus = eventBus;
        this.option = Object.assign(Object.assign({}, option), { $eventBus: eventBus });
    }
    subscribeEvents(...args) {
        event_1.EventBus.prototype.addListener(...args);
        const { eventBus, option } = this;
        const { lifetimes } = option;
        if (lifetimes === null || lifetimes === void 0 ? void 0 : lifetimes.attached) {
            const originalAttached = lifetimes.attached;
            lifetimes.attached = function (...attachArgs) {
                const ret = originalAttached(...attachArgs);
                eventBus.addListener(...args);
                return ret;
            };
        }
        if (lifetimes === null || lifetimes === void 0 ? void 0 : lifetimes.detached) {
            const originalAttached = lifetimes.detached;
            lifetimes.detached = function (...detachArgs) {
                const ret = originalAttached(...detachArgs);
                eventBus.removeListener(...args);
                return ret;
            };
        }
        return this;
    }
    create() {
        return Page(this.option);
    }
}

}, function(modId) { var map = {"./event":1650199672548}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650199672548, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
class EventBus {
    constructor(eventNames) {
        this.pool = eventNames.reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: [] })), {});
    }
    clearEvent(eventName) {
        this.pool[eventName].length = 0;
    }
    addListener(eventName, handler) {
        this.pool[eventName].push(handler);
        return () => this.removeListener(eventName, handler);
    }
    removeListener(eventName, handler) {
        const handlers = this.pool[eventName];
        const targetIndex = handlers.findIndex(h => h === handler);
        handlers.splice(targetIndex, 1);
    }
    traverseListeners(eventName, visitor) {
        this.pool[eventName].forEach(listener => {
            visitor(listener);
        });
    }
    emit(eventName, ...args) {
        this.traverseListeners(eventName, function (listener) {
            listener(...args);
        });
    }
}
exports.EventBus = EventBus;
// export class EventBus<E extends EventPoolDefine> extends EventPool<E>{
//   public constructor(eventNames: Keys<E>){
//     super(eventNames)
//     console.log('this', this)
//   }
//   public emit<K extends keyof E>(eventName: K, args: Parameters<E[K]> ){
//     this.traverseListeners(eventName, function(listener){
//       listener(args)
//     })
//   }
// }
// setup<{onIncrease: (n: number) => void}>({
//   events: ['onIncrease']
// })

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1650199672545);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map
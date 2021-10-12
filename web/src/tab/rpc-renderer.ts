import {
  IPCRenderChannelCreate,
  IPCRenderChannelDelete,
  IPCRenderChannelTransport,
} from "./defs";
import { ipcRenderer } from "electron";

type ListenerFunction = (...args: Array<any>) => void;

export class RPCRenderer {
  private static isInit: boolean = RPCRenderer.initialize();
  private static rendererMap: Map<string, RPCRenderer> = new Map();

  public static initialize(): boolean {
    ipcRenderer.on(IPCRenderChannelTransport, (_, param) => {
      let func = RPCRenderer.rendererMap.get(param.to)?.listenerMap.get(param.msg);
      if (func) {
        func(...param.args);
      }
    });

    window.addEventListener("unload", RPCRenderer.cleanUp);

    return true;
  }

  private static cleanUp(): void {
    for (let [, channel] of RPCRenderer.rendererMap) {
      channel.unregister();
    }
    window.removeEventListener("unload", RPCRenderer.cleanUp);
  }

  public static register(id: string): RPCRenderer {
    const success = ipcRenderer.sendSync(IPCRenderChannelCreate, id);
    if (RPCRenderer.isInit && success === true) {
      const ret = new RPCRenderer(id);
      RPCRenderer.rendererMap.set(id, ret);
      return ret;
    } else if (success === false) {
      throw new Error(`id: ${id} exist`);
    } else {
      throw new Error(
        "can not communicate with RPCMain",
      );
    }
  }

  public static call(to: string, msg: string, ...args: Array<any>): any {
    return ipcRenderer.sendSync(IPCRenderChannelTransport, {
      to: to,
      msg: msg,
      args: args,
    });
  }

  protected readonly id: string;
  private listenerMap: Map<string, ListenerFunction>;

  private constructor(id: string) {
    this.id = id;
    this.listenerMap = new Map();
  }

  public on(msg: string, onFunction: ListenerFunction): void {
    if (!this.listenerMap.has(msg)) {
      this.listenerMap.set(msg, onFunction);
    } else {
      throw new Error(`message ${msg} has already been listened`);
    }
  }

  public unregister(): void {
    ipcRenderer.sendSync(IPCRenderChannelDelete, this.id);
    RPCRenderer.rendererMap.delete(this.id);
  }
}


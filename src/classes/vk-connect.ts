import { fromEvent, Observable } from "rxjs";
import { BridgeAdapter } from "../interfaces/bridge-adapter";
import { AndroidBridgeAdapter } from "./android-bridge-adapter";
import { EmptyBridgeAdapter } from "./empty-bridge-adapter";
import { IosBridgeAdapter } from "./ios-bridge-adapter";

export class VkConnect implements BridgeAdapter {
  readonly deviceBridgeAdapter: BridgeAdapter;
  readonly events: Observable<CustomEvent>;

  constructor(winRef: Window & any, adapter?: BridgeAdapter) {
    if (!winRef) {
      throw Error('window object required');
    }
    if (adapter) {
      this.deviceBridgeAdapter = adapter;
    } else if (winRef.AndroidBridge) {
      this.deviceBridgeAdapter = new AndroidBridgeAdapter(winRef.AndroidBridge);
    } else if (winRef && winRef.webkit && winRef.webkit.messageHandlers) {
      this.deviceBridgeAdapter = new IosBridgeAdapter(winRef.webkit.messageHandlers);
    } else {
      this.deviceBridgeAdapter = new EmptyBridgeAdapter();
    }

    this.events = fromEvent(winRef, "VKWebAppEvent");
  }

  send(handler: string, params: any = {}): void {
    this.deviceBridgeAdapter.send(handler, params);
  }

  supports(handler: string) {
    return this.deviceBridgeAdapter.supports(handler);
  }
}

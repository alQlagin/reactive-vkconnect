import { BridgeAdapter } from '../interfaces/bridge-adapter';
import { IosBridge } from '../interfaces/ios-bridge';
import { isFunction } from '../utils';

export class IosBridgeAdapter implements BridgeAdapter {
  constructor(private readonly bridge: IosBridge = {}) {}

  send(handler: string, params: any): void {
    if (this.supports(handler)) {
      this.bridge[handler].postMessage(params);
    }
  }

  supports(handler: string): boolean {
    return !!this.bridge && !!this.bridge[handler] && isFunction(this.bridge[handler].postMessage);
  }
}

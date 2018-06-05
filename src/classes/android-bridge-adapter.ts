import { AndroidBridge } from '../interfaces/android-bridge'
import { BridgeAdapter } from '../interfaces/bridge-adapter'
import { isFunction } from '../utils'

export class AndroidBridgeAdapter implements BridgeAdapter {
  constructor(private readonly bridge: AndroidBridge = {}) {}

  send(handler: string, params: any): void {
    if (this.supports(handler)) {
      this.bridge[handler](JSON.stringify(params))
    }
  }

  supports(handler: string): boolean {
    return !!this.bridge && isFunction(this.bridge[handler])
  }
}

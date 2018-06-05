import { BridgeAdapter } from '../interfaces/bridge-adapter'

export class EmptyBridgeAdapter implements BridgeAdapter {
  send(handler: string, params: any): void {
    return
  }

  supports(handler: string) {
    return true
  }
}

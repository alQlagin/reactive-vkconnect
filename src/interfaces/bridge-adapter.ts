export interface BridgeAdapter {
  send(handler: string, params: any): void

  supports(handler: string): boolean
}

import { Observable, Subject } from 'rxjs'
import { BridgeAdapter } from '../interfaces/bridge-adapter'
import { AndroidBridgeAdapter } from './android-bridge-adapter'
import { EmptyBridgeAdapter } from './empty-bridge-adapter'
import { IosBridgeAdapter } from './ios-bridge-adapter'

export class VkConnect implements BridgeAdapter {
  readonly deviceBridge: BridgeAdapter
  private event$ = new Subject<CustomEvent>()

  constructor(winRef: Window & any) {
    if (!winRef) {
      throw Error('window object required')
    }
    if (winRef.AndroidBridge) {
      this.deviceBridge = new AndroidBridgeAdapter(winRef.AndroidBridge)
    } else if (winRef && winRef.webkit && winRef.webkit.messageHandlers) {
      this.deviceBridge = new IosBridgeAdapter(winRef.webkit.messageHandlers)
    } else {
      this.deviceBridge = new EmptyBridgeAdapter()
    }

    winRef.addEventListener('VKWebAppEvent', (event: CustomEvent) => {
      this.event$.next(event)
    })
  }

  send(handler: string, params: any = {}): void {
    this.deviceBridge.send(handler, params)
  }

  supports(handler: string) {
    return this.deviceBridge.supports(handler)
  }

  get events(): Observable<CustomEvent> {
    return this.event$.asObservable()
  }
}

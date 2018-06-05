export interface IosBridge {
  [p: string]: { postMessage(p: any): void }
}

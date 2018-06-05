import { VkConnect } from "../src";
import { EmptyBridgeAdapter } from "../src/classes/empty-bridge-adapter";
import { AndroidBridgeAdapter } from "../src/classes/android-bridge-adapter";
import { IosBridgeAdapter } from "../src/classes/ios-bridge-adapter";
import { Observable } from "rxjs";
import SpyInstance = jest.SpyInstance;

test('VkConnect exported', () => {
  expect(VkConnect).toBeDefined();
});

test('VkConnect throws error if window undefined', () => {
  expect(() => new VkConnect(null)).toThrowError('window object required');
});

describe('VkConnect deviceBridge defined correct', () => {
  test('empty device bridge', () => {
    const vkConnect = new VkConnect({});
    expect(vkConnect.deviceBridge).toBeInstanceOf(EmptyBridgeAdapter);
  });
  test('android device bridge', () => {
    const vkConnect = new VkConnect({ AndroidBridge: true });
    expect(vkConnect.deviceBridge).toBeInstanceOf(AndroidBridgeAdapter);
  });
  test('empty device bridge', () => {
    const vkConnect = new VkConnect({ webkit: { messageHandlers: {} } });
    expect(vkConnect.deviceBridge).toBeInstanceOf(IosBridgeAdapter);
  });
});

describe('When VkConnect created', () => {
  let connect: VkConnect;
  let sendSpy: SpyInstance;
  beforeEach(() => {
    connect = new VkConnect(window);
    sendSpy = jest.spyOn(connect.deviceBridge, 'send');
  });

  describe('create event stream', () => {
    it('should be Rx.Observable', () => {
      expect(connect.events).toBeInstanceOf(Observable);
    });
    it('should emit data when dispatched from window', done => {
      const eventDetail = {};
      const event = new CustomEvent('VKWebAppEvent', { detail: eventDetail });
      connect.events.subscribe(e => {
        expect(e).toBe(event);
        expect(e.detail).toBe(eventDetail);
        done();
      }, done);
      window.dispatchEvent(event);
    });
  });

  it('should proxy send to device bridge', () => {
    const handler = 'test handler';
    const data = 'test data';
    connect.send(handler, data);
    expect(sendSpy).toBeCalledWith(handler, data);
  });
});

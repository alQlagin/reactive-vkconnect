import { VkConnect } from "../src";
import { EmptyBridgeAdapter } from "../src/classes/empty-bridge-adapter";
import { AndroidBridgeAdapter } from "../src/classes/android-bridge-adapter";
import { IosBridgeAdapter } from "../src/classes/ios-bridge-adapter";
import { Observable } from "rxjs";

jest.doMock("../src/classes/empty-bridge-adapter");
let winMock: Window & any;
beforeEach(() => {
  winMock = { ...window, _$_listeners: {} } as Window;
  winMock.addEventListener = jest.fn(function(event, fn) {
    this._$_listeners[event] = fn;
  });

  winMock.dispatchEvent = jest.fn(function(event: Event) {
    this._$_listeners[event.type](event);
  });

});
test("VkConnect exported", () => {
  expect(VkConnect).toBeDefined();
});

test("VkConnect throws error if window undefined", () => {
  expect(() => new VkConnect(null)).toThrowError("window object required");
});

describe("VkConnect deviceBridge defined correct", () => {
  test("empty device bridge", () => {
    const vkConnect = new VkConnect(winMock);
    expect(vkConnect.deviceBridge).toBeInstanceOf(EmptyBridgeAdapter);
  });
  test("android device bridge", () => {
    winMock.AndroidBridge = true;
    const vkConnect = new VkConnect(winMock);
    expect(vkConnect.deviceBridge).toBeInstanceOf(AndroidBridgeAdapter);
  });
  test("empty device bridge", () => {
    winMock.webkit = {
      messageHandlers: {}
    };
    const vkConnect = new VkConnect(winMock);
    expect(vkConnect.deviceBridge).toBeInstanceOf(IosBridgeAdapter);
  });
});

describe("When VkConnect created", () => {

  let connect;
  let sendSpy;
  beforeEach(() => {
    connect = new VkConnect(winMock);
    sendSpy = jest.spyOn(connect.deviceBridge, "send");
  });
  it("should attach event lister", () => {
    expect(winMock.addEventListener).toBeCalled();
  });
  describe("create event stream", () => {

    it("should be Rx.Observable", () => {
      expect(connect.events).toBeInstanceOf(Observable);
    });
    it("should emit data when dispatched from window", (done) => {
      const eventDetail = {};
      const event = new CustomEvent("VKWebAppEvent", { detail: eventDetail });
      connect.events.subscribe(
        (e) => {
          expect(e).toBe(event);
          expect(e.detail).toBe(eventDetail);
          done();
        },
        done
      );
      (winMock as Window).dispatchEvent(event);
    });
  });

  it("should proxy send to device bridge", () => {
    const handler = "test handler";
    const data = "test data";
    connect.send(handler, data);
    expect(sendSpy).toBeCalledWith(handler, data);
  });
});

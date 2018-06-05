# RxJs adaptation for @vkontakte/vkui-connect

## Requirements
[Сustom event](https://developer.mozilla.org/ru/docs/Web/API/CustomEvent) support with native api or [polyfill](https://www.npmjs.com/package/custom-event-polyfill)

## Install

```bash
npm i @shtrihpunktir/reactive-vkconnect
```

With node imports
```
const {VkConnect} = require("@shtrihpunktir/reactive-vkconnect");
const connect = new VkConnect(window);
```

Typings are included in package

From browser
```
<script src="node_modules/@shtrihpunktir/reactive-vkconnect/umd/reactive-vkconnect.min.js"></script>
<script>
    var connect = new ReactiveVkconnect.VkConnect(window);
</script>
```

## Usage
Send events
```js
connect.send("VKWebAppGetAuthToken", {
    "app_id": 6217559,
    "scope": "notify,friends"
});
```

Receive events from `connect.events` which is [Rx.Observable](http://reactivex.io/documentation/observable.html)
```js
var subscription = connect.events
    // subscribe to start listening events
    .subscribe(
        // success
        (event) => console.log(event),
        // during subscription, stops subscription
        (err) => handleError(err),
        // subscription completed
        () => console.log(conpleted)
    );

// use it to stop subscription
subscription.unsubscribe();
```

## Example

```
var adapter = {
  send: (handler, data) => {
    if (handler === 'VKWebAppGetAuthToken' ){
      log(`[EVENT DISPATCHED] VKWebAppGetAuthToken: ${JSON.stringify(data)}`);
      event = new CustomEvent('VKWebAppEvent', {
        detail: {
          type: 'VKWebAppAccessTokenReceived',
          data: {'authentication_token': `${data.app_id}${data.scope}`}
        }
      });
      window.dispatchEvent(event);
    }
  }
};
var connect = new ReactiveVkconnect.VkConnect(window, adapter);
var  GetAuthTokenResponse = connect.events
  .pipe(
    // restricts only specified events
    filter(event =>
      event.type === 'VKWebAppAccessTokenReceived' ||
      'VKWebAppAccessTokenFailed'
    ),
    // extract data from event
    map(event => {
      var {type, data} = event.detail;
      if (type === 'VKWebAppAccessTokenReceived') return {name: type, data};
      else throw {name: type, data};
    }),
    // unsubscribe when first data received
    take(1)
  );

GetAuthTokenResponse.subscribe(
  event => log(`[SUCCESS] ${event.name}: ${JSON.stringify(event.data)}`),
  event => log(`[ERROR] ${event.name}: ${JSON.stringify(event.data)}`),
  () => log('[COMPLETE]')
);

connect.send('VKWebAppGetAuthToken', {"app_id": 6217559, "scope": "notify,friends"});

```
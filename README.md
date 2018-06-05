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
        (event: CustomEvent) => console.log(event),
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
import {map, filter} from 'rxjs/operators';
// some code ....
const GetAuthTokenResponse = connect.events
    .pipe(
        // restricts only specified events
        filter(event =>
            event.type === 'VKWebAppAccessTokenReceived' ||
            'VKWebAppAccessTokenFailed'
        ),
        // expract data from event
        map(event => {
           if (event.type === 'VKWebAppAccessTokenReceived') return event.detail;
           else throw event.detail;
        }),
        // unsuscribes when firts data received
        take(1)
    );

connect.send('VKWebAppGetAuthToken', {"app_id": 6217559, "scope": "notify,friends"});
GetAuthTokenResponse.subscribe(
    data => console.log(data.access_token),
    error => console.error(error.error_description)
)
```
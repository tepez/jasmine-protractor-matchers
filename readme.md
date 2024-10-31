# jasmine-protractor-matchers
> Custom jasmine3 async matchers for writing cleaner e2e tests with protractor

[![npm version](https://badge.fury.io/js/%40tepez%2Fjasmine-protractor-matchers.svg)](https://badge.fury.io/js/%40tepez%2Fjasmine-protractor-matchers)

## Install

```
npm install --save @tepez/jasmine-protractor-matchers
```

## Usage

### Javascript
```js
const matchers = require('@tepez/jasmine-protractor-matchers');

beforeEach(() => {
    jasmine.addAsyncMatchers(matchers);
});
```

### Typescript

```typescript
import {matchers} from '@tepez/jasmine-protractor-matchers'

beforeEach(() => {
    jasmine.addAsyncMatchers(matchers);
});

it('should be displayed', async () => {
   await expectAsync($('#element')).toBeDisplayed(); 
});
```


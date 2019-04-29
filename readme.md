# jasmine-protractor-matchers
> Custom jasmine2 matchers for writing cleaner e2e tests with protractor

[![npm version](https://badge.fury.io/js/%40tepez%2Fjasmine-protractor-matchers.svg)](https://badge.fury.io/js/%40tepez%2Fjasmine-protractor-matchers)
[![Build Status](https://secure.travis-ci.org/tepez/jasmine-protractor-matchers.svg?branch=master)](http://travis-ci.org/tepez/jasmine-protractor-matchers)

## Install

```
npm install --save @tepez/jasmine-protractor-matchers
```

## Usage

### Javascript
```js
const matchers = require('@tepez/jasmine-protractor-matchers');

beforeEach(() => {
    jasmine.addMatchers(matchers);
});
```

### Typescript

```typescript
import {matchers} from '@tepez/jasmine-protractor-matchers'

beforeEach(() => {
    jasmine.addMatchers(matchers);
});
```
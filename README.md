# Live Alert BP Formatter ESlint

The ESlint message formatter for [live-alert-bp](https://github.com/semiromid/live-alert-bp)


##  Install
```shell
npm i live-alert-bp-formatter-eslint --save-dev
```

## How to use

```javascript
  liveAlert.open(
    liveAlertFormatterESlint(MessagesESLint)
  );
```


## Examples how to use

[Examples](https://github.com/semiromid/live-alert-bp#examples)

## API

```javascript
const formatterESlint = require("live-alert-bp-formatter-eslint");

formatterESlint(messages, user_style, filter)
```

* return:  formatted messages for [live-alert-bp](https://github.com/semiromid/live-alert-bp)

#### messages
* Type: `Array`
ESlint messages

#### user_style
* Type: `ObjectJSON`
Set custom style messages

Exmaple:
```javascript
  const style = {};	

  style.label = {
	error: { backgroundColor: '#ff0000', color: '#ffffff' },
	warning: { backgroundColor: 'yellow', color: '#000000' },
	info: { backgroundColor: '#90ee90', color: '#000000' }
  };

  style.file = 'color: #90ee90 !important; text-decoration: underline !important;';
	
  style.line = {
	field: 'color: #aaaaaa !important; padding-left: 7px !important;', 
	message: 'color: #ffffff !important; padding-left: 3px !important;'
  };
	
  style.column = {
	field: 'color: #aaaaaa !important; padding-left: 7px !important;', 
	message: 'color: #ffffff !important; padding-left: 3px !important;'
  };

  style.evidence = {
	field: 'color: #aaaaaa !important; display: block !important; padding-bottom: 8px !important;', 
	message: 'box-sizing: border-box !important; width: 100% !important; overflow-x: auto !important; color: #ffffff !important; display: inline-block !important; border: dashed 1px #b9b9b9 !important; padding: 20px !important;'
  };

  style.reason = {
	field: 'color: #aaaaaa !important; display: block !important;  padding-top: 3px !important;', 
		message: 'color: #ffffff !important;'
  };	

  style.ruleId = {
	field: 'color: #aaaaaa !important; display: block !important;  padding-top: 3px !important;', 
	message: 'color: #ffffff !important;',
	link: 'color: #beb6ff !important;'
  };
```

#### filter
* Type: `Array`
Message level filter. There is one parameter `warning`.

Example
```
  liveAlert.open(
    liveAlertFormatterESlint(MessagesESLint, {}, [`warning`])
  );
```

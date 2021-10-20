"use strict";

/*
    https://eslint.org/docs/user-guide/formatters/

	Example:

    let res = live_alert_formatter_eslint(live_alert_messages.ESLint, {}, ['warning']);
 */

var merge = require('lodash.merge');
var	fs = require('fs');
var	path = require('path');


module.exports = function (messages, user_style = {}, filter = []) {

	const formatted_messages = [];

	let style;
	let label_style;
	let label_message;

	style = getStyle(user_style);

	// Filters
	messages = (filter.includes('warning')) ? filterWarning(messages) : messages;
	
	messages.forEach(function(item){
		let file = path.relative(process.cwd(), item.filePath);

		item.messages.forEach(function(message){

			if(message.severity === 1){
		  		label_style = style.label.warning;
		  		label_message = 'Warning';
			}else
			if(message.severity === 2){
		  		label_style = style.label.error;
		  		label_message = 'Error';
			}

			let css = fs.readFileSync(file, 'utf8');

			if(css != null){
				css = showSourceCode(css, message.line, message.column, message.endColumn);
			}

			formatted_messages.push({ 
				label: { 
					style: label_style, 
					name: label_message 
				}, 
				message: 
					html_template('', file, style.file) 
					+
					html_template('Line:', message.line, style.line)		
					+
					html_template('Col:', message.column, style.column)	
					+
					html_template(' ', css, style.evidence)				
					+
					html_template('Reason:', message.message, style.reason)	
					+
					html_rule('Rule:', message.ruleId, style.ruleId)															
			});
		});  
	});

	return formatted_messages;
}


function html_template(field = '', message, style){
	if(message == undefined){
		return ''
	}else
	if(field != '' && message != ''){
		return 	'<span style="' + style.field + '">' + field + '</span>' + 
	       		'<span style="' + style.message + '">' + message + '</span>';
	}else 
	if(field == ''){
		return 	'<span style="' + style + '">' + message + '</span>';
	}
}


function html_rule(field = '', rule, style){
	const href = 'https://eslint.org/docs/rules/' + rule;

	if(rule == undefined){
		return '';
	}else
	if(field != '' && rule != ''){
		return 	'<span style="' + style.field + '">' + field + '</span>' + 
	       		'<span style="' + style.message + '">' + 
	       		    '<a style="' + style.link + '" href="' + href + '" target="_blank">'+rule+'</a>' + 
	       		'</span>';
	}else{
		return '';
	}
}


function getStyle(user_style){	
	const style_default = {};	

	style_default.label = {
		error: { backgroundColor: '#ff0000', color: '#ffffff' },
		warning: { backgroundColor: 'yellow', color: '#000000' },
		info: { backgroundColor: '#90ee90', color: '#000000' }
	};

	style_default.file = 'color: #90ee90 !important; text-decoration: underline !important;';
	
	style_default.line = {
		field: 'color: #aaaaaa !important; padding-left: 7px !important;', 
		message: 'color: #ffffff !important; padding-left: 3px !important;'
	};

	style_default.column = {
		field: 'color: #aaaaaa !important; padding-left: 7px !important;', 
		message: 'color: #ffffff !important; padding-left: 3px !important;'
	};

	style_default.evidence = {
		field: 'color: #aaaaaa !important; display: block !important; padding-bottom: 8px !important;', 
		message: 'box-sizing: border-box !important; width: 100% !important; overflow-x: auto !important; color: #ffffff !important; display: inline-block !important; border: dashed 1px #b9b9b9 !important; padding: 20px !important;'
	};

	style_default.reason = {
		field: 'color: #aaaaaa !important; display: block !important;  padding-top: 3px !important;', 
		message: 'color: #ffffff !important;'
	};	

	style_default.ruleId = {
		field: 'color: #aaaaaa !important; display: block !important;  padding-top: 3px !important;', 
		message: 'color: #ffffff !important;',
		link: 'color: #beb6ff !important;'
	};

	// Setting the user's style, if any	
	return merge(style_default, user_style);
}


function showSourceCode(css, error_line, error_column, endColumn){
  let 
    lines = css.split(/\r?\n/),
    start = Math.max(error_line - 3, 0),
    end = Math.min(error_line + 2, lines.length),
    list_code = [], 
    content = '';

  for (let i = start; i < end + 1; i++) {
    list_code.push({ line: i + 1, css: lines[i] });
  }

  list_code.forEach(function(item){
      if(item.line === error_line){

        let offset = 1;
        if(error_column > item.css.length){
          offset = 2;
        }

        if(endColumn === undefined){
        	endColumn = item.css.length;
        }

        let start_col = replaceSpaces(item.css.slice(0, error_column - offset));
		let end_col = replaceSpaces(item.css.slice(error_column - offset, endColumn));
		let end_line = replaceSpaces(item.css.slice(endColumn, item.css.length));        
        let css = error_mark(start_col, end_col, end_line);

        content = content + html_content(item.line, css);
      }else{

        content = content + html_content(item.line, '<span style="opacity: 0.5 !important;">' + replaceSpaces(item.css) + '</span>');
      }
  }); 
  
  return html_container(content);


  function error_mark(start_col, end_col = '', end_line = ''){
    return '<span style="opacity: 0.5 !important;">' + start_col + '</span>' + 
           '<span style="font-weight: bold !important; opacity: 1.0 !important;">' + end_col + '</span>' +
           '<span style="opacity: 0.5 !important;">' + end_line + '</span>';
  }


  function replaceSpaces(text){
    if(text === undefined){
       return '';
    }

    text = text.replace(/(\t)/g, '&ensp;&ensp;&ensp;&ensp;');

    text = text.replace(/(  )/g, '&ensp;&ensp;&ensp;&ensp;');

    return text.replace(/( )/g, '&ensp;');
  }


  function html_container(content){
    return `
    <span style="display: inline-grid !important; grid-template-columns: auto auto !important; padding: 0px !important; grid-row-gap: 3px !important;"> 
      ${content}
    </span>`;
  }


  function html_content(line, css){
   return `
    <span style="border-right: 1px solid #ffffff !important; padding-right: 5px !important; text-align: right !important; opacity: 0.5 !important;">
      ${line}
    </span>

    <span style="padding-left: 5px !important; text-align: left !important;">
      ${css}
    </span>`;
  }
}


function filterWarning(messages){
	let res = [];

	messages.forEach(function(item, index){
		let result = item.messages.filter(message => message.severity !== 1);

		if(result.length === 0){
			return;
		}

		let arr = messages[index];

		arr.messages = result;
		
		res.push(arr);
	});

	return res;
}
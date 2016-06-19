'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sockets = function () {
	function Sockets(listeners) {
		_classCallCheck(this, Sockets);

		this._io = io(location.host);
		this._listeners = listeners;

		this._bindEvents();
	}

	_createClass(Sockets, [{
		key: '_bindEvents',
		value: function _bindEvents() {
			for (var key in this._listeners) {
				console.log('REGISTER listener: ' + key);
				this._io.on(key, this._listeners[key]);
			}
		}
	}]);

	return Sockets;
}();

;

var Parser = function () {
	function Parser() {
		_classCallCheck(this, Parser);

		this._output = document.querySelector('.js-output');
		this._itemTemplate = document.querySelector('.js-item-template');
		this._parseTemplate();
	}

	_createClass(Parser, [{
		key: '_parseTemplate',
		value: function _parseTemplate() {
			var source = this._itemTemplate.innerHTML;
			this._template = Handlebars.compile(source);
		}
	}, {
		key: 'insertItem',
		value: function insertItem(details) {
			var item = document.createElement('li');

			item.innerHTML = this._template({
				sender: details.source,
				time: details.time,
				msg: details.event,
				msgMode: details.status
			});

			this._output.appendChild(item);
			window.scrollTo(0, document.body.scrollHeight);
		}
	}]);

	return Parser;
}();

var parser = new Parser();

new Sockets({
	event: function event(data) {
		console.log('event received', data);
		parser.insertItem(data);
	}
});

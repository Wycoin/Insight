'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sockets = function () {
	function Sockets(listeners) {
		_classCallCheck(this, Sockets);

		var url = 'ws://localhost:2340/notifications/ws';
		this._io = new WebSocket(url);

		this._listeners = listeners;
	}

	_createClass(Sockets, [{
		key: '_bindEvents',
		value: function _bindEvents() {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this._listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _step$value = _slicedToArray(_step.value, 2);

					var key = _step$value[0];
					var listener = _step$value[1];

					this._io['on' + key] = listener;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
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
			var source = $("#entry-template").html();
			this._template = Handlebars.compile(source);
		}
	}, {
		key: 'insertItem',
		value: function insertItem() {
			var item = document.createElement('li');
			item.innerHTML = this._template({
				sender: '192.168.3.4'
			});
			this.output.appendChild(item);
		}
	}]);

	return Parser;
}();

new Sockets({
	message: function message(msg) {
		console.log(msg);
	},
	open: function open() {
		console.log('open');
	}
});

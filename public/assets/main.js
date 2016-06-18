'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

console.log('init');

var Sockets = function () {
  function Sockets(listeners) {
    _classCallCheck(this, Sockets);

    var url = 'ws://' + location.host + '/notifications/ws';
    this._io = new WebSocket(url);
    this._listeners = listeners;

    this._bindEvents();
  }

  _createClass(Sockets, [{
    key: '_bindEvents',
    value: function _bindEvents() {
      for (var key in this._listeners) {
        console.log('REGISTER on' + key);
        this._io['on' + key] = this._listeners[key];
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
    key: '_timestampToDate',
    value: function _timestampToDate(timestamp) {
      var d = new Date(timestamp);
      return d.toString('yyyy-MM-dd');
    }
  }, {
    key: 'insertItem',
    value: function insertItem(details) {
      var item = document.createElement('li');
      var time = this._timestampToDate(details.Time);

      item.innerHTML = this._template({
        sender: details.Source,
        time: time,
        msg: details.Event,
        msgMode: details.Status
      });

      this._output.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    }
  }]);

  return Parser;
}();

var parser = new Parser();

new Sockets({
  message: function message(res) {
    var data = JSON.parse(res.data);
    parser.insertItem(data);
  },
  open: function open() {
    console.log('open');
  }
});

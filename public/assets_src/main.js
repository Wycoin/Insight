class Sockets {
    constructor(listeners){
        var url = 'ws://localhost:2340/notifications/ws';
        this._io = new WebSocket(url);

        this._listeners = listeners
    }

    _bindEvents(){
    	for(const [key, listener] of this._listeners){
    		this._io[`on${key}`] = listener;
    	}
    }
};

class Parser {
	constructor(){
		this._output = document.querySelector('.js-output');
		this._itemTemplate = document.querySelector('.js-item-template');
		this._parseTemplate();
	}

	_parseTemplate(){
		const source = this._itemTemplate.innerHTML;
		this._template = Handlebars.compile(source);
	}

	insertItem(details){
		const item = document.createElement('li');
		item.innerHTML = this._template({
			sender: '192.168.3.4'
		});
		this.output.appendChild(item);
	}
}

const parser = new Parser();

new Sockets({
	message(msg){
		console.log(msg);
		parser.insertItem();
	},
	open(){
		console.log('open');
	}
});
class Sockets {
    constructor(listeners){
        this._io = io(location.host);
        this._listeners = listeners;

        this._bindEvents();
    }

    _bindEvents(){
    	for(const key in this._listeners){
            console.log('REGISTER listener: '+key);
    		this._io.on(key, this._listeners[key]);
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
			sender: details.source,
            time: details.time,
            msg: details.event,
            msgMode: details.status
		});

        this._output.appendChild(item);
        window.scrollTo(0,document.body.scrollHeight);
	}
}

const parser = new Parser();

new Sockets({
	event(data){
		console.log('event received', data);
		parser.insertItem(data);
	}
});
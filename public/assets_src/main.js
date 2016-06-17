console.log('init');

class Sockets {
    constructor(listeners){
        var url = 'ws://localhost:2340/notifications/ws';
        this._io = new WebSocket(url);
        this._listeners = listeners;

        this._bindEvents();
    }

    _bindEvents(){
    	for(const key in this._listeners){
            console.log('REGISTER on'+key);
    		this._io[`on${key}`] = this._listeners[key];
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

    _timestampToDate(timestamp){
        const d = new Date(timestamp);
        return d.toString('yyyy-MM-dd');
    }

	insertItem(details){
		const item = document.createElement('li');
        const time = this._timestampToDate(details.Time);

		item.innerHTML = this._template({
			sender: details.Source,
            time,
            msg: details.Event,
            msgMode: details.Status
		});

        this._output.appendChild(item);
        window.scrollTo(0,document.body.scrollHeight);
	}
}

const parser = new Parser();

new Sockets({
	message(res){
		const data = JSON.parse(res.data);
		parser.insertItem(data);
	},
	open(){
		console.log('open');
	}
});
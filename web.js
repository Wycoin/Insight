const express = require('express'); 
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser')

const port = process.env.PORT || 9000;

app.use(bodyParser());
app.use('/', express.static('public'));

app.post('/events', (req, res) => {
	console.log('event received', req.body);

	const body = req.body;
	const statusOptions = ['success', 'error', 'warning', 'info'];

	if(typeof body.source === 'undefined' ||
		typeof body.event === 'undefined' || 
		typeof body.status === 'undefined') {
		res.status(400);
		res.json({
			succcess: false,
			message: 'need a source, event and status property.'
		});
		return;
	}

	if(statusOptions.indexOf(body.status) === -1){
		res.status(400);
		res.json({
			succcess: false,
			message: 'status needs to be success, error, warning or info.'
		});
		return;
	}

	const d = new Date();
	
	io.sockets.emit('event', {
		source: body.source,
		time: d.toString('yyyy-MM-dd'),
		event: body.event,
		status: body.status
	});
	
	res.json({
		succcess: true
	});
});

io.on('connection', (socket) => {
	console.log('a user connected');
});

http.listen(port, () => {
	console.log('listening on *:'+port);
});
import express from 'express';

const app = express();

app.listen(3000, () => {
	console.log(
		'Server has been initializated! 🚀 Running at http://localhost:3000'
	);
});

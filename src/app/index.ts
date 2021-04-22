import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

import './services/passport';
import router from './router';

const app = express();

const mongoURI = 'mongodb+srv://joon:1111@cluster0.bffbk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// morgan is log in terminal about incoming request
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoURI, {
  useUnifiedTopology: false,
  useNewUrlParser: true,
});

router(app);

const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);

export { app };


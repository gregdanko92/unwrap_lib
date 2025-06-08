import express, {Application} from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

import bookRoutes from './routes/bookRoutes';
import customerRoutes from './routes/customerRoutes';
import borrowRoutes from './routes/borrowRoutes';
import testRoutes from './routes/testRoutes'


const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as mongoose.ConnectOptions);

// Routes
app.use('/books', bookRoutes);
app.use('/customers', customerRoutes);
app.use('/borrow', borrowRoutes);
app.use('/test', testRoutes)

app.listen(3000, () => {
    console.log('library api running port 3000');
});

import express, { Application } from 'express';
import bodyParser from 'body-parser';

import bookRoutes from './routes/bookRoutes';
import customerRoutes from './routes/customerRoutes';
import borrowRoutes from './routes/borrowRoutes';
import resetRoutes from './routes/resetRoutes';

const app: Application = express();
app.use(bodyParser.json());

app.use('/api', bookRoutes);
app.use('/api', customerRoutes);
app.use('/api', borrowRoutes);
app.use('/api', resetRoutes);

app.listen(3000, () => {
    console.log('Library API running on port 3000');
});

export default app;

const express = require('express');
const morgan = require('morgan');


const userRoutes = require('./routes/user.routes');


const app = express();
app.use(express.json());
app.use(morgan('dev'));


app.get('/', (_req, res) => {
res.json({ ok: true, message: 'API is running' });
});


app.use('/api/users', userRoutes);


// Global error handler (basic)
app.use((err, _req, res, _next) => {
console.error(err);
res.status(err.status || 500).json({ error: err.message || 'Server error' });
});


module.exports = app;
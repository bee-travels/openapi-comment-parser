const swaggerUi = require('swagger-ui-express');
const express = require('express');

const parseComments = require('../../dist/openapi-comment-parser');

const petRouter = require('./routes/pet');
const storeRouter = require('./routes/store');
const userRouter = require('./routes/user');
const definition = require('./openapi-definition');

const app = express();
const PORT = 3000;

// Body parsing.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const spec = parseComments(definition);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

app.use('/pet', petRouter);
app.use('/store', storeRouter);
app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

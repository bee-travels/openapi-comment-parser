const path = require('path');

const swaggerUi = require('swagger-ui-express');
const express = require('express');

let openapi = require('openapi-comment-parser');
let openapiUI = require('openapi-ui-express');
if (process.env.LOCAL_DEVELOPMENT) {
  openapi = require('../../dist/openapi-comment-parser');
  openapiUI = require('../../openapi-ui-express');
}

const petRouter = require('./routes/pet');
const storeRouter = require('./routes/store');
const userRouter = require('./routes/user');

const LOGO_PATH = path.join(__dirname, 'download.svg');

const app = express();
const PORT = 4000;

// Body parsing.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const spec = openapi();

app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
app.use('/v2/api-docs', openapiUI(spec, { logo: LOGO_PATH }));

app.use('/pet', petRouter);
app.use('/store', storeRouter);
app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

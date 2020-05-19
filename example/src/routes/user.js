const { Router } = require('express');

const router = Router();

/**
 * POST /user
 * @tag user
 * @summary Create user
 * @description This can only be done by the logged in user.
 * @operationId createUser
 * @bodyDescription Created user object
 * @bodyContent {User} application/json
 * @bodyRequired
 * @response default - successful operation
 */
router.post('/', async (req, res, next) => {
  res.end();
});

/**
 * POST /user/createWithArray
 * @tag user
 * @summary Creates list of users with given input array
 * @operationId createUsersWithArrayInput
 * @bodyDescription List of user object
 * @bodyContent {User[]} application/json
 * @bodyRequired
 * @response default - successful operation
 */
router.post('/createWithArray', async (req, res, next) => {
  res.end();
});

/**
 * POST /user/createWithList
 * @tag user
 * @summary Creates list of users with given input array
 * @operationId createUsersWithListInput
 * @bodyDescription List of user object
 * @bodyContent {User[]} application/json
 * @bodyRequired
 * @response default - successful operation
 */
router.post('/createWithList', async (req, res, next) => {
  res.end();
});

/**
 * GET /user/{username}
 * @tag user
 * @summary Get user by user name
 * @operationId getUserByName
 * @pathParam {string} username - The name that needs to be fetched. Use user1 for testing.
 * @response 200 - successful operation
 * @responseContent {User} 200.application/json
 * @responseContent {User} 200.application/xml
 * @response 400 - Invalid username supplied
 * @response 404 - User not found
 */
router.get('/:username', async (req, res, next) => {
  res.end();
});

/**
 * PUT /user/{username}
 * @tag user
 * @summary Updated user
 * @description This can only be done by the logged in user.
 * @operationId updateUser
 * @pathParam {string} username - name that need to be updated
 * @bodyDescription Updated user object
 * @bodyContent {User} application/json
 * @bodyRequired
 * @response 400 - Invalid user supplied
 * @response 404 - User not found
 */
router.put('/:username', async (req, res, next) => {
  res.end();
});

/**
 * DELETE /user/{username}
 * @tag user
 * @summary Delete user
 * @description This can only be done by the logged in user.
 * @operationId deleteUser
 * @pathParam {string} username - The name that needs to be deleted
 * @response 400 - Invalid username supplied
 * @response 404 - User not found
 */
router.delete('/:username', async (req, res, next) => {
  res.end();
});

/**
 * GET /user/login
 * @tag user
 * @summary Logs user into the system
 * @operationId loginUser
 * @queryParam {string} username - The user name for login
 * @queryParam {string} password - The password for login in clear text
 * @response 200 - successful operation
 * @responseHeader {date-time} 200.X-Expires-After - date in UTC when token expires
 * @responseHeader {int32} 200.X-Rate-Limit - calls per hour allowed by the user
 * @responseContent {string} 200.application/json
 * @responseContent {string} 200.application/xml
 * @response 400 - Invalid username/password supplied
 */
router.get('/login', async (req, res, next) => {
  res.end();
});

/**
 * GET /user/logout
 * @tag user
 * @summary Logs out current logged in user session
 * @operationId logoutUser
 * @response default - successful operation
 */
router.get('/logout', async (req, res, next) => {
  res.end();
});

module.exports = router;

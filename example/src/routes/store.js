const { Router } = require('express');

const router = Router();

/**
 * GET /store/inventory
 * @tag store
 * @summary Returns pet inventories by status
 * @description Returns a map of status codes to quantities
 * @operationId getInventory
 * @response 200 - successful operation
 * @responseContent {Inventory} 200.application/json
 * @security ApiKey
 */
router.get('/inventory', async (req, res, next) => {
  res.end();
});

/**
 * GET /store/order/{orderId}
 * @tag store
 * @summary Find purchase order by ID
 * @description For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
 * @operationId getOrderById
 * @pathParam {OrderID} orderId - ID of pet that needs to be fetched
 * @response 200 - successful operation
 * @responseContent {Order} 200.application/json
 * @responseContent {Order} 200.application/xml
 * @response 400 - Invalid ID supplied
 * @response 404 - Order not found
 */
router.get('/order/:orderId', async (req, res, next) => {
  res.end();
});

/**
 * DELETE /store/order/{orderId}
 * @tag store
 * @summary Delete purchase order by ID
 * @description For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
 * @operationId deleteOrder
 * @pathParam {OrderID} orderId - ID of the order that needs to be deleted
 * @response 400 - Invalid ID supplied
 * @response 404 - Order not found
 */
router.delete('/order/:orderId', async (req, res, next) => {
  res.end();
});

/**
 * POST /store/order
 * @tag store
 * @summary Place an order for a pet
 * @operationId placeOrder
 * @bodyDescription order placed for purchasing the pet
 * @bodyContent {Order} application/json
 * @bodyRequired
 * @response 200 - successful operation
 * @responseContent {Order} 200.application/json
 * @responseContent {Order} 200.application/xml
 * @response 400 - Invalid Order
 */
router.post('/order', async (req, res, next) => {
  res.end();
});

module.exports = router;

const { Router } = require('express');

const router = Router();

/* block comments aren't parsed */

/**
 * Doc comments are only parsed if they have `METHOD /path` at the top of the
 * comment.
 */

/**
 * For example, this comment is ignored.
 * GET /hello/world
 * @summary Says hello
 * @response 200 - OK
 */

/**
 * POST /pet
 * @tag pet
 * @summary Add a new pet to the store
 * @operationId addPet
 * @bodyDescription Pet object that needs to be added to the store
 * @bodyContent {Pet} application/json
 * @bodyContent {Pet} application/xml
 * @bodyRequired
 * @response 405 - Invalid input
 * @security PetstoreAuth.write:pets
 * @security PetstoreAuth.read:pets
 */
router.post('/', async (req, res, next) => {
  res.end();
});

/**
 * PUT /pet
 * @tag pet
 * @summary Update an existing pet
 * @operationId updatePet
 * @bodyDescription Pet object that needs to be added to the store
 * @bodyContent {Pet} application/json
 * @bodyContent {Pet} application/xml
 * @bodyRequired
 * @response 400 - Invalid ID supplied
 * @response 404 - Pet not found
 * @response 405 - Validation exception
 * @security PetstoreAuth.write:pets
 * @security PetstoreAuth.read:pets
 */
router.put('/', async (req, res, next) => {
  res.end();
});

/**
 * GET /pet/findByStatus
 * @tag pet
 * @summary Finds Pets by status
 * @description Multiple status values can be provided with comma separated strings
 * @operationId findPetsByStatus
 * @queryParam {StatusEnum[]} status - Status values that need to be considered for filter
 * @response 200 - Invalid status value
 * @responseContent {Pet[]} 200.application/json
 * @responseContent {Pet[]} 200.application/xml
 * @response 400 - successful operation
 * @security PetstoreAuth.write:pets
 * @security PetstoreAuth.read:pets
 */
router.get('/findByStatus', async (req, res, next) => {
  res.end();
});

/**
 * GET /pet/findByTags
 * @deprecated
 * @tag pet
 * @summary Finds Pets by tags
 * @description 'Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.'
 * @operationId findPetsByTags
 * @response 200 - successful operation
 * @responseContent {Pet[]} 200.application/json
 * @responseContent {Pet[]} 200.application/xml
 * @response 400 - Invalid tag value
 * @security PetstoreAuth.write:pets
 * @security PetstoreAuth.read:pets
 */
router.get('/findByTags', async (req, res, next) => {
  res.end();
});

/**
 * GET /pet/{petId}
 * @tag pet
 * @summary Find pet by ID
 * @description Returns a single pet
 * @operationId getPetById
 * @pathParam {int64} petId - ID of pet to return
 * @response 200 - successful operation
 * @responseContent {Pet} 200.application/json
 * @responseContent {Pet} 200.application/xml
 * @response 400 - Invalid ID supplied
 * @response 404 - Pet not found
 * @security ApiKey
 */
router.get('/:petId', async (req, res, next) => {
  res.format({
    'application/xml': () => {
      res.send(`<pet><id>${req.params.petId}</id></pet>`);
    },
    'application/json': () => {
      res.send({ id: req.params.petId });
    },
  });
});

/**
 * POST /pet/{petId}
 * @tag pet
 * @summary Updates a pet in the store with form data
 * @operationId updatePetWithForm
 * @pathParam {int64} petId - ID of pet that needs to be updated
 * @bodyContent {UpdatePetObject} application/x-www-form-urlencoded
 * @response 405 - Invalid input
 * @security PetstoreAuth.write:pets
 * @security PetstoreAuth.read:pets
 */
router.post('/:petId', async (req, res, next) => {
  res.end();
});

/**
 * DELETE /pet/{petId}
 * @tag pet
 * @summary Deletes a pet
 * @operationId deletePet
 * @headerParam {string} [apikey]
 * @pathParam {int64} petId - Pet id to delete
 * @response 400 - Invalid ID supplied
 * @response 404 - Pet not found
 * @security PetstoreAuth.write:pets
 * @security PetstoreAuth.read:pets
 */
router.delete('/:petId', async (req, res, next) => {
  res.end();
});

/**
 * POST /pet/{petId}/uploadImage
 * @tag pet
 * @summary uploads an image
 * @operationId uploadFile
 * @pathParam {int64} petId - ID of pet to update
 * @bodyContent {UploadPetImageObject} multipart/form-data
 * @response 200 - successful operation
 * @responseContent {ApiResponse} 200.application/json
 * @security PetstoreAuth.write:pets
 * @security PetstoreAuth.read:pets
 */
router.post('/:petId/uploadImage', async (req, res, next) => {
  res.end();
});

module.exports = router;

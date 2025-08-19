const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Upload + create
router.post(
  '/',
  productController.uploadProductImage,
  productController.addProduct
);

// GET, PATCH, DELETE
router.get('/', productController.getAllProducts);
router.patch('/:id', productController.uploadProductImage, productController.updateProduct);
router.patch('/:id/status', productController.updateProductStatus);
router.get('/:id', productController.getProductById);

module.exports = router;

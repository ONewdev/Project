const express = require('express');
const router = express.Router();
const path = require('path');
const ctrl = require(path.join(__dirname, '..', 'controllers', 'materialsController'));

router.get('/', ctrl.getAllMaterials);
router.get('/find', ctrl.findMaterial);
router.get('/:id', ctrl.getMaterialById);

router.post('/', ctrl.uploadMaterialImage, ctrl.addMaterial);
router.put('/:id', ctrl.uploadMaterialImage, ctrl.updateMaterial);

router.delete('/:id', ctrl.deleteMaterial);
router.delete('/:id/image', ctrl.deleteMaterialImage);

module.exports = router;

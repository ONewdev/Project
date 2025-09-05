const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportsController');

// Sales revenue from approved payments
router.get('/sales', ctrl.getSales);
router.get('/sales/csv', ctrl.exportSalesCSV);
router.get('/sales/pdf', ctrl.exportSalesPDF);

// Materials usage and estimated cost
router.get('/materials', ctrl.getMaterials);
router.get('/materials/csv', ctrl.exportMaterialsCSV);
router.get('/materials/pdf', ctrl.exportMaterialsPDF);

// Orders count breakdown
router.get('/orders', ctrl.getOrders);
router.get('/orders/csv', ctrl.exportOrdersCSV);
router.get('/orders/pdf', ctrl.exportOrdersPDF);

// Profit = revenue - estimated COGS
router.get('/profit', ctrl.getProfit);
router.get('/profit/csv', ctrl.exportProfitCSV);
router.get('/profit/pdf', ctrl.exportProfitPDF);

module.exports = router;

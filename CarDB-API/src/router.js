const express = require("express");
const router = express.Router();
const controller = require("./controller");

/*
* @swagger
* /api/:
*   get:
*     summary: Get the main page
*/
router.get("/", controller.getCars);
router.get("/total", controller.getTotalCars);

module.exports = router;
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
router.post("/add", controller.addCars);
router.patch("/edit/:id", controller.editCars);
router.delete("/delete/:id", controller.deleteCars);
router.post("/filterSearch", controller.getCars);
router.get("/search", controller.searchCars);
router.get("/total", controller.getTotalCars);

module.exports = router;
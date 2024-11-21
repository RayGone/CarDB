const express = require("express");
const router = express.Router();

const controller_path = `./${process.env.USE_API}/controller`;
const controller = require(controller_path);

//================================
///----- Swagger Schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     Filter:
 *       type: object
 *       properties:
 *         field:
 *           type: string
 *           enum: [ model_year, acceleration, horsepower, mpg, weight, cylinders, displacement]
 *           example: model_year
 *         ops:
 *           type: string
 *           enum: ['<', '>', '<=', '>=', '==', '!=']
 *           example: '<'
 *         value:
 *           type: number
 *           example: 90
 *       required:
 *         - field
 *         - ops
 *         - value
 * 
 *     FilterModel:
 *       type: object
 *       required:
 *         - page
 *         - limit
 *         - order
 *         - orderBy
 *       properties:
 *         filter:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Filter'
 *           default: []
 *         search:
 *           type: string
 *           default: ''
 *         order:
 *           enum: ['asc', 'desc']
 *           default: 'asc'
 *           type: string
 *         orderBy:
 *           enum: [ id, name, origin, model_year, acceleration, horsepower, mpg, weight, cylinders, displacement]
 *           default: 'id'
 *           type: string
 *         page:
 *           type: number
 *           default: 0
 *         limit:
 *           type: number
 *           default: 5
 * 
 *     Car:
 *       type: object
 *       required:
 *         - name
 *         - origin
 *         - model_year
 *       properties:
 *         id: 
 *           type: number;
 *         name: 
 *           type: string;
 *         origin: 
 *           type: string;
 *         model_year: 
 *           type: number;
 *         acceleration: 
 *           type: number;
 *         horsepower: 
 *           type: number;
 *         mpg: 
 *           type: number;
 *         weight: 
 *           type: number;
 *         cylinders: 
 *           type: number;
 *         displacement: 
 *           type: number;
 * 
 *     CarData:
 *       type: object
 *       properties:
 *         cars:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Car'
 *         total:
 *           type: number  
 * 
 *     Total:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 */

//================================
///----- Routes

/**
 * @swagger
 * /api:
 *   get:
 *     summary:  Get a list of cars with pagination, ordering and search applied
 *     tags: 
 *       - Cars
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Name / Origin filter by search key
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           default: 'id'
 *           enum: [ id, name, origin, model_year, acceleration, horsepower, mpg, weight, cylinders, displacement]
 *         description: Attribute of the car to use to sort the return data
 *         required: true
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           default: 'asc'
 *           enum: ['asc', 'desc']
 *         description: Sort order of return data
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 0
 *         description: Current page in pagination
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 5
 *         description: Number of data rows in current page
 *         required: true
 *     responses:
 *       200:
 *         description: Successful response
 *         content: 
 *           application/json: 
 *             examples:
 *               Chevrolet Chevelle Malibu:
 *                 value:
 *                   cars: {"name":"chevrolet chevelle malibu","mpg":18.0,"cylinders":8,"displacement":307.0,"horsepower":130.0,"weight":3504,"acceleration":12.0,"model_year":70,"origin":"usa","id":1}
 *                   total: 1
 *             schema: 
 *               $ref: '#/components/schemas/CarData'
 *       500:
 *         description: Internal server error
 */
router.get("/", controller.getCars);

/**
 * @swagger
 * /api/filterSearch:
 *   post:
 *     summary: Get a list of cars with pagination, ordering, filtering and search applied
 *     tags: 
 *       - Cars     
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FilterModel'
 *     responses:
 *       200:
 *         description: Successful response
 *         content: 
 *           application/json: 
 *             examples:
 *               Chevrolet Chevelle Malibu:
 *                 value:
 *                   car: {"name":"chevrolet chevelle malibu","mpg":18.0,"cylinders":8,"displacement":307.0,"horsepower":130.0,"weight":3504,"acceleration":12.0,"model_year":70,"origin":"usa","id":1}
 *                   total: 1
 *             schema: 
 *               $ref: '#/components/schemas/CarData'
 *       500:
 *         description: Internal server error
 */
router.post("/filterSearch", controller.getCars);

/**
 * @swagger
 * /api/add:
 *      post:
 *          summary: Add a entry of new car
 *          tags:
 *              - Cars
 *          responses:
 *              200:
 *                  description: Car Added Successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: number
 *                                      example: 0
 *              400:
 *                  description: Required field/parameter not provided
 *              500:
 *                  description: Internal Server Error
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Car'
 *                      example: {"name":"chevrolet chevelle malibu","mpg":18.0,"cylinders":8,"displacement":307.0,"horsepower":130.0,"weight":3504,"acceleration":12.0,"model_year":70,"origin":"usa"}
 * 
 */
router.post("/add", controller.addCars);

/**
 * @swagger
 * /api/edit/{id}:
 *      patch:
 *          summary: Edit Car - Update the entry
 *          tags: 
 *              - Cars
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  schema:
 *                      type: number
 *                      example: 1
 *                  description: ID of car entry to be updated
 *                  required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Car'
 *                      example: {"id":1,"name":"chevrolet chevelle malibu","mpg":18.0,"cylinders":8,"displacement":307.0,"horsepower":130.0,"weight":3504,"acceleration":12.0,"model_year":70,"origin":"usa"}
 *          responses:
 *              200:
 *                  description: Car Edited Successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: number
 *                                      example: 1
 *              400:
 *                  description: Required field/parameter not provided
 *              500:
 *                  description: Internal Server Error
 */
router.patch("/edit/:id", controller.editCars);

/**
 * @swagger
 * /api/delete/{id}:
 *      delete:
 *          summary: Delete Car
 *          tags:
 *              - Cars
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  schema:
 *                      type: number
 *                      example: 1   
 *          responses:
 *              200:
 *                  description: Car Deleted Successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: number
 *                                      example: 1
 *              400:
 *                  description: Required field/parameter not provided
 *              500:
 *                  description: Internal Server Error        
 */
router.delete("/delete/:id", controller.deleteCars);

/**
 * @swagger
 * /api/total:
 *   get:
 *     summary: Count of Cars in Database
 *     tags: 
 *       - Cars
 *     responses:
 *       200:
 *         description: Successful response
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Total'
 *       500:
 *         description: Internal server error
 */
router.get("/total", controller.getTotalCars);

/**
 * @swagger
 * /api/download:
 *      get:
 *          summary: Download a CSV file
 *          tags:
 *              - Cars
 *          parameters:
 *              -   in: query
 *                  name: type
 *                  schema:
 *                      type: string
 *                      enum: ['csv', 'json']
 *                      default: 'csv'
 *                  description: file type
 *          responses:
 *              200:
 *                  description: File Downloaded Successfully
 *                  content:
 *                      text/csv:
 *                          schema:
 *                              type: string
 *                              format: binary
 *                          example: "id, name, origin, model_year, acceleration, horsepower, mpg, weight, cylinders, displacement\n1, car name, usa, 24, 12.0, 130.0, 18.0 , 3504, 8, 307.0"
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Car'
 *                          example: [{"id":1,"name":"chevrolet chevelle malibu","mpg":18.0,"cylinders":8,"displacement":307.0,"horsepower":130.0,"weight":3504,"acceleration":12.0,"model_year":70,"origin":"usa"}]
 *              500:
 *                  description: Internal Server Error
 */
router.get("/download/", controller.download);

/**
 * @swagger
 * /api/download/{:type}:
 *      get:
 *          summary: Download a file
 *          tags:
 *              - Cars
 *          parameters:
 *              -   in: path
 *                  name: type
 *                  schema:
 *                      type: string
 *                      enum: ['csv', 'json']
 *                      default: 'csv'
 *                  description: file type
 *          responses:
 *              200:
 *                  description: File Downloaded Successfully
 *                  content:
 *                      text/csv:
 *                          schema:
 *                              type: string
 *                              format: binary
 *                          example: "id, name, origin, model_year, acceleration, horsepower, mpg, weight, cylinders, displacement\n1, car name, usa, 24, 12.0, 130.0, 18.0 , 3504, 8, 307.0"
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Car'
 *                          example: [{"id":1,"name":"chevrolet chevelle malibu","mpg":18.0,"cylinders":8,"displacement":307.0,"horsepower":130.0,"weight":3504,"acceleration":12.0,"model_year":70,"origin":"usa"}]
 *              500:
 *                  description: Internal Server Error
 */
router.get("/download/:type", controller.download);

module.exports = router;
const express = require("express");
const app = express();

const products = [
    { sku: "A001", item: "Macbook Air 13", brand: "Apple", description: "Lorem Ipsum..." },
    { sku: "A023", item: "Ipad Pro", brand: "Apple", description: "Lorem Ipsum..." },
    { sku: "B033", item: "Xiaomi Redmi 9", brand: "Xiaomi", description: "Lorem Ipsum..." },
];

/**
 * @swagger
 * tags:
 *      name: Products
 *      description: Products API REST 
 */
/**
 * @swagger
 *      components:
 *          schemas:
 *              Customer:
 *                  type: object
 *                  required:
 *                      - sku
 *                      - item
 *                      - brand
 *                  properties:
 *                      sku:
 *                          type: string
 *                          description: Unique identifier for the product
 *                      item:
 *                          type: string
 *                          description: Name of the product
 *                      brand:
 *                          type: string
 *                          description: manufacturer name
 *                      description:
 *                          type: string
 *                          description: Product details
 */

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products by brand
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         required: true
 *         description: Brand product
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: "json response {products: <array-products> | []}"
 *       400:
 *         description: Incorrect query params
 *       500:
 *         description: server error
 */
app.get("/search", (req, res) => {
    if (!req.query.brand) {
        return res.status(400).json({
            message: "incorrect query params"
        });
    }
    const selectProducts = products.filter(elem => elem.brand === req.query.brand);
    res.status(200).json({
        message: "Ok",
        products: selectProducts
    });
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: "json response {product: <product-object>}"
 *       400:
 *         description: "Product data or sku mandatory"
 *       500:
 *         description: "server error"
 */

app.post("/", (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "Product data mandatory"
        });
    }
    products.push(req.body);
    res.status(200).json({
        message: "Ok",
        product: products[products.length - 1]
    });
});

app.put("/:sku", (req, res) => {
    if (!req.body || !req.params.sku) {
        return res.status(400).json({
            message: "Product data or SKU param mandatory"
        })
    }
    const productIndex = products.findIndex(elem => {
        return elem.sku === req.params.sku;
    })
    if (productIndex < 0) {
        return res.status(404).json({
            message: "Product not found"
        })
    }
    for (const property in req.body) {
        console.log(property);
        products[productIndex][property] = req.body[property];
    }
    res.status(200).json({
        message: "Ok",
        product: products[productIndex]
    })
})

app.delete("/:sku", (req, res) => {
    if (!req.params.sku) {
        return res.status(400).json({
            message: "SKU param mandatory"
        })
    }
    const productIndex = products.findIndex(elem => {
        return elem.sku === req.params.sku;
    })
    if (productIndex < 0) {
        return res.status(404).json({
            message: "Product not found"
        })
    }
    const deletedProduct = products.splice(productIndex, 1);
    res.status(200).json({
        message: "Ok",
        deletedProduct
    })
});


module.exports = app;
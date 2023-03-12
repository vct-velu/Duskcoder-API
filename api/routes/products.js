const express = require('express');
const router = express.Router();
const Product = require('../models/product');

const multer = require('multer');
const upload = multer();



//Get all Products
router.get('/', async (req, res) => {

    try {
        const allProducts = await Product.find();
        res.status(200).send({ message: "Success", Products: allProducts });
        // console.log("All Product Get Request Succeed!");

    } catch (err) {
        res.status(400).send({ message: "error-occured", error: err });
    }
});


// Add a product
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const image = req.file;

        // Convert the image buffer to Base64
        const base64Image = image.buffer.toString('base64');

        // Create a new product object with the Base64-encoded image
        const product = new Product({
            name: name,
            description: description,
            price: price,
            image: base64Image
        });
        await product.save().then(console.log("New Product added to MongoDb !"));
        res.status(201).json({ message: 'Product registered successfully', product });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', error: error, });
    }

});

//Edit product
router.put('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        const { name, price, description } = req.body;

        // Find the product in the database
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        } else {
            let base64Image = '';
            if (req.file) {
                // Convert the image buffer to Base64
                const image = req.file;
                base64Image = image.buffer.toString('base64');
            } else if (req.body.image) {
                // Use the input string as the base64-encoded image
                base64Image = req.body.image;
            }
            // Update the product fields
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = base64Image;

            // Save the updated product to the database
            await product.save().then(console.log("A Product Edited in MongoDb !"));
            res.status(200).json({ message: 'Product updated successfully!', updatedProduct: product });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Delete Product
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Find the product in the database
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        } else {
            // Delete the product from the database
            await Product.deleteOne({ _id: id }).then(console.log('A Product Deleted in MongoDb'));
            res.status(200).json({ message: 'Product deleted successfully!', deletedProduct: product });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
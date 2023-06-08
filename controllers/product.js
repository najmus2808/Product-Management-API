const Product = require("../models/product");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, createdAt } = req.body || {};

    // Validate required fields
    if (!name || !price || !description) {
      return res.status(400).json({
        message: "Name, price, and description are required fields.",
      });
    }

    // Create product payload
    const productData = {
      name,
      price,
      description,
      createdAt,
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).send({
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    console.error("Failed to create the product:", error);
    res.status(500).json({ message: "Failed to create the product." });
  }
};

exports.getProducts = async (req, res) => {
  try {
    // Retrieve all products with only name and price fields
    const products = await Product.find({}, { name: 1, price: 1, _id: 0 });

    res.status(200).send({
      data: products,
    });
  } catch (error) {
    console.error("Failed to retrieve products:", error);
    res.status(500).json({ message: "Failed to retrieve products." });
  }
};

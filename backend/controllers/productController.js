const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// 🔹 Use same default image everywhere
const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dsxqbfocy/image/upload/v1764164357/ChatGPT_Image_Nov_24_2025_at_07_09_52_PM_sepqv3.png";

// 🔹 For deleting Cloudinary image
const getPublicId = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop(); // abc123.jpg
  const folder = parts.pop();   // sharify-products
  return `${folder}/${fileName.split(".")[0]}`;
};

// 🔹 Reusable Cloudinary upload (create + update)
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "sharify-products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ================= CREATE PRODUCT =================
const createProduct = async (req, res) => {
  try {
    const { title, description, category, pricePerDay } = req.body;

    // basic validation
    if (!title || !description || !category || pricePerDay === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const price = Number(pricePerDay);
    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ message: "Price per day must be a positive number" });
    }

    let imageUrl = DEFAULT_IMAGE_URL;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const product = await Product.create({
      title,
      description,
      category,
      owner: req.user._id,
      status: "available",
      image: imageUrl,
      pricePerDay: price
    });

    return res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.error("Create Product error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL PRODUCTS =================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate(
      "owner",
      "_id name email"
    );
    return res.status(200).json({ products });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).json({ message: "server error" });
  }
};

// ================= GET PRODUCT BY ID =================
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate(
      "owner",
      "name email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Get Product by ID error:", error);
    return res.status(500).json({ message: "server error" });
  }
};

// ================= UPDATE PRODUCT =================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { title, description, category, status, pricePerDay } = req.body;

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;

    // price update
    if (pricePerDay !== undefined) {
      const price = Number(pricePerDay);
      if (isNaN(price) || price <= 0) {
        return res
          .status(400)
          .json({ message: "Price per day must be positive" });
      }
      product.pricePerDay = price;
    }

    // image update
    if (req.file) {
      // delete old image if it's a Cloudinary image and not the shared default
      if (
        product.image &&
        product.image.startsWith("http") &&
        product.image !== DEFAULT_IMAGE_URL
      ) {
        const oldPublicId = getPublicId(product.image);
        await cloudinary.uploader.destroy(oldPublicId);
      }

      const result = await uploadFromBuffer(req.file.buffer);
      product.image = result.secure_url;
    }

    if (status !== undefined) {
      const allowed = ["available", "unavailable", "reserved"];
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      product.status = status;
    }

    await product.save();

    return res.status(200).json({ message: "Product Updated", product });
  } catch (error) {
    console.error("Product Update by Id error: ", error);
    return res.status(500).json({ message: "server error" });
  }
};

// ================= DELETE PRODUCT =================
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden to delete" });
    }

    // delete image from Cloudinary if it's not the shared default
    if (
      product.image &&
      product.image.startsWith("http") &&
      product.image !== DEFAULT_IMAGE_URL
    ) {
      const publicId = getPublicId(product.image);
      await cloudinary.uploader.destroy(publicId);
    }

    await product.deleteOne();

    res
      .status(200)
      .json({ message: "Product & image deleted successfully" });
  } catch (error) {
    console.error("Product Delete error: ", error);
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};

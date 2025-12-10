const express=require("express");
const router=express.Router();
const {createProduct, getProducts, getProductById, updateProduct, deleteProduct}=require("../controllers/productController"); // needs to know what controller to run
const auth=require("../middleware/auth");  //middleware needed as login users only can create product
const upload=require("../middleware/upload")

router.post("/create", auth, upload.single("image"), createProduct);  //match url coming from server
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", auth, upload.single("image"), updateProduct);
router.delete("/:id", auth, deleteProduct);

module.exports=router;
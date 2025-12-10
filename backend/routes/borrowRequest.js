const express=require("express");
const router=express.Router();
const {createBorrowRequest, myRequests, myItemRequests, approveRequest, rejectRequest, returnRequest}=require("../controllers/borrowRequestController");
const auth=require("../middleware/auth");

router.post("/",auth, createBorrowRequest);
router.get("/my-requests",auth, myRequests);
router.get("/owner-requests", auth, myItemRequests);
router.put("/:id/approve", auth,approveRequest);
router.put("/:id/reject", auth, rejectRequest);
router.put("/:id/return", auth, returnRequest);

module.exports=router;

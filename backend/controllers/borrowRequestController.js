const Product = require("../models/Product");
const BorrowRequest = require("../models/BorrowRequest");

// ================= CREATE REQUEST =================
const createBorrowRequest = async (req, res) => {
  try {
    const { itemId, startDate, endDate } = req.body;

    // 1. Basic validation
    if (!itemId || !startDate || !endDate) {
      return res.status(400).json({ message: "Item and dates are required" });
    }

    const product = await Product.findById(itemId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot borrow your own item" });
    }

    if (product.status !== "available") {
      return res.status(400).json({ message: "Product not available" });
    }

    // 2. Convert dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 3. Date validation
    if (start >= end) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    // 4. Calculate total days
    const diffTime = end - start;
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 5. Calculate total cost
    const totalCost = totalDays * product.pricePerDay;

    // 6. Prevent duplicate pending requests
    const existing = await BorrowRequest.findOne({
      item: itemId,
      requester: req.user._id,
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({ message: "You already requested this item" });
    }

    // 7. Create request
    const newRequest = await BorrowRequest.create({
      item: itemId,
      requester: req.user._id,
      owner: product.owner,
      status: "pending",
      startDate,
      endDate,
      totalDays,
      totalCost
    });

    return res.status(201).json({
      message: "Borrow request created successfully",
      request: newRequest
    });

  } catch (error) {
    console.error("Create Borrow Request Error: ", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ================= OWNER VIEW REQUESTS =================
const myItemRequests = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const requests = await BorrowRequest.find({ owner: ownerId })
      .populate("item", "title description category status pricePerDay image")
      .populate("requester", "name email");

    return res.status(200).json({ requests });

  } catch (error) {
    console.error("Owner Requests Error: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= BORROWER VIEW REQUESTS =================
const myRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await BorrowRequest.find({ requester: userId })
      .populate("item", "title description category status pricePerDay image")
      .populate("owner", "name email");

    return res.status(200).json({ requests });

  } catch (error) {
    console.error("My Requests Error: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= APPROVE REQUEST =================
const approveRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await BorrowRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request Not Found" });
    }

    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not Allowed" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request Not Pending" });
    }

    request.status = "approved";
    await request.save();

    // Lock product so no one else can borrow
    await Product.findByIdAndUpdate(request.item, {
      status: "unavailable"
    });

    return res.status(200).json({
      message: "Request Approved",
      request
    });

  } catch (error) {
    console.error("Approve Request Error: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= REJECT REQUEST =================
const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await BorrowRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request Not Found" });
    }

    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not Allowed" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request Not Pending" });
    }

    request.status = "rejected";
    await request.save();

    return res.status(200).json({
      message: "Borrow Request Rejected",
      request
    });

  } catch (error) {
    console.error("Reject Request Error: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= RETURN PRODUCT =================
const returnRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    // 1️⃣ Find the borrow request
    const request = await BorrowRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request Not Found" });
    }

    // 2️⃣ Safety + Auth Check
    if (!request.requester || !req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 3️⃣ Only borrower can return
    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not Allowed" });
    }

    // 4️⃣ Only approved items can be returned
    if (request.status !== "approved") {
      return res.status(400).json({ message: "Request was not approved" });
    }

    // 5️⃣ Update status WITHOUT triggering schema revalidation
    const updatedRequest = await BorrowRequest.findByIdAndUpdate(
      requestId,
      { status: "returned" },
      { new: true }
    );

    // 6️⃣ Make product available again
    if (updatedRequest.item) {
      await Product.findByIdAndUpdate(updatedRequest.item, {
        status: "available"
      });
    }

    // 7️⃣ Send success response
    return res.status(200).json({
      message: "Product Returned Successfully",
      request: updatedRequest
    });

  } catch (error) {
    console.error("🔥 Return Request Crash:", error);
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createBorrowRequest,
  myItemRequests,
  myRequests,
  approveRequest,
  rejectRequest,
  returnRequest
};

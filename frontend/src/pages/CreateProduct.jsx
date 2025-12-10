import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateProduct(){

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [pricePerDay, setPricePerDay] = useState("");
    const [image, setImage] = useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("pricePerDay", pricePerDay);

        if (image) {
            formData.append("image", image);
        }

        const response = await fetch("http://localhost:8080/api/products/create", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Product Created Successfully");
            navigate("/products");
        } else {
            alert(data.message || "Error creating product");
        }
    };

    return(
        <div className="page auth-page">
            <div className="page-container product-form-container">
                <h1 className="page-title">Create New Product</h1>

                <form onSubmit={handleSubmit} className="form-box">
                    
                    <label>Title:</label>
                    <input 
                        placeholder="Product Title"
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        required
                    />

                    <label>Description:</label>
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                        required
                    />

                    <label>Category:</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Tools">Tools</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Books">Books</option>
                        <option value="Sports">Sports</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Vehicles">Vehicles</option>
                        <option value="Appliances">Appliances</option>
                        <option value="Camera & Gear">Camera & Gear</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Instruments">Instruments</option>
                        <option value="Home Essentials">Home Essentials</option>
                        <option value="Others">Others</option>
                    </select>


                    <label>Price per day (₹):</label>
                    <input
                        type="number"
                        placeholder="Enter price per day"
                        value={pricePerDay}
                        onChange={(e)=>setPricePerDay(e.target.value)}
                        required
                    />

                    <label>Image:</label>
                    <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />

                    <button type="submit" className="btn">Add Product</button>
               
                </form>
            </div>
        </div>
    )
}

export default CreateProduct;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct(){

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [pricePerDay, setPricePerDay] = useState("");
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState("");

    const { id } = useParams();

   useEffect(()=>{
        fetch(`https://sharify-d4py.onrender.com/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
            setTitle(data.product.title);
            setDescription(data.product.description);
            setCategory(data.product.category);
            setPricePerDay(data.product.pricePerDay);
            setCurrentImage(data.product.image); 
        });
    }, [id]);


    const handleUpdate = async(e) => {
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

        const response = await fetch(`https://sharify-d4py.onrender.com/api/products/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if(response.ok){
            alert("Product Updated");
            navigate("/products");
        }else{
            alert(data.message);
        }
    };

    return(
        <div className="page auth-page">
            <div className="page-container product-form-container">
                <h1 className="page-title">Edit Your Product</h1>

                <form onSubmit={handleUpdate} className="form-box">

                    {currentImage && (
                        <div className="current-image-box">
                            <p>Current Image:</p>
                            <img 
                                src={currentImage}
                                alt={title}
                                className="product-image"
                            />
                        </div>
                    )}

                    <label>Title:</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />

                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />

                    <label>Category:</label>
                    <input
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        required
                    />

                    ✅ Price field added
                    <label>Price per day (₹):</label>
                    <input
                        type="number"
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

                    {image && (
                        <div className="new-image-box">
                            <p>New Image Preview:</p>
                            <img 
                                src={URL.createObjectURL(image)} 
                                alt="Preview"
                                className="product-preview"
                            />
                        </div>
                    )}

                    <button type="submit" className="btn btn-outline">Update</button>

                </form>
            </div>
        </div>
    )
}

export default EditProduct;


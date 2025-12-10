import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-hero">
            <div className="home-content">
                <h1 className="home-title">Share More. Spend Less.</h1>
                <p className="home-subtitle">
                    Borrow what you need • Lend what you don’t • Build your community
                </p>

                <div className="home-buttons">
                    <button
                        className="btn-primary"
                        onClick={() => navigate("/products")}
                    >
                        Explore Items
                    </button>

                    <button
                        className="btn-secondary"
                        onClick={() => navigate("/create-product")}
                    >
                        List an Item
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;

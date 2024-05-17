import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { NavLink , useLocation} from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import mens from './data/mendata';
import { CartProvider, CartContext } from './CartContext';
import './men.css';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 22,
    p: 4,
    borderRadius: 5,
};

const Men = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userEmail = queryParams.get('email');
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [priceDetails, setPriceDetails] = useState({ basePrice: 0, cgst: 0, sgst: 0, totalPrice: 0 });
    const { cartItems, setCartItems, addedToCart, setAddedToCart } = useContext(CartContext);
    const navigate = useNavigate();
    

    useEffect(() => {
        setAddedToCart(mens.map(product => cartItems.some(cartItem => cartItem.id === product.id)));
    }, [cartItems, setAddedToCart]);

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const calculateTotalPrice = (price) => {
        const basePrice = parseFloat(price.slice(1));
        const cgst = basePrice * 0.05;
        const sgst = basePrice * 0.05;
        const totalPrice = basePrice + cgst + sgst;
        return { basePrice, cgst, sgst, totalPrice };
    };

    const handleBuyNow = (product) => {
        const priceDetails = calculateTotalPrice(product.price);
        setSelectedProduct(product);
        setPriceDetails(priceDetails);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOrderModalOpen(false);
    };

    const handleOrderNow = () => {
        setOpen(false);
        setOrderModalOpen(true);
    };

    const handleOrderClose = () => {
        setOpen(false);
        setOrderModalOpen(false);
    };

// Define a function to retrieve the user's email

// Then, you can use this function in your code
const handleAddToCart = async (product, index) => {
    const updatedAddedToCart = [...addedToCart];
    updatedAddedToCart[index] = true; // Mark product as added to cart
    setAddedToCart(updatedAddedToCart); 
    setCartItems([...cartItems, product]); // Add product to cart

    try {
        const response = await fetch( `http://localhost:8000/cart?email=${formData.email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...product, userEmail }), // Include userEmail in the request body
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data); // Optionally, you can handle the response from the backend
        } else {
            console.error('Failed to add item to cart');
            // Revert the addedToCart state
            updatedAddedToCart[index] = false;
            setAddedToCart(updatedAddedToCart);
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        // Revert the addedToCart state
        updatedAddedToCart[index] = false;
        setAddedToCart(updatedAddedToCart);
    }
};
    const handleCartClick = () => {
        navigate(`/cart?email=${formData.email}`);
    };

    const filteredProducts = mens.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.some(desc => desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.price.includes(searchQuery)
    );

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    const deliveryDateString = deliveryDate.toLocaleDateString('en-GB');
    const deliveryTimeString = deliveryDate.toLocaleTimeString();
    const [formData] = useState({
        email: ''
    });
    return (
        <CartProvider formData={formData.email}>
        <div className="home">
            <nav>
                <img className='logo' src="https://www.pingrow.in/uploads/admin/product/unnamed_1594364636.jpg" alt="logo" />
                <ul>
                    <li><NavLink exact activeClassName="active" className='men' to={`/men?email=${formData.email}`}>MEN</NavLink></li>
                    <li><NavLink exact activeClassName="active" className='women' to="/women">WOMEN</NavLink></li>
                    <li><NavLink exact activeClassName="active" className='kids' to="/kids">KIDS</NavLink></li>
                    <li><NavLink exact activeClassName="active" className='homeliving' to="/home&living">HOME & LIVING</NavLink></li>
                    <li><NavLink exact activeClassName="active" className='beauty' to="/beauty">BEAUTY</NavLink></li>
                    <li>
                        <IconButton aria-label="cart" color="inherit" onClick={handleCartClick}>
                            <ShoppingCartIcon />
                            <span>{cartItems.length}</span>
                        </IconButton>
                    </li>
                </ul>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleChange}
                    />
                </div>
            </nav>
            <div className='main'>
                {filteredProducts.map((product, index) => (
                    <Card key={product.id} sx={{ width: 350, borderRadius: 4 }}>
                        <CardMedia
                            sx={{ height: 450 }}
                            image={product.image}
                            title={product.name}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                                {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <ul>
                                    {product.description.map((desc, index) => (
                                        <li key={index}>{desc}</li>
                                    ))}
                                </ul>
                                <div>
                                    <strong>Price: {product.price}</strong>
                                </div>
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => handleBuyNow(product)}>Buy Now</Button>
                            <Button 
                                size="small" 
                                onClick={() => handleAddToCart(product, index)} 
                                disabled={addedToCart[index]}
                            >
                                {addedToCart[index] ? 'Added to Cart' : 'Add to Cart'}
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {selectedProduct?.name}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Base Price: ₹{priceDetails.basePrice.toFixed(2)}<br />
                        CGST (5%): ₹{priceDetails.cgst.toFixed(2)}<br />
                        SGST (5%): ₹{priceDetails.sgst.toFixed(2)}<br />
                        <strong>Total Price: ₹{priceDetails.totalPrice.toFixed(2)}</strong>
                    </Typography>
                    <Button onClick={handleOrderNow} sx={{ mt: 2 }}>Order Now</Button>
                    <Button onClick={handleClose} sx={{ mt: 2, ml: 2 }}>Close</Button>
                </Box>
            </Modal>
            <Modal
                open={orderModalOpen}
                onClose={handleOrderClose}
                aria-labelledby="order-modal-title"
                aria-describedby="order-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="order-modal-title" variant="h6" component="h2">
                        <strong><span style={{ color: 'green' }}>Order Placed Successfully!!</span></strong>
                    </Typography>
                    <Typography id="order-modal-description" sx={{ mt: 2 }}>
                        Your order will be delivered on {deliveryDateString} at {deliveryTimeString}.
                    </Typography>
                    <Button onClick={handleOrderClose} sx={{ mt: 2 }}>Close</Button>
                </Box>
            </Modal>
        </div>
    </CartProvider>
    );
};

export default Men;
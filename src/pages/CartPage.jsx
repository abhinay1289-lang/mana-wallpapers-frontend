import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const CartPage = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" className="py-16">
        <Box className="text-center space-y-4">
          <Typography variant="h4" className="font-bold">
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Looks like you haven't added any wallpapers to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/"
            className="mt-4"
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" className="font-bold mb-6">
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Box className="space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent>
                  <Grid container spacing={3} alignItems="center">
                    {/* Thumbnail */}
                    <Grid item xs={12} sm={3}>
                      <img
                        src={
                          item.thumbnailUrl ||
                          "https://via.placeholder.com/150x100?text=Wallpaper"
                        }
                        alt={item.title}
                        className="w-full h-20 object-cover rounded"
                      />
                    </Grid>

                    {/* Details */}
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h6" className="font-semibold">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.resolution} • {item.format}
                      </Typography>
                    </Grid>

                    {/* Price */}
                    <Grid item xs={12} sm={2}>
                      <Typography
                        variant="h6"
                        color="primary"
                        className="font-bold"
                      >
                        {item.isFree
                          ? "FREE"
                          : `$${(item.priceCents / 100).toFixed(2)}`}
                      </Typography>
                    </Grid>

                    {/* Quantity */}
                    <Grid item xs={12} sm={2}>
                      <Box className="flex items-center justify-center">
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          size="small"
                          value={item.quantity}
                          inputProps={{
                            style: { textAlign: "center" },
                            min: 1,
                          }}
                          sx={{ width: 60, mx: 1 }}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            updateQuantity(item.id, value);
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>

                    {/* Remove */}
                    <Grid item xs={12} sm={1}>
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Box className="flex justify-between">
              <Button variant="outlined" onClick={clearCart} color="error">
                Clear Cart
              </Button>
              <Button variant="outlined" component={Link} to="/">
                Continue Shopping
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-bold mb-4">
                Order Summary
              </Typography>

              <Box className="space-y-2">
                <Box className="flex justify-between">
                  <Typography>Items ({items.length})</Typography>
                  <Typography>${total.toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography>Shipping</Typography>
                  <Typography>Free</Typography>
                </Box>
                <Divider />
                <Box className="flex justify-between">
                  <Typography variant="h6" className="font-bold">
                    Total
                  </Typography>
                  <Typography variant="h6" className="font-bold">
                    ${total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                className="mt-4"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;

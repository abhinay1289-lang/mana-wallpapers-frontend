
import { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../features/thunks/paymentThunks";
import { clearCart } from "../features/slices/cartSlice";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const orderPayload = await dispatch(
        createOrder({
          items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        })
      ).unwrap();

      const order = orderPayload.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Mana Wallpapers",
        description: "Wallpaper Purchase",
        order_id: order.id,
        handler: async (response) => {
          try {
            await dispatch(verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })).unwrap();
            toast.success("Payment successful!");
            dispatch(clearCart());
            window.location.href = "/buyer/dashboard"; // Redirect to dashboard
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
            console.error("Payment verification error:", error);
          }
        },
        prefill: {
          name: user?.fullName || "Valued Customer",
          email: user?.email,
          contact: user?.phoneNumber || "",
        },
        notes: {
          address: "Mana Wallpapers Inc.",
        },
        theme: {
          color: "#6366F1", // Indigo-500
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
          toast.error("Payment Failed: " + response.error.description);
          console.error("Razorpay payment failed:", response.error);
    });
      rzp.open();
    } catch (error) {
      console.error("Checkout process error:", error);
      toast.error(error.message || "Failed to start checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // TODO: This should be fetched from the server or a config file
  const INR_EXCHANGE_RATE = 83;
  const totalInINR = total * INR_EXCHANGE_RATE;

  if (items.length === 0) {
    return (
      <Container maxWidth="md" className="text-center py-16">
        <Typography variant="h4" className="font-bold mb-4">
          Your Cart is Empty
        </Typography>
        <Typography className="mb-6 text-gray-400">
          Looks like you haven't added anything to your cart yet.
        </Typography>
        <Button component={Link} to="/" variant="contained" size="large">
          Explore Wallpapers
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8 sm:py-12">
      <Typography variant="h3" component="h1" className="font-extrabold text-center mb-8 text-indigo-400">
        Secure Checkout
      </Typography>

      <Grid container spacing={6}>
        <Grid item xs={12} md={7}>
          <Card className="bg-gray-800/50">
            <CardContent className="p-6">
              <Typography variant="h5" className="font-bold mb-6 border-b border-gray-700 pb-3">
                Order Summary
              </Typography>

              <List>
                {items.map((item, index) => (
                  <ListItem key={item.id} disableGutters divider={index < items.length - 1}>
                    <ListItemText
                      primary={item.title}
                      secondary={`Qty: ${item.quantity}`}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                      secondaryTypographyProps={{ color: 'GrayText' }}
                    />
                    <Typography variant="h6" className="font-semibold">
                      {item.isFree
                        ? "FREE"
                        : `₹${((item.priceCents / 100) * item.quantity * INR_EXCHANGE_RATE).toFixed(2)}`}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Divider className="my-6 border-gray-700" />

              <Box className="flex justify-between items-center">
                <Typography variant="h5" className="font-bold">
                  Total
                </Typography>
                <Typography variant="h4" className="font-bold text-indigo-400">
                  ₹{totalInINR.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card className="bg-gray-800/50">
            <CardContent className="p-6">
              <Typography variant="h5" className="font-bold mb-4">
                Complete Your Purchase
              </Typography>

              <Alert severity="success" className="mb-6 bg-green-900/50 text-green-200">
                You will be redirected to our secure payment partner to complete your purchase.
              </Alert>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="py-3 text-lg font-bold bg-indigo-600 hover:bg-indigo-700"
              >
                {isProcessing
                  ? "Processing..."
                  : `Pay ₹${totalInINR.toFixed(2)} Securely`}
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                className="text-center block mt-4"
              >
                Powered by Razorpay. Your payment information is always secure.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;

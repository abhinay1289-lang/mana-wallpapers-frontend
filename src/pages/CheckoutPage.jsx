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
import { useCart } from "../context/CartContext";
import { paymentService } from "../services/paymentService";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const order = await paymentService.createOrder({
        amount: total * 100, // Amount in cents
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        items: items,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Mana Wallpapers",
        description: "Wallpaper Purchase",
        order_id: order.id,
        handler: async (response) => {
          try {
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful!");
            clearCart();
            // Redirect to a success page or dashboard
            window.location.href = "/";
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: "Test User",
          email: "test.user@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Test Address",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Failed to start checkout process");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" className="py-16">
        <Box className="text-center">
          <Typography variant="h4" className="font-bold mb-4">
            Your cart is empty
          </Typography>
          <Button variant="contained" href="/">
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-4 sm:py-8">
      <Typography variant="h4" component="h1" className="font-bold mb-6">
        Checkout
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-bold mb-4">
                Order Summary
              </Typography>

              <List>
                {items.map((item, index) => (
                  <div key={item.id}>
                    <ListItem disableGutters>
                      <ListItemText
                        primary={item.title}
                        secondary={`${item.resolution} • ${item.format} • Qty: ${item.quantity}`}
                      />
                      <Typography variant="h6" className="font-semibold">
                        {item.isFree
                          ? "FREE"
                          : `₹${(
                              (item.priceCents / 100) *
                              item.quantity *
                              80
                            ).toFixed(2)}`}
                      </Typography>
                    </ListItem>
                    {index < items.length - 1 && <Divider />}
                  </div>
                ))}
              </List>

              <Divider className="my-4" />

              <Box className="flex justify-between">
                <Typography variant="h5" className="font-bold">
                  Total
                </Typography>
                <Typography variant="h5" className="font-bold">
                  ₹{(total * 80).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-bold mb-4">
                Payment
              </Typography>

              <Alert severity="info" className="mb-4">
                You will be redirected to Razorpay to complete your payment
                securely.
              </Alert>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="mb-4"
              >
                {isProcessing
                  ? "Processing..."
                  : `Pay ₹${(total * 80).toFixed(2)}`}
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                className="text-center block"
              >
                Powered by Razorpay. Your payment information is secure and
                encrypted.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
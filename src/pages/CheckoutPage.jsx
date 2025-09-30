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
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../context/CartContext";
import { paymentService } from "../services/paymentService";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
      const response = await paymentService.createCheckoutSession(items);
      const { checkoutUrl } = response.data;

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
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
        {/* Order Summary */}
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
                          : `$${(
                              (item.priceCents / 100) *
                              item.quantity
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
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-bold mb-4">
                Payment
              </Typography>

              <Alert severity="info" className="mb-4">
                You will be redirected to Stripe to complete your payment
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
                {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                className="text-center block"
              >
                Powered by Stripe. Your payment information is secure and
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

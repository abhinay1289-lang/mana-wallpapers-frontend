import { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "../services/paymentService";
import { downloadService } from "../services/downloadService";
import { useAuth } from "../context/AuthContext";

const BuyerDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => paymentService.getOrderHistory(),
  });

  const { data: downloadsData, isLoading: downloadsLoading } = useQuery({
    queryKey: ["downloads"],
    queryFn: () => downloadService.getUserDownloads(),
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDownload = async (token) => {
    try {
      const response = await downloadService.generateDownloadUrl(token);
      window.open(response.data, "_blank");
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" className="font-bold mb-2">
        Welcome back, {user?.fullName}!
      </Typography>
      <Typography variant="body1" color="text.secondary" className="mb-6">
        Manage your purchases and downloads
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<ReceiptIcon />} label="My Orders" />
            <Tab icon={<DownloadIcon />} label="Downloads" />
            <Tab icon={<HistoryIcon />} label="History" />
          </Tabs>
        </Box>

        <CardContent className="min-h-96">
          {/* Orders Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" className="font-semibold mb-4">
                Recent Orders
              </Typography>
              {ordersLoading ? (
                <Typography>Loading orders...</Typography>
              ) : ordersData?.data?.content?.length > 0 ? (
                <List>
                  {ordersData.data.content.map((order) => (
                    <ListItem key={order.id} className="border-b">
                      <ListItemText
                        primary={`Order #${order.id.substring(0, 8)}`}
                        secondary={`${new Date(
                          order.createdAt
                        ).toLocaleDateString()} • $${order.total.toFixed(2)}`}
                      />
                      <Chip
                        label={order.status}
                        color={order.status === "PAID" ? "success" : "default"}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">No orders found</Typography>
              )}
            </Box>
          )}

          {/* Downloads Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" className="font-semibold mb-4">
                Available Downloads
              </Typography>
              {downloadsLoading ? (
                <Typography>Loading downloads...</Typography>
              ) : downloadsData?.data?.length > 0 ? (
                <List>
                  {downloadsData.data.map((download) => (
                    <ListItem key={download.id} className="border-b">
                      <ListItemText
                        primary={download.wallpaper?.title || "Unknown"}
                        secondary={`Expires: ${new Date(
                          download.expiresAt
                        ).toLocaleDateString()}`}
                      />
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(download.token)}
                        disabled={new Date(download.expiresAt) < new Date()}
                      >
                        Download
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No downloads available
                </Typography>
              )}
            </Box>
          )}

          {/* History Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" className="font-semibold mb-4">
                Download History
              </Typography>
              <Typography color="text.secondary">
                Coming soon - view your complete download history
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default BuyerDashboard;

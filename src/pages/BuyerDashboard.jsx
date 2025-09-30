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
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Container maxWidth="lg" className="py-4 sm:py-8">
      <Typography variant="h4" component="h1" className="font-bold mb-2">
        Welcome back, {user?.fullName}!
      </Typography>
      <Typography variant="body1" color="text.secondary" className="mb-6">
        Manage your purchases and downloads
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
          >
            <Tab icon={<ReceiptIcon />} label={!isMobile && "My Orders"} />
            <Tab icon={<DownloadIcon />} label={!isMobile && "Downloads"} />
            <Tab icon={<HistoryIcon />} label={!isMobile && "History"} />
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
                <List disablePadding>
                  {ordersData.data.content.map((order) => (
                    <ListItem
                      key={order.id}
                      className="flex flex-col sm:flex-row border-b py-4"
                    >
                      <ListItemText
                        primary={`Order #${order.id.substring(0, 8)}`}
                        secondary={`${new Date(
                          order.createdAt
                        ).toLocaleDateString()} • $${order.total.toFixed(2)}`}
                        className="mb-2 sm:mb-0"
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
                <List disablePadding>
                  {downloadsData.data.map((download) => (
                    <ListItem
                      key={download.id}
                      className="flex flex-col sm:flex-row border-b py-4"
                    >
                      <ListItemText
                        primary={download.wallpaper?.title || "Unknown"}
                        secondary={`Expires: ${new Date(
                          download.expiresAt
                        ).toLocaleDateString()}`}
                        className="flex-1 mb-2 sm:mb-0"
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

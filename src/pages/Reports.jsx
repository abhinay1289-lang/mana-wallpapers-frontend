
import { useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Download as DownloadIcon,
  MonetizationOn as RevenueIcon,
  GroupAdd as NewUsersIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getReports } from "../features/thunks/reportsThunks";

const Reports = () => {
  const dispatch = useDispatch();
  const { reports, status, error } = useSelector((state) => state.reports);

  useEffect(() => {
    dispatch(getReports());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Container className="py-12">
        <Alert severity="error">{error.message || "Failed to load reports."}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
        Reports & Analytics
      </Typography>

      <Grid container spacing={4}>
        {/* Downloads Report */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="p-6 text-center">
            <DownloadIcon color="primary" style={{ fontSize: 48 }} />
            <Typography variant="h3" className="font-bold mt-2">
              {reports?.totalDownloads || 0}
            </Typography>
            <Typography color="textSecondary">Total Downloads</Typography>
          </Paper>
        </Grid>

        {/* Revenue Report */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="p-6 text-center">
            <RevenueIcon color="secondary" style={{ fontSize: 48 }} />
            <Typography variant="h3" className="font-bold mt-2">
              {`$${(reports?.totalRevenueCents / 100).toFixed(2) || 0}`}
            </Typography>
            <Typography color="textSecondary">Total Revenue</Typography>
          </Paper>
        </Grid>

        {/* User Growth Report */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="p-6 text-center">
            <NewUsersIcon style={{ fontSize: 48, color: "green" }} />
            <Typography variant="h3" className="font-bold mt-2">
              {reports?.newUsers || 0}
            </Typography>
            <Typography color="textSecondary">New Users</Typography>
          </Paper>
        </Grid>

        {/* Top Performing Wallpapers */}
        <Grid item xs={12}>
          <Paper className="p-6">
            <Typography variant="h5" className="font-semibold mb-4">
              Top Performing Wallpapers
            </Typography>
            <List>
              {reports?.topWallpapers?.map((wallpaper, index) => (
                <ListItem key={wallpaper.id} divider={index < reports.topWallpapers.length - 1}>
                  <ListItemText
                    primary={wallpaper.title}
                    secondary={`${wallpaper.downloads} downloads`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports;

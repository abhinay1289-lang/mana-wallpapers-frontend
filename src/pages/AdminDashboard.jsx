import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";
import { Link } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg" className="py-4 sm:py-8">
      <Typography variant="h4" component="h1" className="font-bold mb-2">
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" className="mb-6">
        Welcome to the admin dashboard.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardActionArea component={Link} to="/admin/users">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <PeopleIcon className="text-6xl mb-2" />
                <Typography variant="h5" component="h2" className="font-semibold">
                  User Management
                </Typography>
                <Typography color="text.secondary">
                  View and manage users
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardActionArea component={Link} to="/admin/analytics">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <AssessmentIcon className="text-6xl mb-2" />
                <Typography variant="h5" component="h2" className="font-semibold">
                  Analytics
                </Typography>
                <Typography color="text.secondary">
                  View sales and user analytics
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;

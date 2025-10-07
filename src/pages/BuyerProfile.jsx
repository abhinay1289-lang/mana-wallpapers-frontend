
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/thunks/usersThunks";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { PhotoCamera, Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";

const BuyerProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user?.profileUrl || "");
  const [newProfilePictureFile, setNewProfilePictureFile] = useState(null);

  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfilePictureFile(file);
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    if (password) {
      formData.append("password", password);
    }
    if (newProfilePictureFile) {
      formData.append("profilePicture", newProfilePictureFile);
    }

    try {
      await dispatch(updateUser({ id: user.id, data: formData })).unwrap();
      toast.success("Profile updated successfully!");
      setPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" className="py-12">
        <Typography variant="h5" className="text-center text-gray-400">
          Loading user profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className="py-8 sm:py-16">
      <Paper elevation={3} className="p-4 sm:p-8">
        <Box className="text-center mb-6">
          <Typography variant="h4" component="h1" className="font-bold text-indigo-500 mb-2">
            Edit Your Profile
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Box className="flex justify-center mb-6">
            <Box className="relative">
              <Avatar
                src={profilePicture}
                alt="Profile Preview"
                sx={{ width: 120, height: 120, border: '2px solid #6366F1' }}
              />
              <IconButton
                component="label"
                htmlFor="profile-picture-input"
                className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-indigo-600"
              >
                <PhotoCamera className="text-white" />
                <input
                  id="profile-picture-input"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfilePictureChange}
                />
              </IconButton>
            </Box>
          </Box>
        
          <TextField
            fullWidth
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Email Address"
            value={user.email}
            disabled
          />
          
          <TextField
            fullWidth
            label="New Password (optional)"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            className="py-3 mt-6 bg-indigo-600 hover:bg-indigo-700"
          >
            Update Profile
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default BuyerProfile;

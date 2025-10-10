import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

const Loading = ({ message = "Loading..." }) => {
  return (
    // <Box className="flex flex-col items-center justify-center min-h-64 space-y-4">
    //   <CircularProgress size={60} />
    //   <Typography variant="body1" color="text.secondary">
    //     {message}
    //   </Typography>
    // </Box>
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;

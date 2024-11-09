
import { Box, LinearProgress, Typography } from "@mui/material";

type ProgressBarProps = {
  progress: number; // Expecting progress value as a percentage (0 to 100)
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {

  console.log("Progress percent:",progress)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          width: "100%", // Full width of the container
          height: 10, // Height of the progress bar
          borderRadius: 5, // Rounded corners
          marginLeft:1,
          marginBottom:3,
        }}
      />
      {/* Progress Percentage */}
      <Typography variant="body2" color="textSecondary">{progress}%</Typography>
    </Box>
  );
};

export default ProgressBar;
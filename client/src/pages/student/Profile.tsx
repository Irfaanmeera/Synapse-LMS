// IMPORTS
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProfileCard from "../../components/student/Profile/ProfileCard";
import SettingsCard from "../../components/student/Profile/SettingsCard";
import Navbarin from "../../components/student/Common/Navbar";

// FONTS
// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";

// STYLE & THEME
const theme = createTheme();

// APP
export default function Profile() {
  const [text, setText] = useState('');

  

  return (
   
    <ThemeProvider theme={theme}>
         <Navbarin/>
      <CssBaseline>
        {/* BACKGROUND */}
        
        <Grid container direction="column" sx={{ overflowX: "hidden" }}>
          <Grid item xs={12} md={8}>
            <img
              alt="avatar"
              style={{
                width: "100vw",
                height: "35vh",
                objectFit: "cover",
                objectPosition: "50% 50%",
                position: "relative",
                
              }}
              src="https://img.freepik.com/premium-vector/abstract-modern-blue-black-background-vector-illustration-design-presentation-banner-cover-web-flyer-card-poster-wallpaper-texture-slide-magazine-powerpoint_249611-4122.jpg"
            />
          </Grid>

          {/* COMPONENTS */}
          <Grid
            container
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{
              position: "absolute",
              top: "25vh",
              px: { xs: 0, md: 7 },
           
            }}
          >
            {/* PROFILE CARD */}
            <Grid item md={4}>
              <ProfileCard/>
            </Grid>

            {/* SETTINGS CARD */}
            <Grid item md={7}>
              <SettingsCard/>
            </Grid>
          </Grid>
        </Grid>
      </CssBaseline>
    </ThemeProvider>
  );
}

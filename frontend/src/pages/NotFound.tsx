import React from "react";
import notfound from "../assets/notfound.jpg";

// React router
import { Link } from "react-router-dom";

// Material UI
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export const NotFound = () => {
  return (
    <>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ height: "100vh" }}
      >
        <h1>Oops! Page not found</h1>
        <Link to="/">Back to homepage</Link>
        <Box component="img" src={notfound} sx={{ width: "400px" }}></Box>
      </Stack>
    </>
  );
};

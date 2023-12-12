import { useState, useEffect } from "react";

// Material UI
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import PestControlIcon from "@mui/icons-material/PestControl";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChecklistIcon from "@mui/icons-material/Checklist";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Stack from "@mui/material/Stack";

// React cookies
import { useCookies } from "react-cookie";

// React router
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// JWT token
import { jwtDecode } from "jwt-decode";

export const Sidebar = () => {
  const [cookies, setCookie, removeCookie]: any = useCookies(["userInfo"]);

  const decoded: any = jwtDecode(cookies.jwt_authorization);

  let navigate = useNavigate();

  const stringAvatar = (name: string) => {
    if (name.split(" ").length > 1) {
      return {
        children: `${name.split(" ")[0][0]} ${name.split(" ")[1][0]}`,
      };
    }
    return {
      children: `${name.split(" ")[0][0]}`,
    };
  };

  // Remove cookies when logout
  const handleLogout = () => {
    removeCookie("jwt_authorization", { path: "/" });
    removeCookie("isLogin", { path: "/" });
    navigate("/");
  };

  return (
    <Stack margin={3} display={"flex"} flexDirection={"column"} spacing={2}>
      <Paper
        elevation={10}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          marginTop={1}
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <PestControlIcon />
          <Typography fontWeight={700}>Bug Tracker</Typography>
        </Box>

        <Box
          marginTop={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography>Welcome, {decoded.staff_name}</Typography>
          <Typography my={0.5}>Role: {decoded.staff_department}</Typography>
        </Box>
      </Paper>

      <Stack marginTop={3} display={"flex"} flexDirection={"column"}>
        <Link style={{ textDecoration: "none" }} to={"/main/dash"}>
          <Button size="large">
            <DashboardIcon />
            <Typography marginLeft={2}>Dashboard</Typography>
          </Button>
        </Link>

        <Link style={{ textDecoration: "none" }} to={"/main/tickets"}>
          <Button size="large">
            <ChecklistIcon />
            <Typography marginLeft={2}>Tickets</Typography>
          </Button>
        </Link>

        {decoded.staff_department == "admin" ? (
          <Link style={{ textDecoration: "none" }} to={"/main/admin"}>
            <Button>
              <SupervisorAccountIcon />
              <Typography marginLeft={2}>Admin</Typography>
            </Button>
          </Link>
        ) : null}
        <Box textAlign={"center"} marginTop={2}>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleLogout}
            href="/"
          >
            {"Logout"}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

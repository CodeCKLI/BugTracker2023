// Material UI
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import SettingsIcon from "@mui/icons-material/Settings";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TextField from "@mui/material/TextField";

// JWT token
import { jwtDecode } from "jwt-decode";

// React Cookie
import { useCookies } from "react-cookie";

export const Navbar = () => {
  const [cookies]: any = useCookies(["userInfo"]);

  // Decode jwt token
  const decoded: any = jwtDecode(cookies.jwt_authorization);

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

  return (
    <Box
      sx={{
        textAlign: "center",
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        border: 1,
        borderColor: "grey.300",
      }}
    >
      <Typography marginLeft={3} variant="h4">
        BTS
      </Typography>
      <Box display="flex" justifyContent="right" p={2}>
        <Box alignItems={"center"} display="flex">
          <Button>
            <SettingsIcon></SettingsIcon>
          </Button>
          <Button>
            <NotificationsIcon> </NotificationsIcon>
          </Button>
          <Button>
            <Avatar {...stringAvatar(decoded.staff_name)} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

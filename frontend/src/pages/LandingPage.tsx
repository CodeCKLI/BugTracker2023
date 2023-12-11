import { useState, useEffect } from "react";

import pic from "../assets/help.svg";

// Material UI
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";

// React router
import { Link, useNavigate } from "react-router-dom";

// React cookie
import { useCookies } from "react-cookie";

// Helper
import { userLogin, userSignin } from "../helpers/dbActions";

export const LandingPage = () => {
  let navigate = useNavigate();

  // initiating states
  const [isLogin, setIsLogin] = useState(true);
  const [uEmail, setUEmail] = useState("");
  const [uPwd, setUPwd] = useState("");
  const [sID, setSID] = useState<number>();
  const [alertmsg, setAlertmsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [cookies, setCookie]: any = useCookies([]);

  const handleLoginBTN = async () => {
    setAlertmsg("");

    // Error handling
    if (uEmail == "") {
      setAlertmsg("Email cannot be empty");
      return;
    }
    if (uPwd == "") {
      setAlertmsg("Password cannot be empty");
      return;
    }

    setLoading(true);

    const result = await userLogin(uEmail, uPwd);

    if (result.info !== undefined) {
      let hasdedinfo = result.info;
      setCookie("isLogin", true, {
        path: "/",
        // cookies will be expired in 10 mins
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });

      setCookie("jwt_authorization", hasdedinfo, {
        path: "/",
        // cookies will be expired in 10 mins
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
      navigate("/main/dash");
    } else {
      setAlertmsg(result);
      setLoading(false);
    }
  };

  const handleSignUpBTN = async () => {
    setAlertmsg("");

    if (uEmail == "") {
      setAlertmsg("Email cannot be empty");
      return;
    }
    if (uPwd == "") {
      setAlertmsg("Password cannot be empty");
      return;
    }
    if (typeof sID !== "number") {
      setAlertmsg("Staff ID is not a number");
      return;
    }

    const result = await userSignin(uEmail, uPwd, sID);

    if (result.message) {
      setAlertmsg(result.message);
    } else {
      setAlertmsg("User information incorrect");
    }
  };

  useEffect(() => {
    // Redirect user if logged in
    if (cookies.isLogin) {
      navigate("/main/dash");
    }
  }, []);

  return (
    <div>
      <Box
        sx={{
          height: "100vh",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          sx={{
            height: "100%",
          }}
          justifyContent={{ md: "center" }}
          alignItems="center"
        >
          <Box component="img" src={pic} sx={{ width: "400px" }}></Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 450,
            }}
          >
            <Paper sx={{ width: 400, minHeight: 530 }} elevation={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 500,
                }}
              >
                <Avatar sx={{ mt: 5, mb: 2, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>

                {alertmsg !== "" ? (
                  <Alert
                    onClick={() => {
                      setAlertmsg("");
                    }}
                    sx={{ mt: 2, mb: 2, width: "75%" }}
                    severity="warning"
                  >
                    {alertmsg}
                  </Alert>
                ) : null}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "325px",
                  }}
                >
                  <Typography variant="h5">Ticket Tacking System</Typography>
                  <TextField
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    variant="standard"
                    sx={{ mt: 2, width: "70%" }}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      setUEmail(e.target.value);
                    }}
                    required
                    autoFocus
                  />
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    variant="standard"
                    sx={{ width: "70%" }}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      setUPwd(e.target.value);
                    }}
                    required
                  />

                  {isLogin ? (
                    <Box sx={{ width: "70%", my: 3 }}>
                      <Typography variant="body2" align="center">
                        {"Don't have an account? "}
                        <Link
                          to={""}
                          onClick={() => {
                            setAlertmsg("");
                            setIsLogin(false);
                          }}
                        >
                          Sign up
                        </Link>
                      </Typography>
                      <LoadingButton
                        loading={loading}
                        loadingIndicator="Verifying..."
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ m: 1 }}
                        onClick={handleLoginBTN}
                      >
                        Login
                      </LoadingButton>
                    </Box>
                  ) : (
                    <Box sx={{ width: "70%" }}>
                      <TextField
                        variant="standard"
                        name="staff_id"
                        label="Staff ID"
                        type="text"
                        id="staff_id"
                        sx={{ width: "100%" }}
                        onChange={(
                          e: React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setSID(Number(e.target.value));
                        }}
                        required
                      />
                      <Typography variant="body2" align="center" sx={{ my: 2 }}>
                        {"Already have an account? "}
                        <Link
                          to={""}
                          onClick={() => {
                            setAlertmsg("");
                            setIsLogin(true);
                          }}
                        >
                          Login
                        </Link>
                      </Typography>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ my: 1 }}
                        onClick={handleSignUpBTN}
                      >
                        Sign up
                      </Button>
                    </Box>
                  )}
                  <Typography variant="caption">
                    Created by{" "}
                    {<Link to="https://github.com/CodeCKLI">CHUNKAI LI</Link>}{" "}
                    in 2023
                  </Typography>
                  <Typography variant="caption">
                    <a href="https://storyset.com/online">
                      illustrations by Storyset
                    </a>
                  </Typography>
                  <Typography variant="caption">
                    <a
                      href="https://www.flaticon.com/free-icons/bug"
                      title="bug icons"
                    >
                      Bug icons created by Freepik - Flaticon
                    </a>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Stack>
      </Box>
    </div>
  );
};

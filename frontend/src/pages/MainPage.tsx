import { useState, useEffect } from "react";

// Components
import { Sidebar } from "../components/Sidebar";

// React router
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Material UI
import Stack from "@mui/material/Stack";

// React Cookies
import { useCookies } from "react-cookie";

export const MainPage = () => {
  const [cookies]: any = useCookies(["userInfo"]);

  let navigate = useNavigate();

  useEffect(() => {
    if (cookies.isLogin == undefined) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      {cookies.isLogin == undefined ? (
        <div></div>
      ) : (
        <Stack
          sx={{ height: "100vh", width: "100vw" }}
          display={"flex"}
          flexDirection={"row"}
        >
          <Sidebar />
          <Outlet />
        </Stack>
      )}
    </div>
  );
};

import { useState, useEffect } from "react";

// React router
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Material UI
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// Helper
import { getAllStaffs } from "../helpers/dbActions";

export const AdminPage = () => {
  const [staffs, setStaffs] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedRow, setSelectedRow] = useState();
  const [alertmsg, setAlertmsg] = useState("");

  const location = useLocation();

  const handleSearchInput = (e: any) => {
    setSearchInput(e.target.value);
    console.log(staffs);

    const filteredStaffs = staffs.filter((staff: any) => {
      return (
        staff.id == e.target.value ||
        staff.staff_department.toLowerCase().includes(e.target.value) ||
        staff.staff_name.toLowerCase().includes(e.target.value)
      );
    });

    console.log(filteredStaffs);

    setFilteredStaffs(filteredStaffs);
  };

  useEffect(() => {
    const getAllStaffsInfo = async () => {
      const allstaffs = await getAllStaffs();
      setStaffs(allstaffs);
      setFilteredStaffs(allstaffs);
    };

    getAllStaffsInfo();

    if (location.state) {
      setAlertmsg(location.state.formMsg);
    }
  }, []);

  const mainColumns: GridColDef[] = [
    { field: "id", headerName: "Staff ID", width: 200 },
    {
      field: "staff_name",
      headerName: "Staff Name",
      width: 250,
    },
    {
      field: "staff_department",
      headerName: "Staff Department",
      width: 300,
    },
  ];

  return (
    <Box sx={{ width: "75%" }}>
      {alertmsg !== "" ? (
        <Alert
          onClick={() => {
            setAlertmsg("");
          }}
          sx={{ mt: 2, mb: 2 }}
          severity="warning"
        >
          {alertmsg}
        </Alert>
      ) : null}

      <Stack
        paddingTop={4}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Typography margin={2} variant="h1" marginTop={2}>
          Staffs
        </Typography>

        <Stack
          justifyContent={"flex-end"}
          paddingY={2}
          display="flex"
          direction="row"
          spacing={2}
        >
          <Link style={{ textDecoration: "none" }} to={"/main/staffform"}>
            <Button variant="contained">{"Add Staff"}</Button>
          </Link>

          <Link
            style={{ textDecoration: "none" }}
            to={selectedRow ? "/main/staffform" : "#"}
            state={{ selectedData: selectedRow }}
          >
            <Button variant="contained">{"Edit Staff"}</Button>
          </Link>
          <TextField
            onChange={handleSearchInput}
            value={searchInput}
            size="small"
            id="search"
            label="ID or Name"
            variant="outlined"
          ></TextField>
        </Stack>
      </Stack>

      <Box>
        <DataGrid
          rows={filteredStaffs}
          columns={mainColumns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 40]}
          disableRowSelectionOnClick
          onCellClick={(data) => {
            setSelectedRow(data.row);
          }}
        />
      </Box>
    </Box>
  );
};

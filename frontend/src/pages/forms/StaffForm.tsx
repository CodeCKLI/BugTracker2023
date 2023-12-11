import { useState, useEffect } from "react";

// Material UI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

// React router
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Import helper function
import { createStaff, editStaff, delStaff } from "../../helpers/dbActions";

export const StaffForm = () => {
  let navigate = useNavigate();

  const [staffName, setStaffName] = useState("");
  const [staffDepartment, setStaffDepartment] = useState("");
  const [alertmsg, setAlertmsg] = useState("");
  const [selectedData, setSelectedData]: any = useState();
  const [isEdit, setIsEdit] = useState(false);

  // Retrieving states
  const location = useLocation();

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setStaffName(e.target.value);
  };

  const handleDepartChange = (e: any) => {
    setStaffDepartment(e.target.value);
  };

  const handleStaffBTN = async () => {
    setAlertmsg("");

    if (staffName == "") {
      setAlertmsg("Staff Name can not be empty");
      return;
    }
    if (staffDepartment == "") {
      setAlertmsg("Staff Department can not be empty");
      return;
    }

    if (!isEdit) {
      await createStaff(staffName, staffDepartment);
      navigate("/main/admin", {
        state: { formMsg: `Staff Name: ${staffName} has been created` },
      });
    }

    if (isEdit) {
      await editStaff(selectedData.id, staffName, staffDepartment);
      navigate("/main/admin", {
        state: { formMsg: `Staff ID: ${selectedData.id} has been edited` },
      });
    }
  };

  const handleDelBTN = async () => {
    await delStaff(selectedData.id);
    navigate("/main/admin", {
      state: { formMsg: `Staff ID: ${selectedData.id} has been deleted` },
    });
  };

  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setSelectedData(location.state.selectedData);
      setStaffName(location.state.selectedData.staff_name);
      setStaffDepartment(location.state.selectedData.staff_department);
    }
  }, []);

  return (
    <div>
      <h1>Staff Form</h1>

      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ mt: 1 }}>
          {alertmsg !== "" ? (
            <Alert sx={{ mt: 2, mb: 2 }} severity="warning">
              {alertmsg}
            </Alert>
          ) : null}

          <TextField
            margin="normal"
            required
            fullWidth
            id="staff_name"
            label="Staff's Name"
            name="name"
            autoComplete="name"
            value={staffName}
            onChange={handleNameChange}
          />

          <InputLabel> Departmemnt </InputLabel>
          <Select
            id="Departmemnt"
            label="Departmemnt"
            name="Departmemnt"
            required
            fullWidth
            onChange={handleDepartChange}
            value={staffDepartment}
            defaultValue=""
          >
            <MenuItem value={"helpdesk"}> Helpdesk </MenuItem>
            <MenuItem value={"maintenance"}> Maintenance </MenuItem>
            <MenuItem value={"signaling"}> Signaling </MenuItem>
            <MenuItem value={"telecom"}> Telecom </MenuItem>
            <MenuItem value={"mechanical"}> Mechanical </MenuItem>
          </Select>

          <Stack
            sx={{ gap: "1em" }}
            paddingY={2}
            display="flex"
            flexDirection="row"
          >
            <Button variant="contained" onClick={handleStaffBTN}>
              submit
            </Button>
            <Button href="/main/admin" variant="contained">
              Cancel
            </Button>
            {isEdit ? (
              <Button
                onClick={handleDelBTN}
                color="warning"
                variant="contained"
              >
                Delete Staff
              </Button>
            ) : null}
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

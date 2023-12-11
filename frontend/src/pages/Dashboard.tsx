import { useState, useEffect } from "react";

// Material UI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PieChart } from "@mui/x-charts/PieChart";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

// JWT token Decoder
import { jwtDecode } from "jwt-decode";

// Cookies
import { useCookies } from "react-cookie";

// Import helper functions
import {
  getAllProjects,
  createProject,
  getOpenTicketsForStaff,
  getOpenTicketsForDepartment,
  getTicketStatus,
  getTicketStatusFromDiffDepartment,
} from "../helpers/dbActions";

// React Router
import { useNavigate } from "react-router-dom";

export const DashBoard = () => {
  const [cookies, setCookie, removeCookie]: any = useCookies(["userInfo"]);
  const [projects, setProjects] = useState([]);
  const [ticketsStatusOpen, setTicketsStatusOpen] = useState(0);
  const [ticketsStatusClose, setTicketsStatusClose] = useState(0);
  const [helpdesk, setHelpdesk] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [signaling, setSignaling] = useState(0);
  const [telecom, setTelecom] = useState(0);
  const [mechanical, setMechanical] = useState(0);
  const [openTicketsForStaff, setOpenTicketsForStaff] = useState(0);
  const [openTicketsForDepartment, setOpenTicketsForDepartment] = useState(0);
  const [openNewProject, setOpenNewProject] = useState(false);
  const [addProjectName, setaddProjectName] = useState("");
  const [addProjectDes, setaddProjectDes] = useState("");
  const [diaAlertmsg, setDiaAlertmsg] = useState("");
  const [selectedRow, setSelectedRow]: any = useState();

  let navigate = useNavigate();

  const decoded: any = jwtDecode(cookies.jwt_authorization);

  const getAllProject = async () => {
    setProjects(await getAllProjects());
  };

  const handleProjectclose = () => {
    setOpenNewProject(false);
  };

  const handleAddProject = async () => {
    if (addProjectName == "" || addProjectDes == "") {
      setDiaAlertmsg("Please enter all fields");
      return;
    }
    await createProject(addProjectName, addProjectDes);
    getAllProject();
    setOpenNewProject(false);
  };

  const handleListClicked = async (data: any) => {
    const staffTickets = await getOpenTicketsForStaff(
      decoded.staff_id,
      data.id
    );
    const deparmentTickets = await getOpenTicketsForDepartment(
      decoded.staff_department,
      data.id
    );
    const ticketsStatus = await getTicketStatus(data.id);
    const ticketsFromDiffDepartment = await getTicketStatusFromDiffDepartment(
      data.id
    );

    setOpenTicketsForStaff(staffTickets.count);
    setOpenTicketsForDepartment(deparmentTickets.count);
    setTicketsStatusOpen(
      ticketsStatus.filter((ticket: any) => {
        return ticket.status == 0;
      }).length
    );
    setTicketsStatusClose(
      ticketsStatus.filter((ticket: any) => {
        return ticket.status == 1;
      }).length
    );
    setHelpdesk(
      ticketsFromDiffDepartment.filter((ticket: any) => {
        return ticket.staff_department == "helpdesk";
      }).length
    );
    setMaintenance(
      ticketsFromDiffDepartment.filter((ticket: any) => {
        return ticket.staff_department == "maintenance";
      }).length
    );
    setSignaling(
      ticketsFromDiffDepartment.filter((ticket: any) => {
        return ticket.staff_department == "signaling";
      }).length
    );
    setTelecom(
      ticketsFromDiffDepartment.filter((ticket: any) => {
        return ticket.staff_department == "telecom";
      }).length
    );
    setMechanical(
      ticketsFromDiffDepartment.filter((ticket: any) => {
        return ticket.staff_department == "mechanical";
      }).length
    );
  };

  useEffect(() => {
    getAllProject();
  }, []);

  const mainColumns: GridColDef[] = [
    { field: "project_name", headerName: "Project", width: 150 },
    {
      field: "project_description",
      headerName: "Description",
      width: 450,
    },
  ];

  return (
    <Box>
      <Typography margin={2} variant="h1" marginTop={2}>
        Dashboard
      </Typography>

      <Box sx={{ width: "80vw" }}>
        <Paper elevation={3} sx={{ padding: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            margin={3}
          >
            <Typography variant="h2">Projects</Typography>

            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "end",
                gap: "1em",
              }}
            >
              <Button
                onClick={() => {
                  setOpenNewProject(true);
                }}
                variant="contained"
              >
                New Project
              </Button>
            </Stack>

            <Dialog
              fullWidth
              open={openNewProject}
              onClose={handleProjectclose}
            >
              <DialogTitle>Add Project</DialogTitle>
              <DialogContent>
                <Stack display={"flex"} flexDirection={"column"} spacing={2}>
                  {diaAlertmsg !== "" ? (
                    <Alert
                      onClick={() => {
                        setDiaAlertmsg("");
                      }}
                      sx={{ mt: 2, mb: 2 }}
                      severity="warning"
                    >
                      {diaAlertmsg}
                    </Alert>
                  ) : null}
                  <TextField
                    required
                    variant="standard"
                    id="project_name"
                    label="Project Name"
                    name="name"
                    autoComplete="name"
                    value={addProjectName}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      setaddProjectName(e.target.value);
                    }}
                  />
                  <TextField
                    required
                    variant="standard"
                    id="project_description"
                    label="Description"
                    name="description"
                    value={addProjectDes}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      setaddProjectDes(e.target.value);
                    }}
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleProjectclose}>Cancel</Button>
                <Button onClick={handleAddProject}>Add</Button>
              </DialogActions>
            </Dialog>
          </Stack>

          <Box marginX={3} marginBottom={3}>
            <DataGrid
              rows={projects}
              columns={mainColumns}
              initialState={{
                pagination: { paginationModel: { pageSize: 3 } },
              }}
              pageSizeOptions={[3, 5, 10, 25]}
              disableRowSelectionOnClick
              onCellClick={async (data) => {
                setSelectedRow(data.row);
                handleListClicked(data.row);
              }}
            />
          </Box>
        </Paper>
      </Box>

      <Box paddingY={4}>
        <Paper elevation={3} sx={{ padding: 1 }}>
          <Typography marginX={3} marginTop={2} variant="h3">
            {selectedRow ? selectedRow.project_name : "Selected project"} Ticket
            Status
          </Typography>

          {selectedRow ? (
            <Box marginX={3}>
              <Stack
                sx={{ gap: "1em" }}
                height={250}
                paddingY={3}
                display={"flex"}
                flexDirection={"row"}
              >
                <Stack
                  sx={{ gap: "1em" }}
                  display={"flex"}
                  flexDirection={"row"}
                >
                  <Card elevation={6}>
                    <CardContent>
                      <Typography>Tickets By Department</Typography>
                      <PieChart
                        series={[
                          {
                            data: [
                              { id: 0, value: helpdesk, label: "Helpdesk" },
                              {
                                id: 1,
                                value: maintenance,
                                label: "Maintenance",
                              },
                              { id: 2, value: signaling, label: "Signaling" },
                              { id: 3, value: telecom, label: "Telecom" },
                              { id: 4, value: mechanical, label: "Mechanical" },
                            ],
                            innerRadius: 10,
                            outerRadius: 60,
                            cx: 70,
                            cy: 70,
                          },
                        ]}
                        width={300}
                        height={200}
                      />
                    </CardContent>
                  </Card>

                  <Card elevation={6}>
                    <CardContent>
                      <Typography>Tickets By Status</Typography>
                      <PieChart
                        series={[
                          {
                            data: [
                              {
                                id: 0,
                                value: ticketsStatusOpen,
                                label: "Open tickets",
                              },
                              {
                                id: 1,
                                value: ticketsStatusClose,
                                label: "Closed tickets",
                              },
                            ],
                            innerRadius: 10,
                            outerRadius: 60,
                            cx: 70,
                          },
                        ]}
                        width={300}
                        height={150}
                      />
                    </CardContent>
                  </Card>
                </Stack>
                {/* {decoded.staff_department == "admin" ? null : (
                <Stack
                  sx={{ gap: "1em" }}
                  display={"flex"}
                  flexDirection={"column"}
                >
                  <Card sx={{ height: "50%" }} elevation={6}>
                    <CardContent>
                      <Typography>OPEN for Department:</Typography>
                      <Typography textAlign={"center"} variant="h1">
                        {openDepartment}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ height: "50%" }} elevation={6}>
                    <CardContent>
                      <Typography>OPEN for Me:</Typography>
                      <Typography textAlign={"center"} variant="h1">
                        {openForStaff}
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              )} */}
                <Stack
                  sx={{ gap: "1em" }}
                  display={"flex"}
                  flexDirection={"column"}
                >
                  <Card sx={{ height: "50%" }} elevation={6}>
                    <CardContent>
                      <Typography>Open tickets for Department</Typography>
                      <Typography textAlign={"center"} variant="h1">
                        {openTicketsForDepartment}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ height: "50%" }} elevation={6}>
                    <CardContent>
                      <Typography>Open tickets for Me</Typography>
                      <Typography textAlign={"center"} variant="h1">
                        {openTicketsForStaff}
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </Stack>
            </Box>
          ) : null}
        </Paper>
      </Box>
    </Box>
  );
};

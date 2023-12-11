import { useState, useEffect } from "react";

// Material UI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

// React router
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Helper functions
import {
  getAllStaffs,
  staffNameToID,
  createTicket,
  editTicket,
  delTicket,
  getAllProjects,
  projectNameToID,
} from "../../helpers/dbActions";

export const TicketForm = () => {
  let navigate = useNavigate();

  // initiate states
  const [title, setTitle] = useState("");
  const [what, setWhat] = useState("");
  const [person, setPerson] = useState("");
  const [open, setOpen] = useState<number>();
  const [project, setProject] = useState("");
  const [alertmsg, setAlertmsg] = useState("");

  const [selectedData, setSelectedData]: any = useState();

  // Store staffs' names
  const [staffNames, setStaffNames] = useState([]);
  const [projectNames, setProjectNames] = useState([]);

  // For toggling edit function
  const [isEdit, setIsEdit] = useState(false);

  // Retrieving states from select
  const location = useLocation();

  const handleOpenChange = (e: any) => {
    setOpen(e.target.checked);
  };

  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
  };

  const handleWhatChange = (e: any) => {
    setWhat(e.target.value);
  };

  const handlePersonChange = (e: any) => {
    setPerson(e.target.value);
  };

  const handleProjectChange = (e: any) => {
    setProject(e.target.value);
  };

  const handleAddTicketBTN = async () => {
    setAlertmsg("");

    if (title == "") {
      setAlertmsg("Title can not be empty");
      return;
    }
    if (what == "") {
      setAlertmsg("Description can not be empty");
      return;
    }

    if (!isEdit) {
      if (person !== "") {
        const staff_id = await staffNameToID(person);
        const project_id = await projectNameToID(project);
        console.log(title, what, staff_id, project_id);
        await createTicket(title, what, staff_id, project_id);
        navigate("/main/tickets", {
          state: { formMsg: `Ticket title: ${title} has been created` },
        });
      }

      if (person == "") {
        const project_id = await projectNameToID(project);
        await createTicket(title, what, undefined, project_id);
        navigate("/main/tickets", {
          state: {
            formMsg: `Ticket title: ${title} has been created but no one follows`,
          },
        });
      }
    }

    if (isEdit) {
      if (person !== "") {
        const staff_id = await staffNameToID(person);
        // const project_id = await projectNameToID(project);
        await editTicket(selectedData.id, title, what, staff_id, open);
        navigate("/main/tickets", {
          state: { formMsg: `Ticket ID: ${selectedData.id} has been edited` },
        });
      }

      if (person == "") {
        // const project_id = await projectNameToID(project);
        await editTicket(selectedData.id, title, what, undefined, open);
        navigate("/main/tickets", {
          state: {
            formMsg: `Ticket ID: ${selectedData.id} has been created but STIL no one follows`,
          },
        });
      }
    }
  };

  const handleDelTicket = async () => {
    const result = await delTicket(selectedData.id);

    if (!result.isdeleted) {
      console.log(result.msg.detail);
      navigate("/main/tickets", {
        state: {
          formMsg: `Error: ${selectedData.id} ${result.msg.detail}`,
        },
      });
    } else {
      navigate("/main/tickets", {
        state: {
          formMsg: `Ticket ID: ${selectedData.id} has been deleted`,
        },
      });
    }
  };

  useEffect(() => {
    const getStaffs = async () => {
      setStaffNames(await getAllStaffs());
    };

    const getProjects = async () => {
      setProjectNames(await getAllProjects());
    };

    getStaffs();
    getProjects();

    if (location.state) {
      setIsEdit(true);
      setSelectedData(location.state.selectedData);
      setTitle(location.state.selectedData.ticket_title);
      setWhat(location.state.selectedData.description);
      setOpen(location.state.selectedData.status);

      if (location.state.selectedData.staff_name) {
        setPerson(location.state.selectedData.staff_name);
      }
    }
  }, []);

  return (
    <Box sx={{ width: "75%", mt: 1 }}>
      <h1>Ticket Form</h1>

      <Box>
        {alertmsg !== "" ? (
          <Alert sx={{ mt: 2, mb: 2 }} severity="warning">
            {alertmsg}
          </Alert>
        ) : null}

        {isEdit ? (
          <FormControlLabel
            label="Done?"
            control={
              <Checkbox
                checked={open == 1 ? true : false}
                onChangeCapture={handleOpenChange}
              />
            }
          />
        ) : null}

        <TextField
          margin="normal"
          id="ticket_title"
          label="Ticket Title"
          name="ticket_title"
          value={title}
          multiline
          required
          fullWidth
          onChange={handleTitleChange}
        />
        <TextField
          margin="normal"
          id="description"
          label="What went wrong?"
          name="description"
          value={what}
          multiline
          required
          fullWidth
          onChange={handleWhatChange}
        />

        <InputLabel> Staff </InputLabel>
        <Select
          id="staff_name"
          label="Staff Name"
          name="staff_name"
          fullWidth
          onChange={handlePersonChange}
          value={person}
          defaultValue=""
        >
          {staffNames.map((staff: any) => (
            <MenuItem key={staff.id} value={staff.staff_name}>
              {staff.staff_name}
            </MenuItem>
          ))}
        </Select>

        {isEdit ? null : (
          <Box>
            <InputLabel> Project </InputLabel>
            <Select
              id="project_name"
              label="Projects"
              name="project_name"
              fullWidth
              value={project}
              onChange={handleProjectChange}
              defaultValue=""
            >
              {projectNames.map((project: any) => (
                <MenuItem key={project.id} value={project.project_name}>
                  {project.project_name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
            onClick={handleAddTicketBTN}
          >
            submit
          </Button>
          <Button
            href="/main/tickets"
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
          >
            Cancel
          </Button>

          {isEdit ? (
            <Button
              variant="contained"
              color="warning"
              onClick={handleDelTicket}
              sx={{ m: 1 }}
            >
              Delete Ticket
            </Button>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
};

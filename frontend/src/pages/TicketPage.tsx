import { useState, useEffect } from "react";

// Material UI
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";

// JWT token Decoder
import { jwtDecode } from "jwt-decode";

// Cookies
import { useCookies } from "react-cookie";

// React Router
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Import helper function
import {
  getAllTickets,
  getCommentsByTicketID,
  createCommentToTicket,
} from "../helpers/dbActions";

export const TicketPage = () => {
  // Retrieving states from select
  const location = useLocation();

  const [cookies, setCookie, removeCookie]: any = useCookies(["userInfo"]);
  const [tickets, setTickets]: any = useState([]);
  const [filteredTickets, setFilteredTickets]: any = useState([]);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput]: any = useState();
  const [searchInput, setSearchInput] = useState("");
  const [selectedRow, setSelectedRow]: any = useState();
  const [alertmsg, setAlertmsg] = useState("");

  // From JWT
  const decoded: any = jwtDecode(cookies.jwt_authorization);

  const handleSendComment = async () => {
    const result = await createCommentToTicket(
      commentInput,
      selectedRow.id,
      decoded.staff_id
    );

    setComments(await getCommentsByTicketID(selectedRow.id));
  };

  const handleCommentInput = (e: any) => {
    setCommentInput(e.target.value);
  };

  const handleSearchInput = (e: any) => {
    setSearchInput(e.target.value);

    const filteredTickets = tickets.filter((ticket: any) => {
      return (
        ticket.ticket_title.toLowerCase().includes(e.target.value) ||
        ticket.id == e.target.value ||
        ticket.staff_name.toLowerCase().includes(e.target.value) ||
        ticket.project_name.toLowerCase().includes(e.target.value)
      );
    });

    setFilteredTickets(filteredTickets);
  };

  const columns: GridColDef[] = [
    {
      field: "status",
      headerName: "Status",
      width: 180,
      type: "boolean",
    },
    { field: "id", headerName: "Ticket ID", width: 150 },
    { field: "ticket_title", headerName: "Ticket title", width: 350 },
    {
      field: "staff_name",
      headerName: "Person in Charge",
      width: 200,
    },
    {
      field: "project_name",
      headerName: "Project Name",
      width: 150,
    },
  ];

  useEffect(() => {
    const getTickets = async () => {
      const alltickets = await getAllTickets();
      setTickets(alltickets);
      setFilteredTickets(alltickets);
    };

    getTickets();

    if (location.state) {
      setAlertmsg(location.state.formMsg);
    }
  }, []);

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
          Tickets
        </Typography>

        <Stack
          justifyContent={"flex-end"}
          paddingY={2}
          display="flex"
          direction="row"
          spacing={2}
        >
          <Link to={"/main/ticketform"}>
            <Button variant="contained">Add tickets</Button>
          </Link>

          <Link
            to={selectedRow ? "/main/ticketform" : "#"}
            state={{ selectedData: selectedRow }}
          >
            <Button variant="contained">{"Edit Ticket"}</Button>
          </Link>

          <TextField
            size="small"
            id="search"
            label="Search any field"
            variant="outlined"
            value={searchInput}
            onChange={handleSearchInput}
          ></TextField>
        </Stack>
      </Stack>

      <DataGrid
        sx={{ height: "50%" }}
        rows={filteredTickets}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        onCellClick={async (data) => {
          setSelectedRow(data.row);
          setComments(await getCommentsByTicketID(data.row.id));
        }}
      />

      <Box paddingY={4}>
        <Paper elevation={3} sx={{ padding: 1 }}>
          <Typography marginX={3} marginTop={2} variant="h3">
            Ticket Comments
          </Typography>
          {selectedRow ? (
            <Stack
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"cener"}
              paddingY={3}
            >
              <Box sx={{ width: "100%" }}>
                <Stack
                  display={"flex"}
                  flexDirection={"column"}
                  gap={2}
                  paddingX={3}
                  maxHeight={200}
                  sx={{ overflowY: "scroll" }}
                >
                  {comments.map((comment: any) => {
                    return (
                      <Paper sx={{ padding: "200" }} key={comment.id}>
                        <Stack
                          display={"flex"}
                          flexDirection={"row"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          textAlign={"center"}
                          spacing={2}
                        >
                          <Typography paddingX={5} variant="h4">
                            {comment.staff_name}: {comment.comment_message}
                          </Typography>
                          <Typography paddingX={5} variant="h4">
                            {comment.created_at}
                          </Typography>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>

                <Stack
                  sx={{ gap: "1em" }}
                  display={"flex"}
                  flexDirection={"row"}
                  paddingY={2}
                  paddingX={3}
                >
                  <TextField
                    fullWidth
                    onChange={handleCommentInput}
                    id="comment_input"
                    label="Enter comments"
                    value={commentInput}
                  />

                  <Button onClick={handleSendComment} variant="contained">
                    Send
                  </Button>
                </Stack>
              </Box>
            </Stack>
          ) : null}
        </Paper>
      </Box>
    </Box>
  );
};

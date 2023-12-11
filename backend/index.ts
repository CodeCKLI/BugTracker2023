import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

// Utils
import { isObjEmpty, DeparmentsEnum } from "./helpers/utils.js";

// DAO layer for database
import * as dbDAO from "./DAO/dbDAO.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// CORS
app.use(cors());

//JSON middleware
app.use(express.json());

// GET reqs

app.get("/allstaffs", async (req: Request, res: Response) => {
  const allStaffs = await dbDAO.getAllStaffs();
  res.json(allStaffs);
});

app.get("/allmain", async (req: Request, res: Response) => {
  const main = await dbDAO.getMain();
  res.json(main);
});

app.get("/allhelp", async (req: Request, res: Response) => {
  const help = await dbDAO.getHelp();
  res.json(help);
});

app.get("/alltickets", async (req: Request, res: Response) => {
  const tickets = await dbDAO.getTickets();
  res.json(tickets);
});

app.get("/tableticketsall", async (req: Request, res: Response) => {
  const tickets = await dbDAO.getTicketsForTable();
  res.send(tickets);
});

app.get("/openticketscount", async (req: Request, res: Response) => {
  const openticketscount = await dbDAO.getOpenTicketsCount();
  res.json(openticketscount);
});

app.get("/closedticketscount", async (req: Request, res: Response) => {
  const closedticketscount = await dbDAO.getClosedTicketsCount();
  res.json(closedticketscount);
});

app.get("/openticketdepartmentcount", async (req: Request, res: Response) => {
  const openticketdepartmentcount = await dbDAO.getOpenTicketsDepartment();
  res.json(openticketdepartmentcount);
});

app.get("/findstaffbyid/:sid", async (req: Request, res: Response) => {
  const staff = await dbDAO.findStaffByID(req.params.sid);
  if (isObjEmpty(staff)) {
    res.sendStatus(400);
  } else {
    res.json(staff);
  }
});

app.get("/findStaffByName/:sName", async (req: Request, res: Response) => {
  const staffid = await dbDAO.findStaffByName(req.params.sName);
  if (isObjEmpty(staffid)) {
    res.sendStatus(400);
  } else {
    res.json(staffid);
  }
});

app.get("/getprojects", async (req: Request, res: Response) => {
  const allProjects = await dbDAO.getAllProjects();
  res.json(allProjects);
});

app.get("/findProjectByName/:sName", async (req: Request, res: Response) => {
  const staffid = await dbDAO.findProjectByName(req.params.sName);
  if (isObjEmpty(staffid)) {
    res.sendStatus(400);
  } else {
    res.json(staffid);
  }
});

app.get("/commentsbyticketid/:tid", async (req: Request, res: Response) => {
  const allComments = await dbDAO.getCommentsbyticketid(Number(req.params.tid));
  res.json(allComments);
});

app.get("/getticketsofproject/:pid", async (req: Request, res: Response) => {
  const pid = req.params.pid;
  const status = await dbDAO.getTicketsForStatus(Number(pid));
  res.json(status);
});

app.get(
  "/getticketsfromdiffdepartment/:pid",
  async (req: Request, res: Response) => {
    const pid = req.params.pid;
    const departments = await dbDAO.getTicketsForDiffDepartment(Number(pid));
    res.json(departments);
  }
);

//POST reqs
app.post("/createStaff", async (req: Request, res: Response) => {
  const { name, department } = req.body;

  if (
    name !== undefined &&
    department !== undefined &&
    department in DeparmentsEnum
  ) {
    try {
      await dbDAO.postCreateStaff(name, department);
      res.send("Created");
    } catch (error) {
      res.json(error);
    }
  }
});

app.post("/createticket", async (req: Request, res: Response) => {
  const { title, what, personid, project_id } = req.body;

  if (title !== undefined && what !== undefined && project_id !== undefined) {
    try {
      await dbDAO.postCreateTicket(title, what, personid, project_id);
      res.sendStatus(201);
    } catch (err) {
      res.json({ error: err });
    }
  } else {
    res.sendStatus(400);
  }
});

app.post("/register", async (req, res) => {
  const { uEmail, password, staff_ID } = req.body;

  const saltRounds = 10;
  const hashedpwd = await bcrypt.hash(password, saltRounds);

  const userMatched = await dbDAO.staffLoginPwdmatch(uEmail);
  const userIDMatched = await dbDAO.staffIDLookup(staff_ID);

  if (userMatched != undefined) {
    res.json({ message: "This email has already been registered" });
    return;
  }

  if (userIDMatched != undefined) {
    res.json({ message: "This staff ID has already been registered" });
    return;
  }

  try {
    await dbDAO.staffRegister({ uEmail, hashedpwd, staff_ID });
    res.json({ message: "User account created" });
  } catch (err: any) {
    res.sendStatus(401);
  }
});

app.post("/login", async (req, res) => {
  const { uEmail, Pwd } = req.body;

  console.log(`uEmail: ${uEmail}`);
  console.log(`Pwd: ${Pwd}`);

  try {
    // Compare password and hashed password in DB
    const matchedUser = await dbDAO.staffLoginPwdmatch(uEmail);
    console.log(`matchedUser: ${matchedUser}`);
    const passwordMatch = await bcrypt.compare(Pwd, matchedUser.user_password);
    console.log(`passwordMatch: ${passwordMatch}`);

    if (!passwordMatch) {
      res.sendStatus(401);
      return;
    }

    // Retrieve user info with custome SQL query
    const staffInfo = await dbDAO.staffLoginInfo(matchedUser.user_staff_id);
    console.log(`staffInfo: ${staffInfo}`);
    const secretkey: any = process.env.ACCESS_TOKEN_SECRET;

    // JWT token
    const accessToken = jwt.sign(staffInfo, secretkey);
    console.log(`accessToken: ${accessToken}`);

    res.send({ login: true, info: accessToken });
  } catch (error) {
    res.send(error);
  }
});

app.post("/openticketforstaff", async (req: Request, res: Response) => {
  try {
    const tickets: any = await dbDAO.getOpenTicketsForStaff(req.body.staff_id);
    res.json({ count: tickets.rows[0].open_tickets_for_staff });
  } catch (error) {
    res.sendStatus(400);
  }
});

app.post("/createproject", async (req: Request, res: Response) => {
  const { project, description } = req.body;

  if (project !== undefined && description !== undefined) {
    try {
      await dbDAO.postCreateProject(project, description);
      res.json({ message: `Project ${project} is created` });
    } catch (error) {
      res.send(error);
    }
  }
});

app.post("/createcommenttoticket", async (req: Request, res: Response) => {
  const { comment_message, ticket_id, staff_id } = req.body;

  if (
    comment_message !== undefined &&
    ticket_id !== undefined &&
    staff_id !== undefined
  ) {
    try {
      await dbDAO.postCreateComment(comment_message, ticket_id, staff_id);
      res.json("Created");
    } catch (error) {
      res.send(error);
    }
  }
});

app.post("/openticketsforstaff", async (req: Request, res: Response) => {
  const { sid, pid } = req.body;

  try {
    const opentickets = await dbDAO.getOpenTicketForUser(sid, pid);
    res.json({ count: opentickets.rows[0].open_tickets_for_staff });
  } catch (error) {
    res.sendStatus(400);
  }
});

app.post("/openticketsfordepartment", async (req: Request, res: Response) => {
  const { department, pid } = req.body;
  try {
    const opentickets = await dbDAO.getOpenTicketForDepartment(department, pid);
    res.json({ count: opentickets.rows[0].open_ticket_for_department });
  } catch (error) {
    res.sendStatus(400);
  }
});

//PATCH reqs
app.patch("/editStaff", async (req: Request, res: Response) => {
  const { id, name, department } = req.body;

  if (department in DeparmentsEnum) {
    await dbDAO.patchStaff(id, name, department);
    res.json({ ispatched: true, msg: `Staff ID: ${id} is patched` });
  } else {
    res.sendStatus(400);
  }
});

app.patch("/editTicket", async (req: Request, res: Response) => {
  try {
    const updatedTicket = req.body;
    await dbDAO.patchTicket(updatedTicket);
    res.json({
      ispatched: true,
      msg: `Ticket ID: ${updatedTicket.id} is patched`,
    });
  } catch (error) {
    res.sendStatus(400);
  }
});

app.patch("/editProject", async (req: Request, res: Response) => {
  try {
    const updatedProject = req.body;
    await dbDAO.patchProject(updatedProject);
    res.json({
      ispatched: true,
      msg: `Project ID:${updatedProject.project_id} is patched`,
    });
  } catch (error) {
    res.sendStatus(400);
  }
});

// DELETE reqs
app.delete("/delStaff", async (req: Request, res: Response) => {
  try {
    const delStaffID = req.body;
    await dbDAO.delStaff(delStaffID);
    res.json({
      isdeleted: true,
      msg: `Staff ID: ${delStaffID.id} is deleted`,
    });
  } catch (error) {
    res.sendStatus(400);
  }
});

app.delete("/delticket", async (req: Request, res: Response) => {
  try {
    const { delticketID } = req.body;
    await dbDAO.delTicket(delticketID);
    res.json({
      isdeleted: true,
      msg: `Ticket ID: ${delticketID.id} is deleted`,
    });
  } catch (error) {
    res.json({
      isdeleted: false,
      msg: error,
    });
  }
});

app.delete("/delproject", async (req: Request, res: Response) => {
  try {
    const delProjectID = req.body;
    const result = await dbDAO.delProject(delProjectID);
    res.json({
      result,
    });
  } catch (error) {
    res.sendStatus(400);
  }
});

// Main endpoints
app.get("/", (req: Request, res: Response) => {
  res.send("Ticketing system by CHUN KAI LI");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at ${process.env.HOST}:${port}`);
});

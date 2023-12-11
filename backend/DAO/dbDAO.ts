import { db } from "../helpers/database.js";

// GET
export const getAllStaffs = async () => {
  const sql = `
  SELECT *
  FROM staffs
  WHERE staff_department != 'admin';
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const getMain = async () => {
  const sql = `
  SELECT id, staff_name
  FROM staffs
  WHERE staff_department = 'maintenance'
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const getHelp = async () => {
  const sql = `
  SELECT id, staff_name
  FROM staffs
  WHERE staff_department = 'helpdesk'
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const getAdmin = async () => {
  const sql = `
  SELECT id, staff_name
  FROM ticket_app.staffs
  WHERE staff_department = 'admin'
  `;
  const result = await db.query(sql);
  return result;
};

export const getTickets = async () => {
  const sql = `
  SELECT *
  FROM tickets
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const getTicketsForTable = async () => {
  const sql = `
  SELECT tickets.id, 
  tickets.ticket_title, 
  tickets.description, 
  tickets.status, 
  projects.project_name,
  staffs.staff_name
  
  FROM tickets
  LEFT JOIN staffs 
  		ON tickets.staff_id = staffs.id
		
  LEFT JOIN projects 
  		ON tickets.project_id = projects.id;
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const getOpenTicketsCount = async () => {
  const sql = `
  SELECT COUNT(status) AS open_tickets FROM tickets
  where status = 0;
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const getClosedTicketsCount = async () => {
  const sql = `
  SELECT COUNT(status) AS closed_tickets FROM tickets
  where status = 1;
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const getOpenTicketsDepartment = async () => {
  const sql = `
  SELECT COUNT(staffs.staff_department) AS open_tickets_department
  FROM tickets
  INNER JOIN staffs ON tickets.staff_id = staffs.id
  WHERE tickets.status = 0 AND staffs.staff_department = 'maintenance'
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const getOpenTicketsForStaff = async (staff_id: number) => {
  const sql = `
  SELECT COUNT(tickets.staff_id) AS open_tickets_for_staff
  FROM tickets
  WHERE tickets.status = 0 AND tickets.staff_id = ${staff_id}
  `;
  const result = await db.query(sql);
  return result;
};

export const findStaffByID = async (id: any) => {
  const sql = `
  SELECT * FROM staffs WHERE staffs.id = ${id}
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const findStaffByName = async (name: any) => {
  const sql = `
  Select id FROM staffs where staff_name = '${name}'
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const getAllProjects = async () => {
  const sql = `
  Select * FROM projects
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const findProjectByName = async (name: any) => {
  const sql = `
  Select id FROM projects where project_name = '${name}'
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const getCommentsbyticketid = async (tid: number) => {
  const sql = `
  SELECT 
  ticket_comments.id, 
  ticket_comments.comment_message,
  ticket_comments.ticket_id,
  TO_CHAR(ticket_comments.created_at, 'YYYY/MM/DD HH:MI:SS') AS created_at ,
  staffs.staff_name

  FROM ticket_comments 
  LEFT JOIN staffs ON ticket_comments.staff_id = staffs.id
  WHERE ticket_id = ${tid}	
  ORDER BY ticket_comments.created_at DESC;
  `;
  const result = await db.query(sql);
  return result.rows;
};

export const getOpenTicketForUser = async (sid: number, pid: number) => {
  const sql = `
  SELECT COUNT(staff_id) open_tickets_for_staff FROM tickets
  WHERE staff_id = ${sid} AND project_id =${pid};
  `;
  const result = await db.query(sql);
  return result;
};

export const getOpenTicketForDepartment = async (
  department: string,
  pid: number
) => {
  const sql = `
  SELECT COUNT(*) AS open_ticket_for_department
  FROM tickets
  LEFT JOIN staffs ON tickets.staff_id = staffs.id
  WHERE staffs.staff_department = '${department}' AND tickets.project_id = ${pid}
  `;
  const result = await db.query(sql);
  return result;
};

export const getTicketsForStatus = async (pid: number) => {
  const sql = `
  SELECT status FROM tickets WHERE project_id = ${pid};
  `;
  const response = await db.query(sql);
  return response.rows;
};
export const getTicketsForDiffDepartment = async (pid: number) => {
  const sql = `
  SELECT staffs.staff_department
  FROM tickets 
  LEFT JOIN staffs ON tickets.staff_id = staffs.id
  WHERE tickets.project_id = ${pid}
  `;
  const response = await db.query(sql);
  return response.rows;
};

// POST
export const postCreateStaff = async (name: string, department: string) => {
  const sql = `INSERT INTO staffs(staff_name, staff_department) values('${name}', '${department}')`;
  const result = await db.query(sql);
  return result;
};

export const postCreateTicket = async (
  title: string,
  what: string,
  personid: number,
  project_id: number
) => {
  let sql;
  if (personid !== undefined) {
    sql = `
    INSERT INTO tickets(ticket_title, description, staff_id, project_id) 
    values('${title}', '${what}',${personid}, ${project_id});
    `;
  } else {
    sql = `
    INSERT INTO tickets(ticket_title, description, project_id) 
    values('${title}', '${what}, ${project_id}')
    `;
  }
  const result = await db.query(sql);
  return result;
};

export const postCreateComment = async (
  comment_message: string,
  ticket_id: number,
  staff_id: number
) => {
  const sql = `
  INSERT INTO 
  ticket_comments(comment_message, ticket_id, created_at, staff_id ) 
  values('${comment_message}', ${ticket_id}, now()::timestamp(0), ${staff_id} );`;
  const result = await db.query(sql);
  return result;
};

export const postCreateProject = async (
  project: string,
  description: string
) => {
  const sql = `INSERT INTO projects(project_name, project_description) values('${project}', '${description}')`;
  const result = await db.query(sql);
  return result;
};

//Register staffs
export const staffRegister = async ({
  uEmail,
  hashedpwd,
  staff_ID,
}: {
  uEmail: any;
  hashedpwd: any;
  staff_ID: any;
}) => {
  // Store the username and hashed password in the database
  const sql = `INSERT INTO users(user_email, user_password, user_staff_id) Values('${uEmail}', '${hashedpwd}', ${staff_ID});`;
  const result = await db.query(sql);
  return result;
};

// Login function
export const staffLoginPwdmatch = async (uEmail: string) => {
  const sql = `SELECT * FROM users WHERE user_email = '${uEmail}'`;
  const result: any = await db.query(sql);
  return result.rows[0];
};

export const staffIDLookup = async (id: number) => {
  const sql = `SELECT * FROM users WHERE user_staff_id = '${id}'`;
  const result: any = await db.query(sql);
  return result.rows[0];
};

export const staffLoginInfo = async (staff_id: number) => {
  const sql = `
  SELECT
    id AS staff_id,
    staff_name,
    staff_department,
    user_email
  FROM
    staffs
  JOIN
    users ON staffs.id = users.user_staff_id
  WHERE
    staffs.id =${staff_id};
  `;
  const result: any = await db.query(sql);
  return result.rows[0];
};

// PATCH
export const patchStaff = async (
  id: number,
  name: string,
  department: string
) => {
  const sql = `UPDATE staffs
  SET staff_name = '${name}', staff_department = '${department}'
  WHERE id = '${id}';`;
  const result = await db.query(sql);
  return result;
};

export const patchTicket = async ({
  id,
  ticket_title,
  description,
  status,
  staff_id,
}: {
  id: number;
  ticket_title: string;
  description: string;
  status: any;
  staff_id: number;
}) => {
  const sql = `UPDATE tickets SET ticket_title = '${ticket_title}', description = '${description}', status = ${status}, staff_id = ${staff_id} WHERE id = ${id}`;
  const result = await db.query(sql);
  return result;
};

export const patchProject = async ({
  project_id,
  project,
  description,
  contributorID,
}: {
  project_id: number;
  project: string;
  description: string;
  contributorID: number;
}) => {
  const sql = `UPDATE projects SET project_name = '${project}', project_description = '${description}', project_contri = ${contributorID} WHERE project_id = ${project_id}`;
  const result = await db.query(sql);
  return result;
};

// DELETE
export const delStaff = async ({ id }: { id: number }) => {
  const sql = `DELETE FROM staffs where id=${id};`;
  const result = await db.query(sql);
  return result;
};

export const delTicket = async (delticketID: number) => {
  const sql = `DELETE FROM tickets where id=${delticketID};`;
  const result = await db.query(sql);
  return result;
};

export const delProject = async ({ project_id }: { project_id: number }) => {
  const sql = `DELETE FROM projects where project_id=${project_id};`;
  const result = await db.query(sql);
  return result;
};

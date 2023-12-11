const env = import.meta.env;

let HOST: string;
let PORT: string;

if (env.VITE_REACT_APP_MDOE == "PROD") {
  HOST = env.VITE_REACT_APP_PROD_HOST;
  PORT = env.VITE_REACT_APP_PRO_PORT;
} else {
  HOST = env.VITE_REACT_APP_DEV_HOST;
  PORT = env.VITE_REACT_APP_DEV_PORT;
}

export const staffNameToID = async (name: string) => {
  const readStaffid = await fetch(
    `http://${HOST}:${PORT}/findStaffByName/${name}`
  );
  let data = await readStaffid.json();
  return data[0].id;
};

export const staffIDToName = async (uStaff_id: number) => {
  const readStaffid = await fetch(
    `http://${HOST}:${PORT}/findstaffbyid/${uStaff_id}`
  );
  let data = await readStaffid.json();
  return data[0].staff_name;
};

export const userLogin = async (uEmail: string, uPwd: string) => {
  let response;
  let data;
  try {
    response = await fetch(`http://${HOST}:${PORT}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uEmail: uEmail,
        Pwd: uPwd,
      }),
    });
    data = await response.json();
    return data;
  } catch (error) {
    return "Unauthorized";
  }
};

export const userSignin = async (
  uEmail: string,
  uPwd: string,
  sID: number | undefined
) => {
  try {
    const response = await fetch(`http://${HOST}:${PORT}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uEmail: uEmail,
        password: uPwd,
        staff_ID: sID,
      }),
    });
    let data = await response.json();
    return data;
  } catch (error) {
    return "No";
  }
};

export const getAllOpenTickets = async () => {
  const response = await fetch(`http://${HOST}:${PORT}/openticketscount`);
  let data = await response.json();
  return data[0].open_tickets;
};

export const getAllClosedTickets = async () => {
  const response = await fetch(`http://${HOST}:${PORT}/closedticketscount`);
  let data = await response.json();
  return data[0].closed_tickets;
};

export const getOpenDepartment = async () => {
  const response = await fetch(
    `http://${HOST}:${PORT}/openticketdepartmentcount`
  );
  let data = await response.json();
  return data[0].open_tickets_department;
};

export const getOpenStaff = async (staff_id: number) => {
  const response = await fetch(`http://${HOST}:${PORT}/openticketforstaff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      staff_id: staff_id,
    }),
  });
  let data = await response.json();
  return data.count;
};

export const getAllTickets = async () => {
  const response = await fetch(`http://${HOST}:${PORT}/tableticketsall`);
  let data = await response.json();
  return data;
};

export const getAllStaffs = async () => {
  const response = await fetch(`http://${HOST}:${PORT}/allstaffs`);
  let data = await response.json();
  return data;
};

export const createStaff = async (
  staffName: string,
  staffDepartment: string
) => {
  try {
    await fetch(`http://${HOST}:${PORT}/createStaff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: staffName,
        department: staffDepartment,
      }),
    });
  } catch (error) {
    return error;
  }
  return;
};

export const editStaff = async (
  id: number,
  staffName: string,
  staffDepartment: string
) => {
  const response = await fetch(`http://${HOST}:${PORT}/editStaff`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      name: staffName,
      department: staffDepartment,
    }),
  });
};

export const delStaff = async (id: number) => {
  const response = await fetch(`http://${HOST}:${PORT}/delStaff`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  });
};

export const createTicket = async (
  title: string,
  what: string,
  personid: number | undefined,
  project_id: number
) => {
  await fetch(`http://${HOST}:${PORT}/createticket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      what: what,
      personid: personid,
      project_id: project_id,
    }),
  });
};

export const editTicket = async (
  id: number,
  title: string,
  what: string,
  personid: number | undefined,
  open: any
) => {
  open ? (open = 1) : (open = 0);

  const response = await fetch(`http://${HOST}:${PORT}/editTicket`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      ticket_title: title,
      description: what,
      staff_id: personid,
      status: open,
    }),
  });
};

export const delTicket = async (id: number) => {
  const response = await fetch(`http://${HOST}:${PORT}/delticket`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      delticketID: id,
    }),
  });
  const result = response.json();
  return result;
};

export const getAllProjects = async () => {
  const response = await fetch(`http://${HOST}:${PORT}/getprojects`);
  let data = await response.json();
  return data;
};

export const createProject = async (
  project_name: string,
  project_description: string
) => {
  const result = await fetch(`http://${HOST}:${PORT}/createproject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project: project_name,
      description: project_description,
    }),
  });
  return result;
};

export const projectNameToID = async (name: string) => {
  const readStaffid = await fetch(
    `http://${HOST}:${PORT}/findProjectByName/${name}`
  );
  let data = await readStaffid.json();
  return data[0].id;
};

export const getCommentsByTicketID = async (tid: number) => {
  const response = await fetch(
    `http://${HOST}:${PORT}/commentsbyticketid/${tid}`
  );
  let data = await response.json();
  return data;
};

export const createCommentToTicket = async (
  comment_message: string,
  ticket_id: number,
  staff_id: number
) => {
  const result = await fetch(`http://${HOST}:${PORT}/createcommenttoticket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      comment_message: comment_message,
      ticket_id: ticket_id,
      staff_id: staff_id,
    }),
  });
  return result;
};

export const getOpenTicketsForStaff = async (sid: number, pid: number) => {
  try {
    const response = await fetch(`http://${HOST}:${PORT}/openticketsforstaff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sid: sid,
        pid: pid,
      }),
    });
    let data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getOpenTicketsForDepartment = async (
  department: string,
  pid: number
) => {
  try {
    const response = await fetch(
      `http://${HOST}:${PORT}/openticketsfordepartment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department: department,
          pid: pid,
        }),
      }
    );
    let data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getTicketStatus = async (pid: number) => {
  const response = await fetch(
    `http://${HOST}:${PORT}/getticketsofproject/${pid}`
  );
  let data = await response.json();
  return data;
};
export const getTicketStatusFromDiffDepartment = async (pid: number) => {
  const response = await fetch(
    `http://${HOST}:${PORT}/getticketsfromdiffdepartment/${pid}`
  );
  let data = await response.json();
  return data;
};

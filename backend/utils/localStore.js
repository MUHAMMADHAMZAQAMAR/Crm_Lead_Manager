const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const dataFilePath = path.join(__dirname, "..", "data", "local-db.json");

let writeQueue = Promise.resolve();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function publicUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

async function ensureStore() {
  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify({ users: [], leads: [] }, null, 2), "utf8");
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(dataFilePath, "utf8");
  return JSON.parse(raw);
}

async function writeStore(store) {
  await fs.writeFile(dataFilePath, JSON.stringify(store, null, 2), "utf8");
}

function runExclusive(task) {
  const nextTask = writeQueue.then(task, task);
  writeQueue = nextTask.catch(() => {});
  return nextTask;
}

async function findUserByEmail(email) {
  const store = await readStore();
  return store.users.find((user) => user.email === normalizeEmail(email)) || null;
}

async function findUserById(id) {
  const store = await readStore();
  return store.users.find((user) => user._id === String(id)) || null;
}

async function createUser({ name, email, password }) {
  return runExclusive(async () => {
    const store = await readStore();
    const normalizedEmail = normalizeEmail(email);

    if (store.users.some((user) => user.email === normalizedEmail)) {
      const error = new Error("An account with this email already exists");
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const timestamp = new Date().toISOString();
    const user = {
      _id: crypto.randomUUID(),
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.users.push(user);
    await writeStore(store);
    return publicUser(user);
  });
}

async function verifyUserPassword(user, enteredPassword) {
  if (!user) {
    return false;
  }

  return bcrypt.compare(enteredPassword, user.password);
}

function matchesSearch(value, search) {
  return String(value || "").toLowerCase().includes(String(search || "").toLowerCase());
}

async function createLead({ name, email, phone, status = "new", assignedTo = "Unassigned", createdBy }) {
  return runExclusive(async () => {
    const store = await readStore();
    const timestamp = new Date().toISOString();
    const lead = {
      _id: crypto.randomUUID(),
      name: String(name).trim(),
      email: normalizeEmail(email),
      phone: String(phone).trim(),
      status,
      assignedTo: String(assignedTo || "Unassigned").trim() || "Unassigned",
      createdBy: String(createdBy),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.leads.push(lead);
    await writeStore(store);
    return lead;
  });
}

async function listLeads({ createdBy, status, search, page = 1, limit = 10 }) {
  const store = await readStore();
  let leads = store.leads.filter((lead) => lead.createdBy === String(createdBy));

  if (status && status !== "all") {
    leads = leads.filter((lead) => lead.status === status);
  }

  if (search) {
    leads = leads.filter((lead) =>
      matchesSearch(lead.name, search) || matchesSearch(lead.email, search) || matchesSearch(lead.phone, search)
    );
  }

  leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalLeads = leads.length;
  const startIndex = (page - 1) * limit;

  return {
    leads: leads.slice(startIndex, startIndex + limit),
    totalLeads,
    totalPages: Math.ceil(totalLeads / limit),
  };
}

async function findLeadByIdAndOwner(id, createdBy) {
  const store = await readStore();
  return store.leads.find((lead) => lead._id === String(id) && lead.createdBy === String(createdBy)) || null;
}

async function updateLeadStatus({ id, createdBy, status }) {
  return runExclusive(async () => {
    const store = await readStore();
    const lead = store.leads.find((item) => item._id === String(id) && item.createdBy === String(createdBy));

    if (!lead) {
      return null;
    }

    lead.status = status;
    lead.updatedAt = new Date().toISOString();
    await writeStore(store);
    return lead;
  });
}

async function deleteLead({ id, createdBy }) {
  return runExclusive(async () => {
    const store = await readStore();
    const index = store.leads.findIndex((lead) => lead._id === String(id) && lead.createdBy === String(createdBy));

    if (index === -1) {
      return null;
    }

    const [removedLead] = store.leads.splice(index, 1);
    await writeStore(store);
    return removedLead;
  });
}

async function getLeadAnalytics(createdBy) {
  const store = await readStore();
  const relevantLeads = store.leads.filter((lead) => lead.createdBy === String(createdBy));
  const result = { new: 0, contacted: 0, converted: 0 };

  relevantLeads.forEach((lead) => {
    if (result[lead.status] !== undefined) {
      result[lead.status] += 1;
    }
  });

  result.total = result.new + result.contacted + result.converted;
  return result;
}

module.exports = {
  publicUser,
  findUserByEmail,
  findUserById,
  createUser,
  verifyUserPassword,
  createLead,
  listLeads,
  findLeadByIdAndOwner,
  updateLeadStatus,
  deleteLead,
  getLeadAnalytics,
};
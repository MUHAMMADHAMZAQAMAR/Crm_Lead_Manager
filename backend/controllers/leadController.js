const Lead = require("../models/Lead");
const { shouldUseLocalStore } = require("../utils/runtimeMode");
const localStore = require("../utils/localStore");

async function createLead(req, res, next) {
  try {
    const { name, email, phone, status, assignedTo } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }

    const lead = shouldUseLocalStore()
      ? await localStore.createLead({
          name,
          email,
          phone,
          status,
          assignedTo,
          createdBy: req.user._id,
        })
      : await Lead.create({
          name,
          email,
          phone,
          status,
          assignedTo,
          createdBy: req.user._id,
        });

    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
}

async function getLeads(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { status, search } = req.query;

    const filter = { createdBy: req.user._id };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const useLocalStore = shouldUseLocalStore();
    const result = useLocalStore
      ? await localStore.listLeads({
          createdBy: req.user._id,
          status,
          search,
          page,
          limit,
        })
      : await Promise.all([
          Lead.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
          Lead.countDocuments(filter),
        ]);

    const leads = useLocalStore ? result.leads : result[0];
    const total = useLocalStore ? result.totalLeads : result[1];

    res.json({
      leads,
      page,
      totalPages: Math.ceil(total / limit),
      totalLeads: total,
    });
  } catch (err) {
    next(err);
  }
}

async function updateLeadStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!["new", "contacted", "converted"].includes(status)) {
      return res.status(400).json({ message: "Status must be new, contacted, or converted" });
    }

    // findOneAndUpdate with both _id AND createdBy in the filter does
    // double duty: it finds the lead AND enforces ownership in one step,
    // so a user can never update someone else's lead by guessing an id.
    const lead = shouldUseLocalStore()
      ? await localStore.updateLeadStatus({
          id: req.params.id,
          createdBy: req.user._id,
          status,
        })
      : await Lead.findOneAndUpdate(
          { _id: req.params.id, createdBy: req.user._id },
          { status },
          { new: true, runValidators: true }
        );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (err) {
    next(err);
  }
}

async function deleteLead(req, res, next) {
  try {
    const lead = shouldUseLocalStore()
      ? await localStore.deleteLead({
          id: req.params.id,
          createdBy: req.user._id,
        })
      : await Lead.findOneAndDelete({
          _id: req.params.id,
          createdBy: req.user._id,
        });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead deleted", id: req.params.id });
  } catch (err) {
    next(err);
  }
}

async function getAnalytics(req, res, next) {
  try {
    const result = shouldUseLocalStore()
      ? await localStore.getLeadAnalytics(req.user._id)
      : await Lead.aggregate([
          { $match: { createdBy: req.user._id } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]).then((counts) => {
          const analytics = { new: 0, contacted: 0, converted: 0 };
          counts.forEach((c) => {
            analytics[c._id] = c.count;
          });
          analytics.total = analytics.new + analytics.contacted + analytics.converted;
          return analytics;
        });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { createLead, getLeads, updateLeadStatus, deleteLead, getAnalytics };

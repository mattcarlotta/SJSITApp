import { Event, Token, User } from "models";
import {
  createMemberEventCount,
  createMemberResponseCount,
  getMonthDateRange,
  getUsers,
  sendError,
} from "shared/helpers";
import {
  emailAlreadyTaken,
  missingEventId,
  missingMemberId,
  missingUpdateMemberParams,
  missingUpdateMemberStatusParams,
  unableToDeleteMember,
  unableToLocateEvent,
  unableToLocateMember,
} from "shared/authErrors";

const deleteMember = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!_id) throw missingMemberId;

    const existingUser = await User.findOne({ _id });
    if (!existingUser) throw unableToDeleteMember;

    await existingUser.delete();
    await Token.deleteOne({ email: existingUser.email });

    res.status(200).json({ message: "Successfully deleted the member." });
  } catch (err) {
    return sendError(err, res);
  }
};

const getAllMembers = async (_, res) => {
  const members = await getUsers({
    match: {
      role: { $ne: "admin" },
    },
    project: {
      role: 1,
      status: 1,
      registered: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
    },
  });

  res.status(200).json({ members });
};

const getAllMemberNames = async (_, res) => {
  try {
    /* istanbul ignore next */
    const members = await getUsers({
      match: {
        role: { $ne: "admin" },
        status: "active",
      },
      project: {
        id: 1,
        email: {
          $concat: ["$firstName", " ", "$lastName", " ", "<", "$email", ">"],
        },
      },
    });

    res.status(200).json({ members });
  } catch (err) {
    /* istanbul ignore next */
    return sendError(err, res);
  }
};

const getMember = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!_id) throw missingMemberId;

    const existingMember = await User.findOne(
      { _id },
      { password: 0, token: 0, events: 0 },
    );
    if (!existingMember) throw unableToLocateMember;

    res.status(200).json({ member: existingMember });
  } catch (err) {
    return sendError(err, res);
  }
};

const getMemberEventCounts = async (req, res) => {
  try {
    const { eventId } = req.query;
    if (!eventId) throw missingEventId;

    /* istanbul ignore next */
    const members = await getUsers({
      match: {
        role: { $nin: ["admin", "staff"] },
      },
      project: {
        _id: 1,
        name: { $concat: ["$firstName", " ", "$lastName"] },
      },
    });

    const eventExists = await Event.findOne({ _id: eventId }, { eventDate: 1 });
    if (!eventExists) throw unableToLocateEvent;

    const { startOfMonth, endOfMonth } = getMonthDateRange(
      eventExists.eventDate,
    );

    const memberEventCounts = await Event.aggregate([
      {
        $match: {
          eventDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $unwind: {
          path: "$scheduledIds",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: "$scheduledIds",
          eventCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      members: createMemberEventCount({
        members,
        memberEventCounts,
      }),
    });
  } catch (err) {
    return sendError(err, res);
  }
};

const getMemberAvailability = async (req, res) => {
  try {
    const { id: _id, selectedDate } = req.query;

    const existingMember = await User.findOne(
      { _id: _id || req.session.user.id },
      { _id: 1 },
    );
    if (!existingMember) throw unableToLocateMember;

    const { startOfMonth, endOfMonth } = getMonthDateRange(selectedDate);

    const eventCount = await Event.countDocuments({
      eventDate: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });
    if (eventCount === 0) return res.status(200).send(null);

    const eventResponses = await Event.aggregate([
      {
        $match: {
          eventDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $addFields: {
          employeeResponses: {
            $map: {
              input: {
                $filter: {
                  input: "$employeeResponses",
                  cond: {
                    $eq: ["$$this._id", existingMember._id],
                  },
                },
              },
              in: "$$this.response",
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          responses: {
            $push: {
              $ifNull: [
                { $arrayElemAt: ["$employeeResponses", 0] },
                "No response.",
              ],
            },
          },
        },
      },
    ]);

    const scheduledCount = await Event.countDocuments({
      eventDate: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
      scheduledIds: {
        $in: [existingMember.id],
      },
    });

    res.status(200).json({
      memberResponseCount: createMemberResponseCount(eventResponses),
      memberScheduleEvents: [
        {
          id: "scheduled",
          events: scheduledCount,
        },
        {
          id: "available",
          events: eventCount,
        },
      ],
    });
  } catch (err) {
    return sendError(err, res);
  }
};

const getMemberEvents = async (req, res) => {
  try {
    const { id: _id, selectedDate } = req.query;
    if (!_id) throw missingMemberId;

    const existingMember = await User.findOne(
      { _id },
      { password: 0, token: 0, events: 0 },
    );
    if (!existingMember) throw unableToLocateMember;

    const { startOfMonth, endOfMonth } = getMonthDateRange(selectedDate);

    const events = await Event.aggregate([
      {
        $match: {
          eventDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      { $unwind: "$employeeResponses" },
      { $match: { "employeeResponses._id": existingMember._id } },
      { $sort: { eventDate: 1 } },
      {
        $group: {
          _id: null,
          eventResponses: {
            $push: {
              _id: "$_id",
              team: "$team",
              opponent: "$opponent",
              eventDate: "$eventDate",
              eventType: "$eventType",
              eventNotes: "$notes",
              location: "$location",
              employeeResponse: "$employeeResponses.response",
              employeeNotes: "$employeeResponses.notes",
            },
          },
        },
      },
      { $project: { _id: 0, eventResponses: 1 } },
    ]);

    res.status(200).json({ ...events[0] });
  } catch (err) {
    return sendError(err, res);
  }
};

const updateMember = async (req, res) => {
  try {
    const {
      _id, email, firstName, lastName, role,
    } = req.body;
    if (!_id || !email || !firstName || !lastName || !role) throw missingUpdateMemberParams;

    const existingMember = await User.findOne({ _id });
    if (!existingMember) throw unableToLocateMember;

    if (existingMember.email !== email) {
      const emailInUse = await User.findOne({ email });
      if (emailInUse) throw emailAlreadyTaken;
    }

    await existingMember.updateOne({
      email,
      firstName,
      lastName,
      role,
    });

    res
      .status(201)
      .json({ message: "Successfully updated the member profile." });
  } catch (err) {
    return sendError(err, res);
  }
};

const updateMemberStatus = async (req, res) => {
  try {
    const { _id, status } = req.body;
    if (!_id || !status) throw missingUpdateMemberStatusParams;

    const existingMember = await User.findOne({ _id });
    if (!existingMember) throw unableToLocateMember;

    const updatedStatus = status === "active" ? "suspended" : "active";

    await existingMember.updateOne({ status: updatedStatus });

    const newStatus = status === "active" ? "suspended" : "reactivated";

    res.status(201).json({ message: `Member has been ${newStatus}.` });
  } catch (err) {
    return sendError(err, res);
  }
};

export {
  deleteMember,
  getAllMembers,
  getAllMemberNames,
  getMember,
  getMemberAvailability,
  getMemberEventCounts,
  getMemberEvents,
  updateMember,
  updateMemberStatus,
};

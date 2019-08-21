import Promise from "bluebird";
import { Event, Form, Season } from "models";
import { sendError } from "shared/helpers";
import {
  missingFormId,
  unableToCreateNewForm,
  unableToDeleteForm,
  unableToLocateEvent,
  unableToLocateForm,
  unableToLocateSeason,
  unableToUpdateApForm,
  unableToUpdateForm,
} from "shared/authErrors";

const createForm = async (req, res) => {
  try {
    const { expirationDate, enrollMonth, notes, seasonId } = req.body;

    if (!seasonId || !expirationDate || !enrollMonth)
      throw unableToCreateNewForm;

    const seasonExists = await Season.findOne({ seasonId });
    if (!seasonExists) throw unableToLocateSeason;

    const [startMonth, endMonth] = enrollMonth;
    await Form.create({
      seasonId,
      startMonth,
      endMonth,
      expirationDate,
      notes,
    });

    res.status(201).json({ message: "Successfully created a new form!" });
  } catch (err) {
    return sendError(err, res);
  }
};

const deleteForm = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!_id) throw missingFormId;

    const existingEvent = await Form.findOne({ _id });
    if (!existingEvent) throw unableToDeleteForm;

    await existingEvent.delete();

    res.status(200).json({ message: "Successfully deleted the form." });
  } catch (err) {
    return sendError(err, res);
  }
};

const getAllForms = async (_, res) => {
  const forms = await Form.aggregate([
    {
      $project: {
        seasonId: 1,
        startMonth: 1,
        endMonth: 1,
        expirationDate: 1,
        notes: 1,
      },
    },
  ]);

  res.status(200).json({ forms });
};

const getForm = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!_id) throw missingFormId;

    const existingForm = await Form.findOne({ _id }, { __v: 0 });
    if (!existingForm) throw unableToLocateForm;

    res.status(200).json({ form: existingForm });
  } catch (err) {
    return sendError(err, res);
  }
};

const updateForm = async (req, res) => {
  try {
    const { _id, expirationDate, enrollMonth, notes, seasonId } = req.body;

    if (!_id || !seasonId || !expirationDate || !enrollMonth)
      throw unableToUpdateForm;

    const seasonExists = await Season.findOne({ seasonId });
    if (!seasonExists) throw unableToLocateSeason;

    const formExists = await Form.findOne({ _id });
    if (!formExists) throw unableToLocateForm;

    const [startMonth, endMonth] = enrollMonth;
    await formExists.updateOne({
      seasonId,
      startMonth,
      endMonth,
      expirationDate,
      notes,
    });

    res.status(201).json({ message: "Successfully updated the form!" });
  } catch (err) {
    return sendError(err, res);
  }
};

const updateFormAp = async (req, res) => {
  try {
    const { _id, responses, notes } = req.body;

    if (!_id || !responses) throw unableToUpdateApForm;

    const formExists = await Form.findOne({ _id });
    if (!formExists) throw unableToLocateForm;

    await Promise.each(responses, async response => {
      const eventExists = await Event.findOne({ _id: response.id });
      if (!eventExists) throw unableToLocateEvent;

      await eventExists.updateOne({
        $addToSet: {
          employeeResponses: {
            _id: req.session.user.id,
            response: response.value,
            notes,
          },
        },
      });
    });

    res
      .status(201)
      .json({ message: "Successfully added your responses to the A/P form!" });
  } catch (err) {
    return sendError(err, res);
  }
};

const viewApForm = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!_id) throw missingFormId;

    const existingForm = await Form.findOne({ _id }, { __v: 0, seasonId: 0 });
    if (!existingForm) throw unableToLocateForm;

    const events = await Event.aggregate([
      {
        $match: {
          eventDate: {
            $gte: new Date(existingForm.startMonth),
            $lte: new Date(existingForm.endMonth),
          },
        },
      },
      { $unwind: "$eventDate" },
      { $sort: { eventDate: 1 } },
      {
        $project: {
          __id: 1,
          location: 1,
          team: 1,
          opponent: 1,
          eventDate: 1,
          eventType: 1,
          notes: 1,
        },
      },
    ]);

    res.status(200).json({ form: existingForm, events });
  } catch (err) {
    return sendError(err, res);
  }
};

export {
  createForm,
  deleteForm,
  getAllForms,
  getForm,
  updateForm,
  updateFormAp,
  viewApForm,
};
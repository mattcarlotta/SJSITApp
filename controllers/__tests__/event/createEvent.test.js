import { createEvent } from "controllers/event";
import {
  invalidCreateEventRequest,
  invalidEventDate,
  mustContainUniqueCallTimes,
  unableToLocateSeason,
} from "shared/authErrors";

describe("Create Event Controller", () => {
  let res;
  beforeEach(() => {
    res = mockResponse();
  });

  let db;
  beforeAll(() => {
    db = connectDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  it("handles empty body requests", async () => {
    const emptyBody = {
      callTimes: "",
      eventDate: "",
      eventType: "",
      location: "",
      notes: "",
      opponent: "",
      seasonId: "",
      team: "",
      uniform: "",
    };
    const req = mockRequest(null, null, emptyBody);

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: invalidCreateEventRequest,
    });
  });

  it("handles duplicate callTimes", async () => {
    const seasonId = "19992000";
    const newEvent = {
      callTimes: ["1999-10-09T19:00:38-07:00", "1999-10-09T19:00:38-07:00"],
      eventDate: "1999-10-11T02:30:30.036+00:00",
      eventType: "Game",
      team: "San Jose Barracuda",
      opponent: "San Diego Gulls",
      location: "SAP Center at San Jose",
      notes: "",
      seasonId,
      uniform: "Barracuda Jersey",
    };

    const req = mockRequest(null, null, newEvent);

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: mustContainUniqueCallTimes,
    });
  });

  it("handles invalid seasonId requests", async () => {
    const seasonId = "19992000";
    const newEvent = {
      callTimes: ["1999-10-09T19:00:38-07:00"],
      eventDate: "1999-10-11T02:30:30.036+00:00",
      eventType: "Game",
      team: "San Jose Barracuda",
      opponent: "San Diego Gulls",
      location: "SAP Center at San Jose",
      notes: "",
      seasonId,
      uniform: "Barracuda Jersey",
    };

    const req = mockRequest(null, null, newEvent);

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToLocateSeason,
    });
  });

  it("handles invalid event date requests", async () => {
    const seasonId = "20002001";
    const newEvent = {
      callTimes: ["2008-10-09T19:00:38-07:00"],
      eventDate: "2008-10-11T02:30:30.036+00:00",
      eventType: "Game",
      team: "San Jose Barracuda",
      opponent: "San Diego Gulls",
      location: "SAP Center at San Jose",
      notes: "",
      seasonId,
      uniform: "Barracuda Jersey",
    };

    const req = mockRequest(null, null, newEvent);

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: invalidEventDate(seasonId, "09/26/2000", "06/12/2001"),
    });
  });

  it("handles valid create event requests", async () => {
    const seasonId = "20002001";
    const newEvent = {
      callTimes: ["2000-10-09T19:00:38-07:00"],
      eventDate: "2000-10-11T02:30:30.036+00:00",
      eventType: "Game",
      team: "San Jose Barracuda",
      opponent: "San Diego Gulls",
      location: "SAP Center at San Jose",
      notes: "",
      seasonId,
      uniform: "Barracuda Jersey",
    };

    const req = mockRequest(null, null, newEvent);

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith({
      message: `Successfully added a new event to the ${seasonId} season.`,
    });
  });
});

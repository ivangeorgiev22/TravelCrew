import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTrips, getTrip, postTrip, updateTrip, deleteTrip } from './tripController';
import * as models from '../models';
import { Request } from 'express';

//mock models 

vi.mock('../models', () => ({
  Trip: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    destroy: vi.fn(),
    update: vi.fn(),
  },
  Activity: {
    destroy: vi.fn(),
  },
  TripMember: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
  User: {},
}));

// casting - tells TypeScript how to treat the mocked models
const TripMock = models.Trip as unknown as {
  findAll: ReturnType<typeof vi.fn>;
  findByPk: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

const ActivityMock = models.Activity as unknown as {
  destroy: ReturnType<typeof vi.fn>;
};

const TripMemberMock = models.TripMember as unknown as {
  findOne: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
};

//Mock req,res

const mockReq = (data = {}) => ({
  body: {},
  params: {},
  user: { id: 1 },
  ...data,
}) as unknown as Request;

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

// Reusable trip data 

const mockTrip = {
  destination: "Paris, France",
  startDate: "2026-03-24",
  endDate: "2026-03-27"
};

beforeEach(() => {
  vi.clearAllMocks()
});


describe("Get Trips", () => {
  it("Returns ownTrips and memberTrips", async () => {
    const req = mockReq();
    const res = mockRes();

    TripMock.findAll
    .mockResolvedValueOnce([{ id: 1 }])
    .mockResolvedValueOnce([{ id: 2 }]);

    await getTrips(req,res);

    expect(TripMock.findAll).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      ownTrips: [{ id: 1 }],
      memberTrips: [{ id: 2 }],
    });
  });

  it("Returns 500 on error", async () => {
    const req = mockReq();
    const res = mockRes();

    TripMock.findAll.mockRejectedValue(new Error("Internal Server Error"));

    await getTrips(req,res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("Get a Single Trip", () => {

  it("Returns trip if found", async () => {
    const req = mockReq({params: { id: "1" }});
    const res = mockRes();

    TripMock.findByPk.mockResolvedValue({ id: "1" });

    await getTrip(req,res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("Returns 404 if trip is not found", async () => {
    const req = mockReq({params: { id: "1" }});
    const res = mockRes();

    TripMock.findByPk.mockResolvedValue(null);

    await getTrip(req,res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("Post Trip", () => {
  
  it("Creates trip and adds owner", async () => {
    const req = mockReq({ body: mockTrip });
    const res = mockRes();

    TripMock.create.mockResolvedValue({ id: 10 });

    await postTrip(req,res);

    expect(TripMock.create).toHaveBeenCalled();
    expect(TripMemberMock.create).toHaveBeenCalledWith({
      userId: 1,
      tripId: 10,
      role: "owner",
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("Returns 400 if missing fields", async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();

    await postTrip(req,res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("Delete a trip", () => {

  it("Returns 403 if user is not the owner", async () => {
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    TripMemberMock.findOne.mockResolvedValue(null);

    await deleteTrip(req,res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("Returns 404 if trip is not found", async () => {
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    TripMemberMock.findOne.mockResolvedValue({ id: 1 });
    TripMock.destroy.mockResolvedValue(0);

    await deleteTrip(req,res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("Deletes trip successfully", async () => {
    const req = mockReq({ params: { id: "1" } });
    const res = mockRes();

    TripMemberMock.findOne.mockResolvedValue({ id: 1 });
    TripMock.destroy.mockResolvedValue(1);

    await deleteTrip(req,res);

    expect(res.status).toHaveBeenCalledWith(204);
  });
});

describe("Update a trip", () => {

  it("Returns 400 if missing fields", async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();

    await updateTrip(req,res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("Returns 403 if user is not the owner", async () => {
    const req = mockReq({ params: { id: "1" }, body: mockTrip });
    const res = mockRes();

    TripMemberMock.findOne.mockResolvedValue(null);

    await updateTrip(req,res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("Deletes trip and removes out of range activities", async () => {
    const req = mockReq({ params: { id: 1 }, body: mockTrip });
    const res = mockRes();

    TripMemberMock.findOne.mockResolvedValue({ id: 1 });
    
    await updateTrip(req,res);

    expect(TripMock.update).toHaveBeenCalled();
    expect(ActivityMock.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("Returns 500 on error", async () => {
    const req = mockReq({ params: { id: 1 }, body: mockTrip });
    const res = mockRes();

    TripMemberMock.findOne.mockRejectedValue(new Error("Internal Server Error"));

    await updateTrip(req,res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
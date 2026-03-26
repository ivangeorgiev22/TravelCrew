import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from './activityRoutes';
import { Request, Response, NextFunction } from 'express';

vi.mock("../controllers/activityController", () => ({
    getActivities : vi.fn((req, res) => res.status(200).json({message : "All Activities"})),
    postActivity: vi.fn((req, res) => res.status(201).json({message : "Added Activity"})), 
    editActivity: vi.fn((req, res) => res.status(200).json({message : "Activity Updated"})), 
    deleteActivity: vi.fn((req, res) => res.status(204).json({message: "Activity deleted"}))
}));

vi.mock("../middleware/authMiddleware", () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => {
    req.user = {id: "1"};
    next();
  },
}));

const app = express();
app.use(express.json());
app.use('/activities', router)

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Get Activities", () => {
    it('GET/ All activities on TripId', async () => {
        const res = await request(app).get('/activities/trip/1');
        expect(res.status).toBe(200); 
        expect(res.body).toEqual({message : "All Activities"})
    })
})

describe("Add an activity", () => {
    it('POST/ An Activity on TripId', async () => {
        const res = await request(app).post(`/activities`);
        expect(res.status).toBe(201); 
        expect(res.body).toEqual({message : "Added Activity"})
    } )
})

describe("Edit an activity", () => {
    it('PATCH/ An Activity on TripId', async () => {
        const ActivityId = 1;
        const res = await request(app).patch(`/activities/${ActivityId}`);
        expect(res.status).toBe(200); 
        expect(res.body).toEqual({message : "Activity Updated"})
    } )
})

describe("Deleted an activity", () => {
    it('DELETE/ An Activity on TripId', async () => {
        const ActivityId = 2; 
        const res = await request(app).delete(`/activities/${ActivityId}`);
        expect(res.status).toBe(204); 
    })
})





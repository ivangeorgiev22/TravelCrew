import { vi, describe, it, expect } from 'vitest';
import {Request, Response} from 'express';
import * as models from '../models';
import { getActivities, postActivity, editActivity, deleteActivity } from './activityController';

vi.mock('../models', () => ({
     Activity:  {
      findAll: vi.fn(),
      create: vi.fn(), 
      update: vi.fn(), 
      destroy: vi.fn()
    }
}))

const ActivityMock = models.Activity as unknown as {
    findAll: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    destroy: ReturnType<typeof vi.fn>
}
 
describe('getActivities', () => {
    it('GET/get the list of activities', async () => {
        const mockData = [{name: 'Picasso Museum', location: 'Barcelona', date: '2026-03-30', time:'09:46'}];
        (ActivityMock.findAll as any).mockResolvedValue(mockData);

        const req = {params: {tripId: 1}} as unknown as Request; 
        const res = {
            status: vi.fn().mockReturnThis(), 
            json: vi.fn().mockReturnThis()
        } as unknown as Response; 

        await getActivities(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockData); 

    })

describe('Add an activity', () => {
    it('POST/Post a new activity', async () => {
        const mockData = {name: 'Museum MOCO', location: 'Barcelona', date: '2026-03-30', time:'10:46', tripId: 1}; 
        const req = {body: {...mockData}, user: {id:1}} as unknown as Request; 
        const res = {
            status: vi.fn().mockReturnThis(), 
            json: vi.fn()
        } as unknown as Response

        const createActivity = {...mockData, id: 1}
        ActivityMock.create.mockResolvedValue(createActivity)
        await postActivity(req, res); 
        expect(ActivityMock.create).toHaveBeenCalledWith({...mockData, createdBy:1}); 
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(createActivity)
    })

});

describe('Edit an activity', () => {
    it('PATCH/ Modify an activity', async () => {
      const mockData = {name: 'Museum MOCO', location: 'Barcelona', date: '2026-03-30', time:'10:46', tripId: 1}
      const req = {body: {...mockData}, params: {id:2}} as unknown as Request;
      const res = {
        status: vi.fn().mockReturnThis(), 
        json: vi.fn()
      } as unknown as Response

      const modifyActivity = {...mockData, where:{id:2} }
      ActivityMock.update.mockResolvedValue([modifyActivity])
      await editActivity(req, res);
      expect(ActivityMock.update).toHaveBeenCalledWith({...mockData}, {where:{id:2}})
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({msg: "Activity updated"});
    })
})

describe('Delete an activity', () => {
  it('DELETE/ Delete an activity', async () => {
    const mockData = {name: 'Museum MOCO', location: 'Barcelona', date: '2026-03-30', time:'10:46', tripId: 1}
      const req = {body: {...mockData}, params: {id:2}} as unknown as Request;
      const res = {
        status: vi.fn().mockReturnThis(), 
        json: vi.fn()
      } as unknown as Response

      const deleteAct = {...mockData, where:{id:2} }
      ActivityMock.destroy.mockResolvedValue(deleteAct)
      await deleteActivity(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({msg: "Activity deleted"});
  })
})
});
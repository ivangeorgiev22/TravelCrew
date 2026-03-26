import { describe, vi, expect, it, beforeEach } from "vitest";
import axios from "axios";
import { getActivities, createActivity, editActivity, deleteActivity } from "./activityService";

vi.mock('axios');
const apiURL = "http://127.0.0.1:3000/activities";

const mockToken = "12345"; 

beforeEach(() => {
//mock localStorage
  const store: Record<string, string> = {};
  vi.stubGlobal("localStorage", {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => {
    store[key] = value;
},
    removeItem: (key: string) => {
        delete store[key];
    },
    clear: () => {
        Object.keys(store).forEach((key) => delete store[key]);
    },
});
localStorage.setItem("token", mockToken);
});

describe('Get Activities', () => {
    it('GET/ All Activities', async() => {
        const tripId = 1;
        vi.mocked(axios.get).mockResolvedValue({data: tripId})
        await getActivities(tripId);
        expect(localStorage.getItem("Token"))
        expect(axios.get).toHaveBeenCalledWith(`${apiURL}/trip/${tripId}`, {
            headers: {
      Authorization: `Bearer ${mockToken}`,
   }});
    })
})

describe('Create Activities', () => {
    it('POST/ Create an Activity', async() => {
        const activityId = 2;
        const mockActivity = {id : 2, name: 'Museum MOCO', location: 'Barcelona', date: '2026-03-30', time:'10:46', tripId: 1};
        vi.mocked(axios.post).mockResolvedValue({data: activityId})
        await createActivity(mockActivity);
        expect(localStorage.getItem("Token"))
        expect(axios.post).toHaveBeenCalledWith(`${apiURL}`, mockActivity, {
            headers: {
      Authorization: `Bearer ${mockToken}`,
   }});
    })
})

describe('Edit Activities', () => {
    it('PATCH/ Edit an Activity', async() => {
        const activityId = 2;
        const mockActivity = {id : 2, name: 'Museum MOCO', location: 'Barcelona', date: '2026-03-30', time:'10:46', tripId: 1};
        vi.mocked(axios.patch).mockResolvedValue({data: activityId})
        await editActivity(activityId, mockActivity);
        expect(localStorage.getItem("Token"))
        expect(axios.patch).toHaveBeenCalledWith(`${apiURL}/${mockActivity.id}`, mockActivity, {
            headers: {
      Authorization: `Bearer ${mockToken}`,
   }});
    })
})

describe('Delete Activities', () => {
    it('DELETE/ Edit an Activity', async() => {
        const activityId = 2;
        const mockActivity = {id : 2, name: 'Museum MOCO', location: 'Barcelona', date: '2026-03-30', time:'10:46', tripId: 1};
        vi.mocked(axios.delete).mockResolvedValue({data: activityId})
        await deleteActivity(activityId);
        expect(localStorage.getItem("Token"))
        expect(axios.delete).toHaveBeenCalledWith(`${apiURL}/${mockActivity.id}`, {
            headers: {
      Authorization: `Bearer ${mockToken}`,
   }});
    })
})


import { describe, vi, expect, it, beforeEach, afterEach } from "vitest";
import ActivityForm from "./AcitivityForm";
import { createActivity, editActivity } from "../services/activityService";
import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import axios from "axios"


const mockFormData = {
    tripId: 1,
    name: 'Museum MOCO', 
    location: 'Barcelona', 
    date: '2026-03-30', 
    time:'10:46'
}

vi.mock("axios");
const mockOnClose = vi.fn(); 
const mockOnActivityCreate = vi.fn();

const formElements = () =>({
    nameInput: screen.getByLabelText(/Name/i) as HTMLInputElement, 
    locationInput: screen.getByLabelText(/Location/i) as HTMLInputElement, 
    dateInput: screen.getByLabelText(/Date/i) as HTMLInputElement,
    timeInput: screen.getByLabelText(/Time/i) as HTMLInputElement,
    button: screen.getByRole("button", {name: /Add/i}),
});

const fillActivityForm = async(user: ReturnType<typeof userEvent.setup>) => {
    const {nameInput, locationInput, dateInput, timeInput, button} = formElements(); 
    await user.type(nameInput, mockFormData.name); 
    await user.type(locationInput, mockFormData.location); 
    await user.type(dateInput, mockFormData.date); 
    await user.type(timeInput, mockFormData.time); 
    await user.click(button);
}

 
//found multiple element with the raw button and changes. 
//have to import cleaner react aftereach vi.test after each clear test vi.clearall mocks 

describe('Fill the form', () => {
    beforeEach(() => {
        vi.mocked(axios.post).mockResolvedValue({});
        const user = userEvent.setup();
        render(< ActivityForm 
        onClose={mockOnClose}
        onActivityCreate={mockOnActivityCreate}
        tripId={mockFormData.tripId}
        defaultDate={mockFormData.date}
        />)
    })

    afterEach(() => {
    cleanup();
  });

    it('Renders ', async () => {
        const {nameInput, locationInput, dateInput, timeInput, button} = formElements(); 
        expect(screen.getByRole("heading", {name: /Add Activity/i})).toBeInTheDocument();
        expect(nameInput).toBeRequired(); 
        expect(locationInput).toBeRequired(); 
        expect(dateInput).toBeRequired(); 
        expect(timeInput).toBeRequired(); 
        expect(button).toBeInTheDocument();
    });

    it('Modify Form ', async () => {
      const {nameInput, locationInput, dateInput, timeInput} = formElements(); 
      await user.type(nameInput, mockFormData.name); 
      await user.type(locationInput, mockFormData.location); 
      await user.type(dateInput, mockFormData.date); 
      await user.type(timeInput, mockFormData.time); 
      expect(nameInput.value).toBe(mockFormData.name); 
      expect(locationInput.value).toBe(mockFormData.location); 
      expect(dateInput.value).toBe(mockFormData.date); 
      expect(timeInput.value).toBe(mockFormData.time); 
    });

})
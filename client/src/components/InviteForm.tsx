import { useState } from "react";
import { sendInvite } from "../services/inviteService";

interface FormProps {
  tripId: number
  onClose: () => void
}
export default function InviteForm ({tripId, onClose}: FormProps) {
const [name, setName] = useState("");
const [email, setEmail] = useState("");

const handleSubmit = async (e: React.SubmitEvent) => {
  e.preventDefault();

  try {
    await sendInvite(tripId, name, email);
    alert("Invite sent!");

    setName("");
    setEmail("");
    onClose();
  } catch (error) {
    console.error(error);
  }
};

return (
  <div className="fixed inset-0 flex justify-center items-center bg-black/50">
    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">
        Invite Member
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-black text-white px-3 py-1 rounded"
            >
              Send Invite
            </button>

          </div>

        </form>

      </div>

    </div>
  );

}
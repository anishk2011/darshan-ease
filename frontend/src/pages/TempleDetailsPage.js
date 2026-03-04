import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";
import { getToken } from "../utils/auth";

export default function TempleDetailsPage() {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  async function bookSlot(slotId) {
    if (!getToken()) {
      toast.error("Please login to book a slot");
      return;
    }
    try {
      await api.post("/bookings", { templeId: id, slotId });
      toast.success("Booking confirmed");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  }

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [templesRes, slotsRes] = await Promise.all([
        api.get("/temples"),
        api.get(`/slots?templeId=${id}`),
      ]);
      const selectedTemple = templesRes.data.data.find((item) => item._id === id);
      setTemple(selectedTemple || null);
      setSlots(slotsRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load temple details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <p>Loading temple details...</p>;
  if (!temple) return <p>Temple not found.</p>;

  return (
    <div>
      <div className="mb-3">
        <Link to="/temples" className="btn btn-sm btn-outline-secondary">
          Back
        </Link>
      </div>
      <h2>{temple.name}</h2>
      <p className="text-muted">{temple.location}</p>
      <p>{temple.description}</p>

      <h4 className="mt-4">Available Slots</h4>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Capacity</th>
              <th>Booked</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot._id}>
                <td>{slot.date}</td>
                <td>{slot.time}</td>
                <td>{slot.capacity}</td>
                <td>{slot.bookedCount}</td>
                <td>{slot.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={!slot.isActive || slot.bookedCount >= slot.capacity}
                    onClick={() => bookSlot(slot._id)}
                  >
                    Book
                  </button>
                </td>
              </tr>
            ))}
            {slots.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No slots available for this temple.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

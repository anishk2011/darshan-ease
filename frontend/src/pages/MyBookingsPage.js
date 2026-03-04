import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await api.get("/bookings/me");
      setBookings(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(id) {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      loadBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <h2 className="mb-4">My Bookings</h2>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Temple</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.templeId?.name || "-"}</td>
                <td>{booking.slotId?.date || "-"}</td>
                <td>{booking.slotId?.time || "-"}</td>
                <td>{booking.status}</td>
                <td>
                  {booking.status === "BOOKED" ? (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => cancelBooking(booking._id)}
                    >
                      Cancel
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

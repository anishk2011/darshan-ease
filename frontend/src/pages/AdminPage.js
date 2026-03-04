import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client";
import { getRole } from "../utils/auth";

const emptyTempleForm = {
  name: "",
  location: "",
  description: "",
  imageUrl: "",
};

const emptySlotForm = {
  templeId: "",
  date: "",
  time: "",
  capacity: 25,
  isActive: true,
};

export default function AdminPage() {
  const role = getRole();
  const isAdmin = role === "ADMIN";

  const [temples, setTemples] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [templeForm, setTempleForm] = useState(emptyTempleForm);
  const [slotForm, setSlotForm] = useState(emptySlotForm);
  const [editingTempleId, setEditingTempleId] = useState(null);
  const [editingSlotId, setEditingSlotId] = useState(null);

  const selectedTempleName = useMemo(
    () => temples.find((t) => t._id === slotForm.templeId)?.name || "-",
    [slotForm.templeId, temples]
  );

  const loadData = useCallback(async () => {
    try {
      const [templesRes, slotsRes] = await Promise.all([api.get("/temples"), api.get("/slots")]);
      setTemples(templesRes.data.data);
      setSlots(slotsRes.data.data);
      if (!slotForm.templeId && templesRes.data.data.length > 0) {
        setSlotForm((prev) => ({ ...prev, templeId: templesRes.data.data[0]._id }));
      }

      if (isAdmin) {
        const [bookingsRes, donationsRes] = await Promise.all([
          api.get("/bookings"),
          api.get("/donations"),
        ]);
        setBookings(bookingsRes.data.data);
        setDonations(donationsRes.data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load admin data");
    }
  }, [isAdmin, slotForm.templeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function submitTemple(e) {
    e.preventDefault();
    try {
      if (editingTempleId) {
        await api.put(`/temples/${editingTempleId}`, templeForm);
        toast.success("Temple updated");
      } else {
        await api.post("/temples", templeForm);
        toast.success("Temple created");
      }
      setTempleForm(emptyTempleForm);
      setEditingTempleId(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Temple action failed");
    }
  }

  async function deleteTemple(id) {
    if (!window.confirm("Delete this temple?")) return;
    try {
      await api.delete(`/temples/${id}`);
      toast.success("Temple deleted");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  }

  async function submitSlot(e) {
    e.preventDefault();
    try {
      const payload = {
        ...slotForm,
        capacity: Number(slotForm.capacity),
      };
      if (editingSlotId) {
        await api.put(`/slots/${editingSlotId}`, payload);
        toast.success("Slot updated");
      } else {
        await api.post("/slots", payload);
        toast.success("Slot created");
      }
      setSlotForm(emptySlotForm);
      setEditingSlotId(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Slot action failed");
    }
  }

  async function deleteSlot(id) {
    if (!window.confirm("Delete this slot?")) return;
    try {
      await api.delete(`/slots/${id}`);
      toast.success("Slot deleted");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  }

  return (
    <div>
      <h2 className="mb-4">Admin / Organizer Panel</h2>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>{editingTempleId ? "Edit Temple" : "Add Temple"}</h5>
              <form onSubmit={submitTemple}>
                <input
                  className="form-control mb-2"
                  placeholder="Temple Name"
                  value={templeForm.name}
                  onChange={(e) => setTempleForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
                <input
                  className="form-control mb-2"
                  placeholder="Location"
                  value={templeForm.location}
                  onChange={(e) => setTempleForm((p) => ({ ...p, location: e.target.value }))}
                  required
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={templeForm.description}
                  onChange={(e) => setTempleForm((p) => ({ ...p, description: e.target.value }))}
                  required
                />
                <input
                  className="form-control mb-2"
                  placeholder="Image URL (optional)"
                  value={templeForm.imageUrl}
                  onChange={(e) => setTempleForm((p) => ({ ...p, imageUrl: e.target.value }))}
                />
                <button className="btn btn-primary me-2" type="submit">
                  {editingTempleId ? "Update Temple" : "Create Temple"}
                </button>
                {editingTempleId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingTempleId(null);
                      setTempleForm(emptyTempleForm);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>{editingSlotId ? "Edit Slot" : "Add Slot"}</h5>
              <form onSubmit={submitSlot}>
                <select
                  className="form-select mb-2"
                  value={slotForm.templeId}
                  onChange={(e) => setSlotForm((p) => ({ ...p, templeId: e.target.value }))}
                  required
                >
                  <option value="">Select Temple</option>
                  {temples.map((temple) => (
                    <option key={temple._id} value={temple._id}>
                      {temple.name}
                    </option>
                  ))}
                </select>
                <input
                  className="form-control mb-2"
                  placeholder="Date (YYYY-MM-DD)"
                  value={slotForm.date}
                  onChange={(e) => setSlotForm((p) => ({ ...p, date: e.target.value }))}
                  required
                />
                <input
                  className="form-control mb-2"
                  placeholder="Time (e.g. 07:00 AM)"
                  value={slotForm.time}
                  onChange={(e) => setSlotForm((p) => ({ ...p, time: e.target.value }))}
                  required
                />
                <input
                  className="form-control mb-2"
                  type="number"
                  min="1"
                  value={slotForm.capacity}
                  onChange={(e) => setSlotForm((p) => ({ ...p, capacity: e.target.value }))}
                  required
                />
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={slotForm.isActive}
                    onChange={(e) => setSlotForm((p) => ({ ...p, isActive: e.target.checked }))}
                    id="slotActive"
                  />
                  <label className="form-check-label" htmlFor="slotActive">
                    Active slot
                  </label>
                </div>
                <button className="btn btn-primary me-2" type="submit">
                  {editingSlotId ? "Update Slot" : "Create Slot"}
                </button>
                {editingSlotId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingSlotId(null);
                      setSlotForm(emptySlotForm);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
              {slotForm.templeId && (
                <small className="text-muted">Selected temple: {selectedTempleName}</small>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>Temples</h5>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {temples.map((temple) => (
                <tr key={temple._id}>
                  <td>{temple.name}</td>
                  <td>{temple.location}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setEditingTempleId(temple._id);
                        setTempleForm({
                          name: temple.name,
                          location: temple.location,
                          description: temple.description,
                          imageUrl: temple.imageUrl || "",
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteTemple(temple._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>Slots</h5>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Temple</th>
                <th>Date</th>
                <th>Time</th>
                <th>Cap</th>
                <th>Booked</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot._id}>
                  <td>{slot.templeId?.name || "-"}</td>
                  <td>{slot.date}</td>
                  <td>{slot.time}</td>
                  <td>{slot.capacity}</td>
                  <td>{slot.bookedCount}</td>
                  <td>{slot.isActive ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setEditingSlotId(slot._id);
                        setSlotForm({
                          templeId: slot.templeId?._id || "",
                          date: slot.date,
                          time: slot.time,
                          capacity: slot.capacity,
                          isActive: slot.isActive,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteSlot(slot._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdmin && (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5>All Bookings (ADMIN)</h5>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Temple</th>
                    <th>Slot</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.userId?.email || "-"}</td>
                      <td>{booking.templeId?.name || "-"}</td>
                      <td>
                        {booking.slotId?.date || "-"} {booking.slotId?.time || ""}
                      </td>
                      <td>{booking.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>All Donations (ADMIN)</h5>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Temple</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation._id}>
                      <td>{donation.userId?.email || "-"}</td>
                      <td>{donation.templeId?.name || "-"}</td>
                      <td>INR {donation.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

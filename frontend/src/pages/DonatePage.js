import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client";

export default function DonatePage() {
  const [temples, setTemples] = useState([]);
  const [form, setForm] = useState({ templeId: "", amount: "" });
  const [donations, setDonations] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const [templesRes, donationsRes] = await Promise.all([
        api.get("/temples"),
        api.get("/donations/me"),
      ]);
      setTemples(templesRes.data.data);
      setDonations(donationsRes.data.data);
      if (!form.templeId && templesRes.data.data.length > 0) {
        setForm((prev) => ({ ...prev, templeId: templesRes.data.data[0]._id }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load donation data");
    }
  }, [form.templeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function submitDonation(e) {
    e.preventDefault();
    try {
      await api.post("/donations", {
        templeId: form.templeId,
        amount: Number(form.amount),
      });
      toast.success("Donation submitted");
      setForm((prev) => ({ ...prev, amount: "" }));
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Donation failed");
    }
  }

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4>Make a Donation</h4>
            <form onSubmit={submitDonation}>
              <div className="mb-3">
                <label className="form-label">Temple</label>
                <select
                  className="form-select"
                  value={form.templeId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, templeId: e.target.value }))
                  }
                  required
                >
                  {temples.map((temple) => (
                    <option key={temple._id} value={temple._id}>
                      {temple.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Amount (INR)</label>
                <input
                  className="form-control"
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
              <button className="btn btn-success w-100">Donate</button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4>My Donations</h4>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Temple</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation._id}>
                      <td>{donation.templeId?.name || "-"}</td>
                      <td>INR {donation.amount}</td>
                      <td>{new Date(donation.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {donations.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No donations yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

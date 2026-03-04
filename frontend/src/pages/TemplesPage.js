import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";

export default function TemplesPage() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemples() {
      try {
        const res = await api.get("/temples");
        setTemples(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load temples");
      } finally {
        setLoading(false);
      }
    }
    loadTemples();
  }, []);

  if (loading) return <p>Loading temples...</p>;

  return (
    <div>
      <h2 className="mb-4">Temple List</h2>
      <div className="row g-3">
        {temples.map((temple) => (
          <div className="col-md-6 col-lg-4" key={temple._id}>
            <div className="card h-100 shadow-sm">
              {temple.imageUrl && (
                <img
                  src={temple.imageUrl}
                  className="card-img-top temple-image"
                  alt={temple.name}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5>{temple.name}</h5>
                <p className="text-muted mb-2">{temple.location}</p>
                <p className="small">{temple.description}</p>
                <Link className="btn btn-outline-primary mt-auto" to={`/temples/${temple._id}`}>
                  View Slots
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

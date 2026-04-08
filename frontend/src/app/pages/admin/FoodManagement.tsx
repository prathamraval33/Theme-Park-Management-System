import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAdminSocket } from "../../../hook/useAdminSocket";
import "../../../styles/admin.css";

const EMPTY_FOOD = {
  food_name: "", description: "", category: "Snacks", price: "", image: "", available: true
};

export function FoodManagement() {

  const [foods, setFoods] = useState<any[]>([]);
  const [form, setForm]   = useState<any>(EMPTY_FOOD);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchFoods = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/api/admin/foods");
    setFoods(res.data || []);
  }, []);

  useEffect(() => { fetchFoods(); }, [fetchFoods]);
  useAdminSocket(fetchFoods);

  const saveFood = async () => {
    if (!form.food_name || !form.price || !form.image || !form.category) return;

    const payload = {
      food_name:   form.food_name,
      description: form.description,
      category:    form.category,
      price:       Number(form.price),
      image:       form.image,
      available:   form.available,
    };

    if (editId) {
      await axios.put(`http://localhost:5000/api/admin/foods/${editId}`, payload);
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/api/admin/foods", payload);
    }

    setForm(EMPTY_FOOD);
    fetchFoods();
  };

  const startEdit = (food: any) => {
    setEditId(food._id);
    setForm({
      food_name:   food.food_name,
      description: food.description || "",
      category:    food.category,
      price:       food.price,
      image:       food.image,
      available:   food.available,
    });
  };

  const deleteFood = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/admin/foods/${id}`);
    fetchFoods();
  };

  const toggleAvailable = async (id: string, available: boolean) => {
    await axios.put(`http://localhost:5000/api/admin/foods/${id}`, { available });
    fetchFoods();
  };

  const f = (key: string) => (e: any) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="admin-page">
      <h1 className="admin-title">Food Management</h1>

      {/* FORM */}
      <div className="admin-section">
        <div className="section-header">
          <span className="section-title">{editId ? "✏️ Edit Food Item" : "➕ Add New Food Item"}</span>
          {editId && (
            <button className="btn-ghost" onClick={() => { setEditId(null); setForm(EMPTY_FOOD); }}>
              Cancel
            </button>
          )}
        </div>

        <div className="admin-form">
          <div className="form-group">
            <label>Food Name *</label>
            <input className="admin-input" placeholder="e.g. Burger" value={form.food_name} onChange={f("food_name")} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input className="admin-input" placeholder="Short description" value={form.description} onChange={f("description")} />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select className="admin-input admin-select-input" value={form.category} onChange={f("category")}>
              <option>Snacks</option>
              <option>Drinks</option>
              <option>Meals</option>
              <option>Dessert</option>
            </select>
          </div>
          <div className="form-group">
            <label>Price (₹) *</label>
            <input className="admin-input" type="number" placeholder="99" value={form.price} onChange={f("price")} />
          </div>
          <div className="form-group">
            <label>Image URL *</label>
            <input className="admin-input" placeholder="https://..." value={form.image} onChange={f("image")} />
          </div>
          <div className="form-group" style={{ justifyContent: "flex-end" }}>
            <button className="btn-primary" onClick={saveFood}>
              {editId ? " Save Changes" : "+ Add Food"}
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-section">
        <div className="section-header">
          <span className="section-title">All Food Items ({foods.length})</span>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food, i) => (
                <tr key={food._id}>
                  <td style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Space Mono", fontSize: 12 }}>
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td>
                    <img
                      src={food.image}
                      alt=""
                      style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }}
                      onError={(e: any) => { e.target.style.display = "none"; }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{food.food_name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{food.description}</div>
                  </td>
                  <td>
                    <span className="category-pill food">{food.category}</span>
                  </td>
                  <td style={{ fontFamily: "Space Mono", color: "#00ffae" }}>₹{food.price}</td>
                  <td>
                    <div
                      className={`toggle-pill ${food.available ? "on" : "off"}`}
                      onClick={() => toggleAvailable(food._id, !food.available)}
                    >
                      <div className="toggle-thumb" />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn-edit" onClick={() => startEdit(food)}>✏️ Edit</button>
                      <button className="btn-delete" onClick={() => deleteFood(food._id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
              {foods.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 28 }}>No food items yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
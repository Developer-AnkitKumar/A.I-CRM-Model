import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";

export default function InteractionForm() {
  const data = useSelector((state) => state.interaction.data);
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(data);
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveData = async () => {
    try {
      await axios.post("http://localhost:8000/save", form);
      alert("Saved Successfully ✅");
    } catch {
      alert("Error ❌");
    }
  };

  return (
    <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 10 }}>
      <h3>Edit Interaction</h3>

      <input name="hcp_name" value={form.hcp_name || ""} onChange={handleChange} placeholder="Doctor" /><br/><br/>
      <input name="interaction_type" value={form.interaction_type || ""} onChange={handleChange} placeholder="Type" /><br/><br/>
      <input name="products_discussed" value={form.products_discussed || ""} onChange={handleChange} placeholder="Products" /><br/><br/>
      <input name="notes" value={form.notes || ""} onChange={handleChange} placeholder="Notes" /><br/><br/>
      <input name="follow_up_date" value={form.follow_up_date || ""} onChange={handleChange} placeholder="Follow Up" /><br/><br/>

      <p><b>AI Suggestion:</b> {form.suggestion}</p>
      <p><b>Interest Level:</b> {form.interest_level}</p>
      <p><b>Smart Follow-up:</b> {form.smart_followup}</p>

      <button onClick={saveData}>Save</button>
    </div>
  );
}
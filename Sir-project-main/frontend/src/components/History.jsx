import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/interactions")
      .then(res => setData(res.data));
  }, []);

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Interaction History</h3>

      {data.map((item) => (
        <div key={item.id} style={{ border: "1px solid #ddd", marginBottom: 10, padding: 10 }}>
          <p><b>{item.hcp_name}</b> ({item.interaction_type})</p>
          <p>{item.products}</p>
          <p>{item.notes}</p>
          <p>Follow-up: {item.follow_up_date}</p>
        </div>
      ))}
    </div>
  );
}
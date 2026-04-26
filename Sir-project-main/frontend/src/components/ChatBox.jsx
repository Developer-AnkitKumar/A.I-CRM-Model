import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setData } from "../redux/interactionSlice";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const sendMessage = async () => {
    if (!message) return;

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message,
      });

      dispatch(setData(res.data.data));
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("API error");
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type interaction..."
        style={{ padding: 10, width: 300 }}
      />
      <button onClick={sendMessage} style={{ marginLeft: 10 }}>
        Send
      </button>
    </div>
  );
}
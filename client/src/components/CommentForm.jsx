import { useState } from "react";
import api from "../api/axios";
import Alert from "./Alert";

export default function CommentForm({ postId, onCommentAdded }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      await api.post(`/posts/${postId}/comment`, { text });
      setText("");
      onCommentAdded();
    }catch(err){
      setError("Failed to add comment");
    } finally{
      setLoading(false);
    }

    
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
      {error && <Alert message = {error}/>}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        style={{ width: "80%", padding: 5 }}
        disabled = {loading}
      />
      <button type="submit" disabled={loading} style={{ marginLeft: 10 }}>
        {loading? "Adding...": "Add"}
      </button>
    </form>
  );
}

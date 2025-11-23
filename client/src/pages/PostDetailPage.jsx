import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import CommentForm from "../components/CommentForm";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { AuthContext } from "../context/AuthContext";

export default function PostDetailPage() {
  const { id } = useParams();
  const Navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPost = async () => {
    setLoading(true);
    setError("");
    try{
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    }catch(err){
      console.log(err);
      setError("Failed to load post details");
    }finally{
      setLoading(false);
    }
    
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const toggleLike = async () => {
    if(!post || !user) return;
    try{
      const liked = post.likes.includes(user.id);
      const endpoint = liked? "unlike" : "like";
      const res = await api.put(`/posts/${id}/${endpoint}`);
      setPost(res.data);
    }catch(err){
      alert("Failed to update like");
    }
  };
  
  if (loading) return <Loader text="Loading post details..." />;
  if (error) return <Alert message={error} type="error" />;
  if (!post) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        ← Back
      </button>
      <h2>{post.user.name}'s Post</h2>
      <p>{post.content}</p>
      <button onClick={toggleLike}>
        ❤️ {post.likes.length} {post.likes.includes(user.id) ? "Unlike" : "Like"}
      </button>
      <h4 style={{ marginTop: "1rem" }}>Comments:</h4>
      {Array.isArray(post.comments) && post.comments.length > 0 ? (
        post.comments.map((c, idx) => (
          <p key={idx}>
            <strong>{c.user?.name || "Anonymous"}:</strong> {c.text}
          </p>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
      <CommentForm postId={post._id} onCommentAdded={fetchPost} />
    </div>
  );
}

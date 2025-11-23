// src/pages/PostsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import PostForm from "../components/PostForm";
import CommentForm from "../components/CommentForm";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { AuthContext } from "../context/AuthContext";

export default function PostsPage() {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showMyPosts, setShowMyPosts] = useState(false); // 👈 new filter state

  // Fetch all posts
  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // --- Like/Unlike toggle ---
  const toggleLike = async (post) => {
    try {
      const updatedPosts = posts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              likes: p.likes.includes(user.id)
                ? p.likes.filter((id) => id !== user.id)
                : [...p.likes, user.id],
            }
          : p
      );
      setPosts(updatedPosts);

      const endpoint = post.likes.includes(user.id)
        ? `/posts/${post._id}/unlike`
        : `/posts/${post._id}/like`;
      await api.put(endpoint);
    } catch (error) {
      alert("Error updating like");
      fetchPosts();
    }
  };

  // --- Delete post ---
  const handleDelete = async (id) => {
    await api.delete(`/posts/${id}`);
    fetchPosts();
  };

  // --- Edit post ---
  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setEditContent(post.content);
  };

  const handleEditSave = async (id) => {
    try {
      await api.put(`/posts/${id}`, { content: editContent });
      setEditingPostId(null);
      setEditContent("");
      fetchPosts();
    } catch (err) {
      alert("Error saving changes");
    }
  };

  const handleEditCancel = () => {
    setEditingPostId(null);
    setEditContent("");
  };

  if (loading) return <Loader />;
  if (error) return <Alert message={error} type="error" />;

  // --- Helper functions ---
  const getUserName = (u) => {
    if (!u) return "Unknown";
    if (typeof u === "string") return u;
    if (typeof u === "object") {
      if (u.name) return u.name;
      if (u._id && !u.name) return u._id;
      try {
        return JSON.stringify(u);
      } catch {
        return "User";
      }
    }
    return String(u);
  };

  const normalizeLikes = (likes = []) => (Array.isArray(likes) ? likes : []);

  const isLikedByUser = (likes = []) => {
    const arr = normalizeLikes(likes);
    return arr.some((l) =>
      typeof l === "string"
        ? l === user.id
        : l && (l._id === user.id || l.id === user.id)
    );
  };

  // --- Filtered posts ---
  const filteredPosts = showMyPosts
    ? posts.filter((p) =>
        p.user && p.user._id
          ? p.user._id === user.id
          : p.user === user.id
      )
    : posts;

  // --- UI ---
  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>
        Welcome, {user?.name || getUserName(user)} 👋
      </h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button onClick={logout}>Logout</button>
        <Link to="/profile">
          <button>My Profile</button>
        </Link>
      </div>

      <PostForm onPostCreated={fetchPosts} />

      {/* Filter buttons */}
      <div style={{ margin: "15px 0" }}>
        <button
          onClick={() => setShowMyPosts(false)}
          style={{
            background: showMyPosts ? "#eee" : "#007bff",
            color: showMyPosts ? "black" : "white",
            marginRight: "8px",
          }}
        >
          All Posts
        </button>
        <button
          onClick={() => setShowMyPosts(true)}
          style={{
            background: showMyPosts ? "#007bff" : "#eee",
            color: showMyPosts ? "white" : "black",
          }}
        >
          My Posts
        </button>
      </div>

      <h3>{showMyPosts ? "My Posts" : "All Posts"}</h3>

      {filteredPosts.map((p) => {
        const author = getUserName(p.user);
        const likesArr = normalizeLikes(p.likes);
        const liked = isLikedByUser(p.likes);
        const isOwner =
          p.user &&
          (p.user._id ? p.user._id === user.id : p.user === user.id);

        return (
          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: 10,
              borderRadius: 6,
            }}
          >
            <p><strong>{author}</strong></p>

            {editingPostId === p._id ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{ width: "100%", minHeight: "60px" }}
                />
                <button onClick={() => handleEditSave(p._id)}>Save</button>
                <button onClick={handleEditCancel}>Cancel</button>
              </>
            ) : (
              <Link
                to={`/post/${p._id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <p>{String(p.content)}</p>
              </Link>
            )}

            <button onClick={() => toggleLike(p)}>
              ❤️ {likesArr.length} {liked ? "Unlike" : "Like"}
            </button>

            {isOwner && (
              <>
                <button onClick={() => handleEditClick(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </>
            )}

            <div style={{ marginTop: 10 }}>
              <h5>Comments:</h5>
              {Array.isArray(p.comments) &&
                p.comments.map((c, idx) => {
                  const commenter = getUserName(c.user);
                  return (
                    <p key={idx}>
                      <strong>{commenter}:</strong> {String(c.text)}
                    </p>
                  );
                })}
              <CommentForm postId={p._id} onCommentAdded={fetchPosts} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

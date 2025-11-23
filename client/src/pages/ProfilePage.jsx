// ...existing code...
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { AuthContext } from "../context/AuthContext";

export default function ProfilePage() {
  const { id } = useParams(); // profile id from route (optional)
  const { user: currentUser } = useContext(AuthContext); // logged-in user (may be null at first)

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // prefer route id, fall back to context user id
    const profileId = id || currentUser?.id || currentUser?._id;
    if (!profileId) {
      setLoading(false);
      setError("No user id available to load profile.");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/users/${profileId}`);
        // adapt to your backend response shape:
        // common patterns: { user, posts } or directly user object + posts
        setProfile(res.data.user ?? res.data);
        setPosts(res.data.posts ?? res.data.postsByUser ?? []);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, currentUser]);

  if (loading) return <Loader />;
  if (error) return <Alert message={error} type="error" />;

  if (!profile) {
    return <div className="p-6 text-red-500">Failed to load profile.</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>{profile.name}'s Profile</h2>
      <p>Email: {profile.email}</p>

      <h3 style={{ marginTop: "1.5rem" }}>Posts by {profile.name}</h3>
      {posts.length === 0 && <p>No posts yet</p>}

      {posts.map((p) => (
        <div key={p._id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
          <p>{p.content}</p>
          <Link to={`/post/${p._id}`}>View Details</Link>
          <p>❤️ {Array.isArray(p.likes) ? p.likes.length : 0} Likes</p>
        </div>
      ))}
    </div>
  );
}
// ...existing code...
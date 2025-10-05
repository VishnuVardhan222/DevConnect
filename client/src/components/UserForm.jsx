import React, { useState, useEffect} from 'react';
import api from '../api/axios';

export default function UserForm() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', skills: '', bio: ''});

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        }catch (err) {
            console.error('Fetch Users count',err)
        }
    };

    useEffect(() => { fetchUsers(); }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', {
                name: form.name,
                email: form.email,
                skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
                bio: form.bio,
            });
            setForm({  name: '', email: '', skills: '', bio: ''});
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating User');
        }
    };

    const handleDelete = async (id) => {
        if(!confirm('Delete user?')) return;
        await api.delete(`/users/${id}`);
        fetchUsers();
    };

    return (
    <div style={{ maxWidth: 700, margin: '1rem auto' }}>
      <h2>Create Profile</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
        <input required placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
        <input placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({...form, skills: e.target.value})} />
        <textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} />
        <button type="submit">Add User</button>
      </form>

      <h3 style={{ marginTop: 24 }}>All Users</h3>
      <ul>
        {users.map(u => (
          <li key={u._id} style={{ marginBottom: 8 }}>
            <strong>{u.name}</strong> — {u.email} <br />
            <small>Skills: {u.skills?.join(', ')}</small> <br />
            <button onClick={() => handleDelete(u._id)} style={{ marginTop: 6 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
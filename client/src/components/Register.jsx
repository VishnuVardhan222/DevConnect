import React, { useState } from 'react';
import api from '../api/axios';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', form);
            alert('Registration Successful!,Please Login');
            setForm({ name: '', email: '', password: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Error Registering');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto'}}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder='Name' value = {form.name} onChange = {(e) => setForm({ ...form, name: e.target.value})} required />
                <input type='email' placeholder='Email' value = {form.email} onChange = {(e) => setForm({ ...form, email: e.target.value})} required />
                <input type='password' placeholder='Password' value = {form.password} onChange = {(e) => setForm({ ...form, password: e.target.value})} required />
                <button type='submit'>Register</button>
            </form>
        </div>
    );
}
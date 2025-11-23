import React from 'react';

export default function DashBoard({ user, logout}) {
    return (
        <div style={{textAlign:'center', marginTop: '2rem'}}>
            <h2> Welcome, {user?.name}</h2>
            <p>Email: {user?.email}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );

    
}
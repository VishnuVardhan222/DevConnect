import React, { useState } from 'react';
import api from '../api/axios';

export default function PostForm({ onPostCreated }) {
    const [content, setContent] = useState('');

    const handleSubmit= async(e) => {
        e.preventDefault();
        if(!content.trim()) return;

        try {
            await api.post("/posts", { content });
            setContent('');
            onPostCreated();
        }catch(err) {
            alert("Error creating post");
        }
    };
    


    return (
        <form onSubmit = {handleSubmit} style ={{ marginBottom: "1rem"}}>
            <textarea value = {content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            style = {{ width: "100%", height: "80px"}}/>
            <button type="submit">Post</button>

        </form>
    );

}
export default function Alert({ message, type="error"}) {
    const styles = {
        error: { background: "#f8d7da", color: "#721c24" },
        success: { background: "#d4edda", color: "#155724" },
    };

    return (
        <div style = {{
            ...styles[type], 
            padding: "10px",
            borderRadius: "4",
            margin: "10px 0",
        }}>
            {message}

        </div>
    );
}
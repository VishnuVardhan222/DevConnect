export default function Loader( {text = "Loading..."} ) {
    return (
        <div style = {{ textAlign: "center", margin: "2rem 0"}}>
            <div className="spinner" style={{ fontSize: "1.2rem"}}>
                ⏳ {text}
            </div>
        </div>
    );
}
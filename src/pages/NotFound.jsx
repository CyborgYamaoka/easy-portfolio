import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container" style={{ paddingTop: 80, textAlign: "center" }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>404</p>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Page not found.</p>
      <Link to="/" className="btn">Back to home</Link>
    </div>
  );
}

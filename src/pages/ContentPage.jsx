import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchContentById } from "../api/contents";

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function MediaViewer({ item }) {
  const { media, media_type } = item;
  if (!media || media_type === "false" || !media_type) return null;
  const t = media_type.toLowerCase();

  if (t === "txt") {
    return <TextViewer url={media} />;
  }
  if (t === "jpg" || t === "jpeg" || t === "png" || t === "gif" || t === "webp") {
    return <img src={media} alt="media" style={{ width:"100%", borderRadius:8, marginBottom:20, display:"block" }} />;
  }
  if (t === "pdf") {
    return <embed src={media} type="application/pdf" style={{ width:"100%", height:600, border:"none", borderRadius:8, marginBottom:20 }} />;
  }
  if (t === "html") {
    return <iframe src={media} sandbox="allow-scripts" title="html content" style={{ width:"100%", height:500, border:"1px solid #e2ddd6", borderRadius:8, marginBottom:20 }} />;
  }
  if (t === "mp3") {
    return <audio controls src={media} style={{ width:"100%", marginBottom:20 }} />;
  }
  if (t === "mp4") {
    return <video controls src={media} style={{ width:"100%", borderRadius:8, marginBottom:20 }} />;
  }
  return (
    <a href={media} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginBottom:20, display:"inline-flex" }}>
      Download {t.toUpperCase()} ↓
    </a>
  );
}

function TextViewer({ url }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url)
      .then(r => r.text())
      .then(setText)
      .catch(() => setText("Failed to load."))
      .finally(() => setLoading(false));
  }, [url]);
  return (
    <pre style={{ background:"#f5f3ef", border:"1px solid #e2ddd6", borderRadius:8, padding:16, fontSize:15, lineHeight:1.7, overflowX:"auto", whiteSpace:"pre-wrap", marginBottom:20 }}>
      {loading ? "Loading..." : text}
    </pre>
  );
}

export default function ContentPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContentById(id).then(setItem).catch(() => setError("Content not found."));
  }, [id]);

  if (error) return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px" }}>
      <p style={{ color:"#777068", marginBottom:16 }}>{error}</p>
      <Link to="/" className="btn btn-outline">← Back</Link>
    </div>
  );

  if (!item) return <div className="loader">Loading...</div>;

  const showEmoji = item.emoji && !item.content_image;
  const bgColor = item.emoji_bg || item.color_bg || "#e2ddd6";

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px" }}>
      <Link to="/" style={{ fontSize:13, color:"#777068", display:"inline-block", marginBottom:24 }}>← Back</Link>

      {item.content_image ? (
        <img src={item.content_image} alt={item.content_name} style={{ width:"100%", aspectRatio:"16/9", objectFit:"cover", borderRadius:12, marginBottom:24, display:"block" }} />
      ) : (
        <div style={{ width:"100%", aspectRatio:"16/9", background:bgColor, borderRadius:12, marginBottom:24, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {showEmoji && <span style={{ fontSize:"clamp(80px,12vw,140px)", lineHeight:1, userSelect:"none" }}>{item.emoji}</span>}
        </div>
      )}

      <h1 style={{ fontSize:28, fontWeight:700, marginBottom:8, lineHeight:1.3 }}>{item.content_name}</h1>
      <div style={{ fontSize:12, color:"#777068", marginBottom:20, display:"flex", gap:12, alignItems:"center" }}>
        <span>{formatDate(item.created_at)}</span>
        {item.tag && <span style={{ padding:"3px 10px", background:"#f5f3ef", border:"1px solid #e2ddd6", borderRadius:999, fontSize:12 }}>{item.tag}</span>}
      </div>
      {item.description && (
        <div style={{ fontSize:16, lineHeight:1.8, marginBottom:24, whiteSpace:"pre-line" }}>{item.description}</div>
      )}
      <MediaViewer item={item} />
    </div>
  );
}

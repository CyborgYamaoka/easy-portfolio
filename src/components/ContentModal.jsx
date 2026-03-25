import { useEffect, useState } from "react";

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function TextViewer({ url }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url).then(r => r.text()).then(setText).catch(() => setText("Failed to load.")).finally(() => setLoading(false));
  }, [url]);
  return (
    <pre style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:8, padding:16, fontSize:15, lineHeight:1.7, overflowX:"auto", whiteSpace:"pre-wrap", marginBottom:20 }}>
      {loading ? "Loading..." : text}
    </pre>
  );
}

function HtmlViewer({ url }) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url).then(r => r.text()).then(setHtml).catch(() => setHtml("<p>Failed to load.</p>")).finally(() => setLoading(false));
  }, [url]);
  if (loading) return <div style={{ padding:16, color:"var(--text-muted)" }}>Loading...</div>;
  return (
    <iframe
      srcdoc={html}
      sandbox="allow-scripts allow-same-origin allow-popups"
      title="html content"
      style={{ width:"100%", height:600, border:"1px solid var(--border)", borderRadius:8, marginBottom:20 }}
    />
  );
}

function MediaViewer({ item }) {
  const { media, media_type } = item;
  if (!media || media_type === "false" || !media_type) return null;
  const t = media_type.toLowerCase();
  if (t === "txt") return <TextViewer url={media} />;
  if (["jpg","jpeg","png","gif","webp"].includes(t))
    return <img src={media} alt="media" style={{ width:"100%", borderRadius:8, marginBottom:20, display:"block" }} />;
  if (t === "pdf")
    return <embed src={media} type="application/pdf" style={{ width:"100%", height:600, border:"none", borderRadius:8, marginBottom:20 }} />;
  if (t === "html") return <HtmlViewer url={media} />;
  if (t === "mp3") return <audio controls src={media} style={{ width:"100%", marginBottom:20 }} />;
  if (t === "mp4") return <video controls src={media} style={{ width:"100%", borderRadius:8, marginBottom:20 }} />;
  return (
    <a href={media} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginBottom:20, display:"inline-flex" }}>
      Download {t.toUpperCase()} ↓
    </a>
  );
}

export default function ContentModal({ item, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  function openFullPage() { window.open(`/content/${item.id}`, "_blank"); }

  const showEmoji = item.emoji && !item.content_image;
  const bgColor = item.emoji_bg || item.color_bg || "#e2ddd6";

  return (
    <div
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background:"var(--surface)", borderRadius:12, width:"100%", maxWidth:"clamp(560px, 55vw, 900px)", maxHeight:"90vh", overflowY:"auto", position:"relative" }}>
        <div style={{ position:"absolute", top:12, right:12, display:"flex", gap:8, zIndex:10 }}>
          <button onClick={openFullPage} title="Open full page" style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>⤢</button>
          <button onClick={onClose} title="Close" style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {item.content_image ? (
          <img src={item.content_image} alt={item.content_name} style={{ width:"100%", aspectRatio:"16/9", objectFit:"cover", display:"block", borderRadius:"12px 12px 0 0" }} />
        ) : (
          <div style={{ width:"100%", aspectRatio:"16/9", background:bgColor, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"12px 12px 0 0" }}>
            {showEmoji && <span style={{ fontSize:"clamp(80px, 12vw, 140px)", lineHeight:1, userSelect:"none" }}>{item.emoji}</span>}
          </div>
        )}

        <div style={{ padding:32 }}>
          <div style={{ fontSize:26, fontWeight:700, marginBottom:8, lineHeight:1.3 }}>{item.content_name}</div>
          <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:20, display:"flex", gap:12, alignItems:"center" }}>
            <span>{formatDate(item.created_at)}</span>
            {item.tag && <span style={{ display:"inline-block", padding:"3px 10px", background:"var(--bg)", border:"1px solid var(--border)", borderRadius:999, fontSize:12 }}>{item.tag}</span>}
          </div>
          {item.description && <div style={{ fontSize:16, lineHeight:1.8, color:"var(--text)", marginBottom:24, whiteSpace:"pre-line" }}>{item.description}</div>}
          <MediaViewer item={item} />
        </div>
      </div>
    </div>
  );
}

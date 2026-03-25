import { useState } from "react";

const PRESET_COLORS = ["#f5e6d3","#d3e8f5","#d3f5e6","#f5d3e8","#e8d3f5","#f5f5d3","#2a2a2a","#e8593c","#3b8bd4"];

export default function UploadModal({ genres, onClose, onSuccess }) {
  const [form, setForm] = useState({
    content_name: "", description: "", tag: genres.find(g => g !== "All") || "", apiKey: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [emoji, setEmoji] = useState("");
  const [emojiColor, setEmojiColor] = useState("#f5e6d3");
  const [imageMode, setImageMode] = useState("emoji");
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit() {
    if (!form.content_name || !form.apiKey) { setErrorMsg("Content name and API key are required."); return; }
    setStatus("loading"); setErrorMsg("");

    const fd = new FormData();
    fd.append("content_name", form.content_name);
    fd.append("description", form.description);
    fd.append("tag", form.tag);
    if (imageMode === "emoji") {
      fd.append("emoji", emoji);
      fd.append("emoji_bg", emojiColor);
    } else if (imageFile) {
      fd.append("content_image", imageFile);
    }
    if (mediaFile) fd.append("media", mediaFile);

    try {
      const res = await fetch(import.meta.env.VITE_EDGE_FUNCTION_URL, {
        method: "POST",
        headers: { "x-api-key": form.apiKey },
        body: fd,
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setStatus("success");
      sessionStorage.setItem("admin_api_key", form.apiKey);
      setTimeout(() => { onSuccess(form.apiKey); onClose(); }, 1000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="upload-form">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Upload content</h2>
            <button className="modal-btn" onClick={onClose}>✕</button>
          </div>

          <div className="form-field">
            <label>Content name *</label>
            <input value={form.content_name} onChange={(e) => set("content_name", e.target.value)} />
          </div>

          <div className="form-field">
            <label>Tag</label>
            <select value={form.tag} onChange={(e) => set("tag", e.target.value)}>
              {genres.filter((g) => g !== "All").map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div className="form-field">
            <label>Thumbnail</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <button type="button" className={`btn btn-sm${imageMode === "emoji" ? "" : " btn-outline"}`} onClick={() => setImageMode("emoji")}>Emoji</button>
              <button type="button" className={`btn btn-sm${imageMode === "file" ? "" : " btn-outline"}`} onClick={() => setImageMode("file")}>Image file</button>
            </div>

            {imageMode === "emoji" && (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 80, height: 80, borderRadius: 8, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, background: emojiColor, flexShrink: 0 }}>
                  {emoji || "?"}
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <input placeholder="Paste emoji e.g. 🎵" value={emoji} onChange={(e) => setEmoji(e.target.value)} style={{ fontSize: 22 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Color:</span>
                    <input type="color" value={emojiColor} onChange={(e) => setEmojiColor(e.target.value)} style={{ width: 32, height: 32, border: "1px solid var(--border)", borderRadius: 6, padding: 2, cursor: "pointer", background: "none" }} />
                    {PRESET_COLORS.map((c) => (
                      <div key={c} onClick={() => setEmojiColor(c)} style={{ width: 20, height: 20, borderRadius: 4, background: c, border: emojiColor === c ? "2px solid var(--accent)" : "1px solid var(--border)", cursor: "pointer", flexShrink: 0 }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {imageMode === "file" && (
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            )}
          </div>

          <div className="form-field">
            <label>Media file (optional) — txt, mp3, mp4, pdf, jpg, png, html, zip</label>
            <input type="file" accept=".txt,.mp3,.mp4,.pdf,.jpg,.jpeg,.png,.gif,.webp,.html,.zip" onChange={(e) => setMediaFile(e.target.files[0])} />
          </div>

          <div className="form-field">
            <label>API key *</label>
            <input type="password" value={form.apiKey} onChange={(e) => set("apiKey", e.target.value)} placeholder="Enter API key" />
          </div>

          {errorMsg && <div className="form-error">{errorMsg}</div>}
          {status === "success" && <div className="form-success">Uploaded!</div>}

          <button className="btn" onClick={handleSubmit} disabled={status === "loading"}>
            {status === "loading" ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

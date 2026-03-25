function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ContentCard({ item, onClick, deleteMode, selected, onToggle }) {
  const desc = item.description
    ? item.description.slice(0, 250) + (item.description.length > 250 ? "…" : "")
    : "";

  function handleClick() {
    if (deleteMode) { onToggle(item.id); return; }
    if (onClick) onClick(item);
  }

  const showEmoji = item.emoji && !item.content_image;
  const bgColor = item.emoji_bg || item.color_bg || "#e2ddd6";

  return (
    <div className={`card${selected ? " selected" : ""}`} onClick={handleClick}>
      {deleteMode && (
        <input
          type="checkbox"
          className="card-checkbox"
          checked={!!selected}
          onChange={() => onToggle(item.id)}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {item.content_image ? (
        <img className="card-thumb" src={item.content_image} alt={item.content_name} />
      ) : (
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            background: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {showEmoji && (
            <span style={{ fontSize: "clamp(40px, 8vw, 72px)", lineHeight: 1, userSelect: "none" }}>
              {item.emoji}
            </span>
          )}
        </div>
      )}

      <div className="card-body">
        <div className="card-name">{item.content_name}</div>
        <div className="card-time">{formatDate(item.created_at)}</div>
        {desc && <div className="card-desc">{desc}</div>}
      </div>
    </div>
  );
}

export default function GenreTabs({ genres, active, onSelect }) {
  if (!genres.length) return null;
  return (
    <div className="genre-tabs">
      {genres.map((g) => (
        <button
          key={g}
          className={`genre-tab${active === g ? " active" : ""}`}
          onClick={() => onSelect(g)}
        >
          {g}
        </button>
      ))}
    </div>
  );
}

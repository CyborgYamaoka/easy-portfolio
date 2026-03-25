import { useEffect, useRef, useState } from "react";
import { fetchContents } from "../api/contents";
import ContentCard from "./ContentCard";

export default function ContentFeed({ tag, onCardClick, deleteMode, selectedIds, onToggle }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
  }, [tag]);

  useEffect(() => {
    if (!hasMore) return;
    setLoading(true);
    fetchContents({ tag, page })
      .then((data) => {
        setItems((prev) => (page === 0 ? data : [...prev, ...data]));
        if (data.length < 12) setHasMore(false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tag, page]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !loading && hasMore) setPage((p) => p + 1); },
      { rootMargin: "200px" }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loading, hasMore]);

  // Expose refresh method via custom event
  useEffect(() => {
    const refresh = () => { setItems([]); setPage(0); setHasMore(true); };
    window.addEventListener("feed:refresh", refresh);
    return () => window.removeEventListener("feed:refresh", refresh);
  }, []);

  return (
    <>
      <div className="content-grid">
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            onClick={onCardClick}
            deleteMode={deleteMode}
            selected={selectedIds?.has(item.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
      {loading && <div className="loader">Loading...</div>}
      {!loading && items.length === 0 && <div className="loader">No contents yet.</div>}
      <div ref={sentinelRef} />
    </>
  );
}

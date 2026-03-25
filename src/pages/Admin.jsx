import { useEffect, useState } from "react";
import { fetchProfile } from "../api/profile";
import { fetchGenres } from "../api/genres";
import { deleteContents } from "../api/contents";
import ProfileHeader from "../components/ProfileHeader";
import GenreTabs from "../components/GenreTabs";
import ContentFeed from "../components/ContentFeed";
import ContentModal from "../components/ContentModal";
import UploadModal from "../components/UploadModal";

export default function Admin() {
  const [profile, setProfile] = useState(null);
  const [genres, setGenres] = useState([]);
  const [activeTag, setActiveTag] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedKey, setFeedKey] = useState(0);

  useEffect(() => {
    fetchProfile().then(setProfile).catch(console.error);
    fetchGenres().then(setGenres).catch(() => setGenres(["All"]));
  }, []);

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function enterDeleteMode() { setDeleteMode(true); setSelectedIds(new Set()); }
  function cancelDelete() { setDeleteMode(false); setSelectedIds(new Set()); }

  async function confirmDelete() {
    if (selectedIds.size === 0) { cancelDelete(); setShowConfirm(false); return; }
    setDeleting(true);
    try {
      await deleteContents([...selectedIds]);
      window.dispatchEvent(new Event("feed:refresh"));
      cancelDelete();
    } catch (e) {
      alert("Delete failed: " + e.message);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  // Store API key in sessionStorage when upload succeeds so delete can use it
  function handleUploadSuccess(apiKey) {
    if (apiKey) sessionStorage.setItem("admin_api_key", apiKey);
    window.dispatchEvent(new Event("feed:refresh"));
    setFeedKey(k => k + 1);
    window.dispatchEvent(new Event("feed:refresh"));
  }

  return (
    <div className="container">
      <ProfileHeader profile={profile} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Admin</span>
        <div style={{ display: "flex", gap: 8 }}>
          {!deleteMode ? (
            <>
              <button className="btn btn-outline btn-sm" onClick={enterDeleteMode}>Delete</button>
              <button className="btn btn-sm" onClick={() => setShowUpload(true)}>Upload</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline btn-sm" onClick={cancelDelete}>Cancel</button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => selectedIds.size > 0 ? setShowConfirm(true) : cancelDelete()}
              >
                Confirm{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
              </button>
            </>
          )}
        </div>
      </div>

      <GenreTabs genres={genres} active={activeTag} onSelect={setActiveTag} />
      <ContentFeed
        key={activeTag + String(deleteMode) + feedKey}
        tag={activeTag}
        onCardClick={deleteMode ? null : setSelectedItem}
        deleteMode={deleteMode}
        selectedIds={selectedIds}
        onToggle={toggleSelect}
      />

      {selectedItem && !deleteMode && (
        <ContentModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      {showUpload && (
        <UploadModal
          genres={genres}
          onClose={() => setShowUpload(false)}
          onSuccess={() => { window.dispatchEvent(new Event("feed:refresh")); }}
        />
      )}

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Delete {selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""}?</h3>
            <p>This will also remove files from storage.</p>
            <div className="confirm-box-actions">
              <button className="btn btn-outline" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

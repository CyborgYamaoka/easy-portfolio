import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProfile } from "../api/profile";
import { fetchGenres } from "../api/genres";
import ProfileHeader from "../components/ProfileHeader";
import GenreTabs from "../components/GenreTabs";
import ContentFeed from "../components/ContentFeed";
import ContentModal from "../components/ContentModal";

export default function Home() {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [genres, setGenres] = useState([]);
  const [activeTag, setActiveTag] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchProfile().then(setProfile).catch(console.error);
    fetchGenres().then((g) => {
      setGenres(g);
      if (genre) {
        const match = g.find((x) => x.toLowerCase() === genre.toLowerCase());
        if (match) setActiveTag(match);
      }
    }).catch(() => setGenres(["All"]));
  }, []);

  function selectTag(tag) {
    setActiveTag(tag);
    if (tag === "All") navigate("/");
    else navigate(`/${tag}`);
  }

  return (
    <div className="container">
      <ProfileHeader profile={profile} />
      <GenreTabs genres={genres} active={activeTag} onSelect={selectTag} />
      <ContentFeed
        key={activeTag}
        tag={activeTag}
        onCardClick={setSelectedItem}
        deleteMode={false}
        selectedIds={new Set()}
        onToggle={() => {}}
      />
      {selectedItem && (
        <ContentModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

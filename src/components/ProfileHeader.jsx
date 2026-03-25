export default function ProfileHeader({ profile }) {
  if (!profile) return <div className="loader">Loading profile...</div>;

  // Supabase stores literal \n as \\n in JSON — normalize both
  const bio = profile.bio
    ? profile.bio.replace(/\\n/g, "\n").replace(/\\r/g, "")
    : "";

  return (
    <div className="profile">
      {profile.icon_url ? (
        <img className="profile-icon" src={profile.icon_url} alt={profile.name} />
      ) : (
        <div className="profile-icon">👤</div>
      )}
      <div>
        <div className="profile-name">{profile.name}</div>
        <div className="profile-bio" style={{ whiteSpace: "pre-line" }}>{bio}</div>
        {profile.url && (
          <a className="profile-url" href={profile.url} target="_blank" rel="noopener noreferrer">
            {profile.url}
          </a>
        )}
      </div>
    </div>
  );
}

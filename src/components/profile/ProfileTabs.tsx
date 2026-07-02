interface Props {
  activeTab: "posts" | "followers" | "following" | "comments";
  onChange: (
    tab: "posts" | "followers" | "following" | "comments"
  ) => void;
}

export default function ProfileTabs({
  activeTab,
  onChange,
}: Props) {
  const tabs = [
    {
      key: "posts",
      label: "Publicaciones",
    },
    {
      key: "followers",
      label: "Seguidores",
    },
    {
      key: "following",
      label: "Siguiendo",
    },
    {
      key: "comments",
      label: "Comentarios",
    },
  ] as const;

  return (
    <ul className="nav nav-tabs profile-tabs mb-4 justify-content-center">
      {tabs.map((tab) => (
        <li
          className="nav-item"
          key={tab.key}
        >
          <button
            className={`nav-link ${
              activeTab === tab.key ? "active" : ""
            }`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
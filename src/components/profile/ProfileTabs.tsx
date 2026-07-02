type Tab = "posts" | "comments" | "likes";

interface Props {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export default function ProfileTabs({ activeTab, onChange }: Props) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "posts", label: "Posts" },
    { key: "comments", label: "Comentarios" },
    { key: "likes", label: "❤️ Me gusta" },
  ];

  return (
    <ul className="nav nav-tabs profile-tabs mb-4">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab.key}>
          <button
            className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { followUser, unfollowUser } from "../services/UsuarioService";
import { Button } from "react-bootstrap";
import { BsPersonPlus, BsPersonCheckFill } from "react-icons/bs";
import { getUserId, isFollowingUser } from "../utils/userHelpers";
import "../styles/base/variables.css";

type FollowButtonProps = {
  targetUserId: string;
  onFollowChange?: (following: boolean) => void;
};

export function FollowButton({ targetUserId, onFollowChange }: FollowButtonProps) {
  const ctx = useContext(UserContext);
  const currentUser = ctx?.user;
  const refreshCurrentUser = ctx?.refreshCurrentUser;

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setIsFollowing(
        isFollowingUser(currentUser.following as unknown[] | undefined, targetUserId),
      );
    }
  }, [currentUser, targetUserId]);

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!currentUser) {
      alert("Debes iniciar sesión para seguir usuarios.");
      return;
    }

    const myId = getUserId(currentUser as { id?: string; _id?: string });
    if (!myId) return;

    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setLoading(true);

    try {
      if (wasFollowing) {
        await unfollowUser(myId, targetUserId);
      } else {
        await followUser(myId, targetUserId);
      }
      await refreshCurrentUser?.();
      onFollowChange?.(!wasFollowing);
    } catch (error) {
      console.error("Error en la acción de seguir:", error);
      setIsFollowing(wasFollowing);
      alert("No se pudo completar la acción. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const miId = getUserId(currentUser as { id?: string; _id?: string } | null);
  if (miId && String(miId) === String(targetUserId)) return null;

  return (
    <Button
      className="d-inline-flex align-items-center gap-1 rounded-pill px-3"
      size="sm"
      disabled={loading}
      onClick={handleFollowToggle}
      style={{
        backgroundColor: isFollowing ? "var(--muted)" : "var(--accent)",
        border: "none",
        color: "#ffffff",
      }}
    >
      {isFollowing ? (
        <>
          <BsPersonCheckFill size={16} color="#ffffff" />
          <span style={{ color: "#ffffff", fontWeight: "500" }}>Siguiendo</span>
        </>
      ) : (
        <>
          <BsPersonPlus size={16} color="#ffffff" />
          <span style={{ color: "#ffffff", fontWeight: "500" }}>Seguir</span>
        </>
      )}
    </Button>
  );
}

export default FollowButton;

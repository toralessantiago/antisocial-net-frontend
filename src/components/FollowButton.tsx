import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { followUser, unfollowUser } from "../services/UsuarioService";
import { Button } from "react-bootstrap";
import { BsPersonPlus, BsPersonCheckFill } from "react-icons/bs";

type FollowButtonProps = {
  targetUserId: string;
};

export function FollowButton({ targetUserId }: FollowButtonProps) {
  const { user: currentUser, updateCurrentUser } = useContext(UserContext);

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && currentUser.following) {
      const yaLoSigo = currentUser.following.includes(targetUserId);
      setIsFollowing(yaLoSigo);
    }
  }, [currentUser, targetUserId]);

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!currentUser) {
      alert("Debes iniciar sesión para seguir usuarios.");
      return;
    }

    const previousFollowing = [...(currentUser.following || [])];

    const optimisticFollowing = isFollowing
      ? previousFollowing.filter((id) => id !== targetUserId)
      : [...previousFollowing, targetUserId];
    setIsFollowing(!isFollowing);
    updateCurrentUser({ ...currentUser, following: optimisticFollowing });

    try {
      if (isFollowing) {
        await unfollowUser(currentUser.id || currentUser._id, targetUserId);
      } else {
        await followUser(currentUser.id || currentUser._id, targetUserId);
      }
    } catch (error) {
      console.error("Error en la acción de seguir:", error);
      setIsFollowing(isFollowing);
      updateCurrentUser({ ...currentUser, following: previousFollowing });
    }
  };

  const miId = currentUser?.id || currentUser?._id;
  if (String(miId) === String(targetUserId)) return null;

  return (
    <Button
      variant={isFollowing ? "outline-secondary" : "primary"}
      size="sm"
      onClick={handleFollowToggle}
      className="d-inline-flex align-items-center gap-1 rounded-pill px-3"
    >
      {isFollowing ? (
        <>
          <BsPersonCheckFill size={16} />
          <span>Siguiendo</span>
        </>
      ) : (
        <>
          <BsPersonPlus size={16} />
          <span>Seguir</span>
        </>
      )}
    </Button>
  );
}

export default FollowButton;

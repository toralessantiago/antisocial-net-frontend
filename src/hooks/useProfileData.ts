import { useState, useEffect, useCallback } from "react";
import { getUser, updateUser } from "../services/userService";
import {
  getPostsByUser,
  toggleLike,
  getLikesByUser,
} from "../services/PostsService";
import {
  getCommentsByUser,
  getCommentsByPost,
} from "../services/CommentsService";
import type { Profile, Post, Comment } from "../types/profile";

export function useProfileData(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, Comment[]>
  >({});
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    try {
      const userData = await getUser(userId);
      setProfile(userData.data);
      setEditProfile(userData.data);
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
    }
  }, [userId]);

  const loadPosts = useCallback(async () => {
    if (!userId) return;
    try {
      const userPosts = await getPostsByUser(userId);
      setPosts(userPosts);

      const commentsMap: Record<string, Comment[]> = {};
      await Promise.all(
        userPosts.map(async (post: Post) => {
          try {
            commentsMap[post._id] = await getCommentsByPost(post._id);
          } catch (err) {
            console.error(
              `Error obteniendo comentarios del post ${post._id}:`,
              err,
            );
            commentsMap[post._id] = [];
          }
        }),
      );
      setCommentsByPost(commentsMap);
    } catch (error) {
      console.error("Error al obtener los posts:", error);
    }
  }, [userId]);

  const loadComments = useCallback(async () => {
    if (!userId) return;
    try {
      setComments(await getCommentsByUser(userId));
    } catch (error) {
      console.error("Error al obtener los comentarios:", error);
    }
  }, [userId]);

  const loadLikes = useCallback(async () => {
    if (!userId) return;
    try {
      setLikedPosts(await getLikesByUser(userId));
    } catch (error) {
      console.error("Error al obtener los likes:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadProfile();
      loadPosts();
      loadComments();
      loadLikes();
    }
  }, [userId, loadProfile, loadPosts, loadComments, loadLikes]);

  const saveProfile = async (data: Partial<Profile>) => {
    if (!profile) return;
    const json = await updateUser(profile._id, data);
    setProfile(json.data);
    setEditProfile(json.data);
    return json.data;
  };

  const likePost = async (postId: string) => {
    if (!userId) return;
    const updatedPost = await toggleLike(postId, userId);
    setPosts((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));
    await loadLikes();
  };

  return {
    profile,
    editProfile,
    setEditProfile,
    posts,
    comments,
    commentsByPost,
    likedPosts,
    saveProfile,
    likePost,
  };
}

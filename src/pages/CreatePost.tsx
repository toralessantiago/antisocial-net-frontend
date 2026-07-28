import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/pages/createPost.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://import.meta.env.VITE_API_URL:3000/api";
interface Tag {
  _id: string;
  name: string;
}

function CreatePost() {
  const { user } = useContext(UserContext)!;
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/tags`)
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch(() => {});
  }, []);

  const addImageUrl = () => setImageUrls([...imageUrls, ""]);

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!description.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    if (!user) {
      setError("Debés iniciar sesión");
      return;
    }

    setLoading(true);
    try {
      const postRes = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          user: user.id,
          tags: selectedTags,
        }),
      });

      if (!postRes.ok) {
        const errData = await postRes.json();
        throw new Error(errData.message || "Error al crear el post");
      }

      const postData = await postRes.json();
      const postId = postData._id;

      const validUrls = imageUrls.filter((url) => url.trim() !== "");
      for (const url of validUrls) {
        await fetch(`${API_URL}/posts/${postId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });
      }

      setSuccess("Publicación creada. Redirigiendo...");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear el post";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-layout">
      <div className="create-post-left">
        <h1>Compartí tu idea</h1>
        <p>Creá una publicación para que la vean tus amigos.</p>
      </div>

      <div className="create-post-right-container">
        <div className="create-post-right">
          <h2 className="auth-title">Nueva Publicación</h2>

          {error && <div className="cp-error">{error}</div>}
          {success && <div className="cp-success">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Descripción *</label>
              <textarea
                className="form-control cp-textarea"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (error) setError("");
                }}
                placeholder="¿Qué estás pensando?"
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Imágenes (URLs opcionales)</label>
              {imageUrls.map((url, index) => (
                <div key={index} className="cp-image-row">
                  <input
                    type="url"
                    className="form-control"
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      className="cp-btn-remove"
                      onClick={() => removeImageUrl(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="cp-btn-add"
                onClick={addImageUrl}
              >
                + Agregar otra imagen
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Etiquetas</label>
              <div className="cp-tags-grid">
                {tags.map((tag) => (
                  <button
                    key={tag._id}
                    type="button"
                    className={`cp-tag-chip ${selectedTags.includes(tag._id) ? "selected" : ""}`}
                    onClick={() => toggleTag(tag._id)}
                  >
                    {tag.name}
                  </button>
                ))}
                {tags.length === 0 && (
                  <span className="cp-no-tags">
                    No hay etiquetas disponibles
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn-app w-100"
              disabled={loading}
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/pages/createPost.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  const validateDescription = (value: string) => {
    if (!value.trim()) return "La descripción es obligatoria";
    if (value.trim().length < 5) return "La descripción debe tener al menos 5 caracteres";
    return "";
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    
    if (touched.description) {
      setErrors((prev) => ({ ...prev, description: validateDescription(value) }));
    }
    if (serverError) setServerError("");
  };

  const handleBlur = () => {
    setTouched((prev) => ({ ...prev, description: true }));
    setErrors((prev) => ({ ...prev, description: validateDescription(description) }));
  };

  const getBorderClass = (name: string, value: string) => {
    if (!touched[name]) return "";
    if (errors[name]) return "input-error"; 
    if (value.trim()) return "input-success"; 
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    setTouched({ description: true });
    const descError = validateDescription(description);
    
    if (descError) {
      setErrors({ description: descError });
      return; 
    }

    if (!user) {
      setServerError("Debés iniciar sesión para publicar.");
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
      setServerError(msg);
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

          {/* Se usa noValidate para desactivar los errores de HTML por defecto */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            
            <div className="form-group">
              <label className="form-label">Descripción *</label>
              <textarea
                name="description"
                className={`form-control cp-textarea ${getBorderClass("description", description)}`}
                value={description}
                onChange={handleDescriptionChange}
                onBlur={handleBlur}
                placeholder="¿Qué estás pensando?"
                rows={4}
                disabled={loading}
              />
              {/* Mensaje de error personalizado debajo del input */}
              {errors.description && (
                <small className="text-danger">{errors.description}</small>
              )}
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
                    disabled={loading}
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      className="cp-btn-remove"
                      onClick={() => removeImageUrl(index)}
                      disabled={loading}
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
                disabled={loading}
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
                    disabled={loading}
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

            {/* Mensajes de error general del servidor o éxito */}
            {serverError && (
              <div className="text-danger text-center mb-2">{serverError}</div>
            )}
            {success && (
              <div className="text-success text-center mb-2">{success}</div>
            )}

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
import { usarPost } from "../contexts/PostContext";
import { useUser } from "../contexts/UserContext";
import supabase from "../../../supabaseClient";

export default function CommentModal() {
  const { selectedPost, setSelectedPost } = usarPost();
  const { user } = useUser();
  const [commentText, setCommentText] = useState("");

  if (!selectedPost) return null; // No mostrar si no hay post seleccionado

  const handleSubmit = async () => {
    if (!commentText.trim()) return;

    // Guardar en la tabla "comments"
    await supabase.from("comments").insert({
      post_id: selectedPost.id,
      user_id: user.id,
      content: commentText,
    });

    // Actualizar contador en "posts"
    await supabase
      .from("posts")
      .update({ commentsCount: selectedPost.commentsCount + 1 })
      .eq("id", selectedPost.id);

    // Cerrar modal
    setSelectedPost(null);
    setCommentText("");
  };

  return (
    <div className="modal">
      <div className="modal-content p-4 bg-white rounded shadow-lg">
        <h2>Responder a:</h2>
        <p className="text-gray-600">{selectedPost.text}</p>

        <textarea
          className="w-full p-2 border rounded mt-2"
          placeholder="Escribe tu comentario..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />

        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-1 rounded">
            Enviar
          </button>
          <button onClick={() => setSelectedPost(null)} className="bg-gray-300 px-4 py-1 rounded">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

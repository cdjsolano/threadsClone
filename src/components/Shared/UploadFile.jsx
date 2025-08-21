
import { useRef } from "react";

export default function UploadFile({
  accept = "image/*",   // tipo de archivo permitido
  trigger,              // icono o botón que abre el input
  onUpload              // callback con el File seleccionado
}) {
  const fileInputRef = useRef();

  // 🔹 Abre el input de archivo oculto
  const handleClick = () => {
    fileInputRef.current.click();
  };

  // 🔹 Maneja la selección del archivo (NO sube todavía)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Pasamos el File al padre (CreatePostModal lo subirá después)
    onUpload?.(file);

    // Resetear input para permitir volver a elegir el mismo archivo
    e.target.value = "";
  };

  
  return (
    <>
      <span onClick={handleClick} style={{ cursor: "pointer" }}>
        {trigger}
      </span>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept={accept}
        onChange={handleFileChange}
      />
    </>
  );
}

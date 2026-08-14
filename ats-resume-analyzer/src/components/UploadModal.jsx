import { useRef, useState } from "react";
import { X, Upload, CloudUpload } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function UploadModal() {
  const { uploadModalOpen, setUploadModalOpen, addToast } = useApp();
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const fileRef = useRef(null);

  function close() {
    setUploadModalOpen(false);
    setFileName(null);
    setDragging(false);
  }

  function handleFile(file) {
    if (!file) return;
    setFileName(file.name);
    addToast({ title: "File Selected", message: `${file.name} ready to upload.`, type: "success" });
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function handleUpload() {
    if (!fileName) {
      addToast({ title: "No File", message: "Please select a file first.", type: "warning" });
      return;
    }
    close();
    addToast({ title: "Uploading…", message: `${fileName} is being analyzed by AI.`, type: "info" });
  }

  return (
    <div className={`modal-backdrop ${uploadModalOpen ? "open" : ""}`} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Upload Resume</h3>
          <button className="modal-close" onClick={close}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div
            className={`dropzone ${dragging ? "drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <CloudUpload size={48} className="dropzone-icon" />
            {fileName ? (
              <>
                <p><strong>✓ {fileName}</strong></p>
                <p className="dropzone-sub">Click to change file</p>
              </>
            ) : (
              <>
                <p><strong>Drag &amp; drop your resume here</strong></p>
                <p className="dropzone-sub">or click to browse · PDF, DOCX, TXT supported</p>
              </>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={handleUpload}>
            <Upload size={15} />
            Upload &amp; Analyze
          </button>
        </div>
      </div>
    </div>
  );
}

// import { act } from "react";

// function Main({ activeNote, onUpdateNote }) {
//   const onEditField = (key, value) => {
//     onUpdateNote({
//       ...activeNote,
//       [key]: value,
//       lastModified: Date.now(),
//     });
//   };
//   if (!activeNote)
//     return <div className="no-active-note">No Note Selected</div>;
//   return (
//     <div className="app-main">
//       <div className="app-main-note-edit">
//         <input
//           type="text"
//           id="title"
//           value={activeNote.title}
//           onChange={(e) => onEditField("title", e.target.value)}
//           autoFocus
//         />
//         <textarea
//           id="body"
//           placeholder="Write your notes here..."
//           value={activeNote.body}
//           onChange={(e) => onEditField("body", e.target.value)}
//         />
//       </div>
//       <div className="app-main-note-preview">
//         <h1 className="preview-title">{activeNote.title}</h1>
//         <div className="markdown-preview">{activeNote.body}</div>
//       </div>
//     </div>
//   );
// }

// export default Main;

import { useState, useEffect } from "react";

function Main({ activeNote, onUpdateNote, onLogout }) {
  // Local state to hold the current title and body for editing
  const [localTitle, setLocalTitle] = useState(activeNote?.title || "");
  const [localBody, setLocalBody] = useState(activeNote?.body || "");

  // Update local state whenever activeNote changes
  useEffect(() => {
    setLocalTitle(activeNote?.title || "");
    setLocalBody(activeNote?.body || "");
  }, [activeNote]);

  // Function to save changes by calling onUpdateNote
  const handleSave = () => {
    onUpdateNote({
      ...activeNote,
      title: localTitle,
      body: localBody,
      lastModified: Date.now(),
    });
  };

  if (!activeNote)
    return <div className="no-active-note">No Note Selected</div>;

  return (
    <div className="app-main">
      <div className="app-main-note-edit">
        <input
          type="text"
          id="title"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          autoFocus
        />
        <textarea
          id="body"
          placeholder="Write your notes here..."
          value={localBody}
          onChange={(e) => setLocalBody(e.target.value)}
        />
      </div>
      <div className="app-main-note-preview">
        <h1 className="preview-title">{localTitle}</h1>
        <div className="markdown-preview">{localBody}</div>
        <button onClick={handleSave}>Save</button> {/* Save button */}
      </div>
    </div>
  );
}

export default Main;

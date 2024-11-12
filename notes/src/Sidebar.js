function Sidebar({
  notes,
  onAddNote,
  onDeleteNote,
  activeNote,
  setActiveNote,
  onLogout,
}) {
  const handleLogout = (e) => {
    e.preventDefault();
    onLogout(); // Call the onLogout function passed from App.js
  };

  return (
    <div className="app-sidebar">
      <div className="app-sidebar-header">
        <h1>Notes</h1>
        <form onSubmit={handleLogout}>
          <button type="submit" className="logout-button">
            Logout
          </button>
        </form>
        <button onClick={onAddNote} className="add-button">
          Add
        </button>
      </div>
      <div className="app-sidebar-notes">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`app-sidebar-note ${
              note.id === activeNote ? "active" : ""
            }`}
            onClick={() => setActiveNote(note.id)}
          >
            <div className="sidebar-note-title">
              <strong>{note.title}</strong>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                className="delete-button"
              >
                Delete
              </button>
            </div>
            <p>{note.body && note.body.substr(0, 10) + "..."}</p>
            <small className="note-meta">
              Last Modified{" "}
              {new Date(note.lastModified).toLocaleDateString("en-LB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;

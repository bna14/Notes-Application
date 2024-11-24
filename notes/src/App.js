import { useState, useEffect } from "react";
import "./App.css";
import Main from "./Main";
import Sidebar from "./Sidebar";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [userId, setUserId] = useState(false);

  const onLogin = (isLoggedIn, id) => {
    setIsLoggedIn(isLoggedIn);
    setUserId(id);
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    localStorage.removeItem("user_id");
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      setIsLoggedIn(true);
      console.log(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetch(`https://notes-application-x57d.onrender.com/api/notes?user_id=${userId}`)
        .then((response) => response.json())
        .then((data) => setNotes(data))
        .catch((error) => console.error("Error fetching notes:", error));
    } else {
      console.log("Hawnnn");
    }
  }, [userId]);

  if (!isLoggedIn) {
    return showSignup ? (
      <Signup onSignup={() => setShowSignup(false)} />
    ) : (
      <Login onLogin={onLogin} onShowSignup={() => setShowSignup(true)} />
    );
  }

  const onAddNote = async () => {
    if (userId) {
      console.log("User ID:", userId);
    } else {
      alert("UserisHere");
      console.log("No user ID found in localStorage.");
    }
    const newNote = {
      title: "Untitled Note",
      body: "",
      user_id: userId,
    };
    console.log("User ID before adding note:", userId);
    try {
      const response = await fetch("https://notes-application-x57d.onrender.com/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });
      const data = await response.json();
      console.log(data);
      setNotes([data, ...notes]);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const onDeleteNote = async (idToDelete) => {
    try {
      await fetch(`https://notes-application-x57d.onrender.com/api/notes/${idToDelete}`, {
        method: "DELETE",
      });
      setNotes(notes.filter((note) => note.id !== idToDelete));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArr = notes.map((note) => {
      if (note.id === updatedNote.id) {
        return updatedNote;
      }
      return note;
    });
    setNotes(updatedNotesArr);

    fetch(`https://notes-application-x57d.onrender.com/api/notes/${updatedNote.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: updatedNote.title,
        body: updatedNote.body,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Note updated:", data);
      })
      .catch((error) => console.error("Error updating note:", error));
  };

  const getActiveNote = () => {
    return notes.find((note) => note.id === activeNote);
  };

  return (
    <div className="App">
      <Sidebar
        notes={notes}
        onAddNote={onAddNote}
        onDeleteNote={onDeleteNote}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        onLogout={onLogout}
      />
      <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
    </div>
  );
}

export default App;

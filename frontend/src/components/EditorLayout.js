import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import NoteList from './NoteList';
import NoteEditor from './NoteEditor';
import './EditorLayout.css';

function EditorLayout() {
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInitialNotes = async () => {
            try {
                const res = await api.get('/notes');
                setNotes(res.data);
                if (res.data.length > 0) {
                    setActiveNote(res.data[0]);
                }
            } catch (err) { console.error("Error fetching notes:", err); }
            finally { setIsLoading(false); }
        };
        fetchInitialNotes();
    }, []);

    const handleSelectNote = (note) => setActiveNote(note);

    const handleAddNote = async () => {
        try {
            const res = await api.post('/notes');
            const newFullNote = await api.get(`/notes/${res.data.id}`); // Fetch full note
            setNotes([newFullNote.data, ...notes]);
            setActiveNote(newFullNote.data);
        } catch (err) { console.error("Error creating note:", err); }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await api.delete(`/notes/${noteId}`);
            const updatedNotes = notes.filter(n => n.id !== noteId);
            setNotes(updatedNotes);
            if (activeNote && activeNote.id === noteId) {
                setActiveNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
            }
        } catch (err) { console.error("Error deleting note:", err); }
    };

    const handleNoteUpdate = (updatedNoteSummary) => {
        const newNotes = notes.map(n => n.id === updatedNoteSummary.id ? { ...n, ...updatedNoteSummary } : n);
        newNotes.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setNotes(newNotes);
    };

    return (
        <div className="editor-layout">
            <NoteList
                notes={notes}
                activeNote={activeNote}
                onSelectNote={handleSelectNote}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
            />
            <main className="main-content">
                {isLoading ? <div className="message-area">Loading...</div>
                : activeNote ? <NoteEditor key={activeNote.id} noteId={activeNote.id} onNoteUpdate={handleNoteUpdate} />
                : <div className="message-area"><h2>Welcome to SimpleNotes</h2><p>Create a new note to get started.</p></div>}
            </main>
        </div>
    );
}
export default EditorLayout;
import React from 'react';
import { FiPlus, FiTrash2, FiLogOut } from 'react-icons/fi';
import { format } from 'date-fns';
import './NoteList.css';

function NoteList({ notes, activeNote, onSelectNote, onAddNote, onDeleteNote }) {
    const handleLogout = () => {
        sessionStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <aside className="note-list-sidebar">
            <div className="sidebar-header">
                <h2>SimpleNotes</h2>
                <button onClick={onAddNote} className="new-note-btn"><FiPlus /></button>
            </div>
            <div className="notes-container">
                {notes.map(note => (
                    <div key={note.id} className={`note-item ${activeNote && activeNote.id === note.id ? 'active' : ''}`} onClick={() => onSelectNote(note)}>
                        <h3>{note.title || 'Untitled Note'}</h3>
                        <p>{format(new Date(note.updated_at), 'MMM d, yyyy')}</p>
                        <button className="delete-note-btn" onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}>
                            <FiTrash2 />
                        </button>
                    </div>
                ))}
            </div>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn"><FiLogOut /><span>Logout</span></button>
            </div>
        </aside>
    );
}
export default NoteList;
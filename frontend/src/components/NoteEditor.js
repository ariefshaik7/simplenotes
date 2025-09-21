import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api';
import { format } from 'date-fns';
import { FiEdit, FiSave, FiXCircle } from 'react-icons/fi';

// Lexical Core Imports
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

// Local Imports
import EditorTheme from './EditorTheme';
import AutoFocusPlugin from './plugins/AutoFocusPlugin';
import './NoteEditor.css';

// This plugin dynamically sets the editor's editable state.
function DynamicEditablePlugin({ isEditing }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        // Set the editor to be editable or read-only based on the isEditing state
        editor.setEditable(isEditing);
    }, [editor, isEditing]);
    return null;
}

// This plugin gets the latest editor state for our save function.
const SavePlugin = ({ onSave }) => {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        // Provide a function to the parent to get the current editor state as a string
        onSave(() => JSON.stringify(editor.getEditorState().toJSON()));
    }, [editor, onSave]);
    return null;
};

function NoteEditor({ noteId, onNoteUpdate }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const getEditorContentRef = useRef(null);

    // Fetches the current note's data from the server
    const fetchNote = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/notes/${noteId}`);
            setTitle(res.data.title);
            setContent(res.data.content);
            setUpdatedAt(res.data.updated_at);
        } catch (err) {
            console.error("Failed to fetch note:", err);
        } finally {
            setIsLoading(false);
        }
    }, [noteId]);

    // Re-fetch the note whenever the noteId changes
    useEffect(() => {
        fetchNote();
        setIsEditing(false); // Always start in view mode when a new note is selected
    }, [fetchNote]);

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        setIsEditing(false);
        fetchNote(); // Discard changes by re-fetching the original data
    };

    const handleSave = async () => {
        if (getEditorContentRef.current) {
            const currentContent = getEditorContentRef.current();
            try {
                const res = await api.put(`/notes/${noteId}`, {
                    title: title,
                    content: currentContent,
                });
                onNoteUpdate(res.data);
                setUpdatedAt(res.data.updated_at);
                setIsEditing(false); // Return to view mode after saving
            } catch (err) {
                console.error("Error saving note:", err);
            }
        }
    };

    const initialConfig = {
        namespace: 'SimpleNotesEditor',
        theme: EditorTheme,
        onError: (error) => console.error(error),
        editorState: content,
    };

    if (isLoading) return <div className="editor-container loading">Loading Note...</div>;

    return (
        <LexicalComposer initialConfig={initialConfig} key={noteId}>
            <div className="editor-container">
                <div className="editor-header">
                    <input
                        type="text"
                        className="note-title-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Untitled Note"
                        readOnly={!isEditing}
                    />
                    <div className="editor-controls">
                        <span className="last-updated">
                            Last saved: {format(new Date(updatedAt), 'MMM d, h:mm a')}
                        </span>
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} className="control-btn save-btn"><FiSave /> Save</button>
                                <button onClick={handleCancel} className="control-btn cancel-btn"><FiXCircle /> Cancel</button>
                            </>
                        ) : (
                            <button onClick={handleEdit} className="control-btn edit-btn"><FiEdit /> Edit</button>
                        )}
                    </div>
                </div>
                <div className="editor-wrapper">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-content" />}
                        placeholder={<div className="editor-placeholder">Start writing...</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <SavePlugin onSave={(getEditorContent) => { getEditorContentRef.current = getEditorContent; }} />
                    <DynamicEditablePlugin isEditing={isEditing} />
                    {isEditing && <AutoFocusPlugin />}
                </div>
            </div>
        </LexicalComposer>
    );
}
export default NoteEditor;
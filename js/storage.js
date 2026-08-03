"use strict";

/* ==========================================================
   STORAGE.JS
   Handles Local Storage operations
========================================================== */

const STORAGE_KEYS = {
  NOTES: "notes-app-notes",
  THEME: "notes-app-theme",
};

const Storage = {
  loadNotes() {
    try {
      const storedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (!storedNotes) return [];
      return JSON.parse(storedNotes);
    } catch (error) {
      console.error("Unable to load notes.", error);
      return [];
    }
  },

  saveNotes(notes) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (error) {
      console.error("Unable to save notes.", error);
    }
  },

  loadTheme() {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
    } catch (error) {
      console.error("Unable to load theme.", error);
      return "light";
    }
  },

  saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error("Unable to save theme.", error);
    }
  },

  exportNotes(notes) {
    try {
      const jsonData = JSON.stringify(notes, null, 4);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "notes-backup.json";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed.", error);
      alert("Export failed.");
    }
  },

  importNotes(file, callback) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
      try {
        const importedNotes = JSON.parse(reader.result);
        if (!Array.isArray(importedNotes)) {
          throw new Error("Invalid JSON");
        }

        callback(importedNotes);
      } catch (error) {
        alert("Invalid notes file.");
      }
    };

    reader.readAsText(file);
  },
};



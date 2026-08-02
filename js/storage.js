"use strict";

/* ==========================================================
   STORAGE.JS
   Handles all Local Storage operations
========================================================== */

/* ==========================================================
   STORAGE KEYS
========================================================== */

const STORAGE_KEYS = {
  NOTES: "notes-app-notes",

  THEME: "notes-app-theme",
};

/* ==========================================================
   LOAD NOTES
========================================================== */

const Storage = {
  loadNotes() {
    try {
      const storedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);

      if (!storedNotes) {
        return [];
      }

      return JSON.parse(storedNotes);
    } catch (error) {
      console.error(
        "Unable to load notes.",

        error,
      );

      return [];
    }
  },

  /* ==========================================================
   SAVE NOTES
   ========================================================== */
  saveNotes(notes) {
    try {
      localStorage.setItem(
        STORAGE_KEYS.NOTES,

        JSON.stringify(notes),
      );
    } catch (error) {
      console.error(
        "Unable to save notes.",

        error,
      );
    }
  },

  /* ==========================================================
   LOAD THEME
========================================================== */

  loadTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  },

  /* ==========================================================
   SAVE THEME
========================================================== */

  saveTheme(theme) {
    localStorage.setItem(
      STORAGE_KEYS.THEME,

      theme,
    );
  },

  /* ==========================================================
   EXPORT NOTES
========================================================== */

  exportNotes(notes) {
    try {
      const jsonData = JSON.stringify(
        notes,

        null,

        4,
      );

      const blob = new Blob(
        [jsonData],

        {
          type: "application/json",
        },
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "notes-backup.json";

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Export failed.",

        error,
      );
    }
  },

  /* ==========================================================
   IMPORT NOTES
========================================================== */

  importNotes(file, callback) {
    if (!file) {
      return;
    }

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



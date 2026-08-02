"use strict";

/* ==========================================================
   APP.JS
   Main Application Logic
========================================================== */

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const DOM = {
  /* ==========================
       Note Editor
    ========================== */

  editorTitle: document.getElementById("editorTitle"),

  noteTitle: document.getElementById("noteTitle"),

  noteDescription: document.getElementById("noteDescription"),

  category: document.getElementById("category"),

  tags: document.getElementById("tags"),

  noteColor: document.getElementById("noteColor"),

  /* ==========================
       Buttons
    ========================== */

  saveButton: document.getElementById("saveNoteBtn"),

  newNoteButton: document.getElementById("newNoteBtn"),

  themeButton: document.getElementById("themeBtn"),

  importButton: document.getElementById("importBtn"),

  exportButton: document.getElementById("exportBtn"),

  /* ==========================
       Search & Sort
    ========================== */

  search: document.getElementById("searchInput"),

  sort: document.getElementById("sortNotes"),

  /* ==========================
       Counters
    ========================== */

  characterCount: document.getElementById("characterCount"),

  wordCount: document.getElementById("wordCount"),

  /* ==========================
       Notes
    ========================== */

  notesContainer: document.getElementById("notesContainer"),

  emptyState: document.getElementById("emptyState"),

  /* ==========================
       Statistics
    ========================== */

  totalNotes: document.getElementById("totalNotes"),

  pinnedNotes: document.getElementById("pinnedNotes"),

  favoriteNotes: document.getElementById("favoriteNotes"),

  archivedNotes: document.getElementById("archivedNotes"),

  /* ==========================
       Delete Modal
    ========================== */

  deleteModal: document.getElementById("deleteModal"),

  confirmDeleteButton: document.getElementById("confirmDelete"),

  cancelDeleteButton: document.getElementById("cancelDelete"),

  /* ==========================
       Toast
    ========================== */

  toast: document.getElementById("toast"),

  /* ==========================
       Import File
    ========================== */

  importFile: document.getElementById("importFile"),
};

/* ==========================================================
   APPLICATION
========================================================== */

const App = {
  /* ======================================================
       APPLICATION STATE
    ====================================================== */

  state: {
    notes: [],

    editingNoteId: null,

    noteToDeleteId: null,

    currentFilter: "all",

    currentCategory: "all",

    currentSearch: "",

    currentSort: "newest",

    currentTheme: "light",
  },

  /* ======================================================
       INITIALIZATION
    ====================================================== */

  init() {
    this.state.notes = Storage.loadNotes();

    this.state.currentTheme = Storage.loadTheme();

    this.applyTheme();

    this.registerEvents();

    // UI.renderNotes(this.state.notes);
    // UI.updateStatistics(this.state.notes);
  },

  /* ======================================================
       REGISTER EVENTS
    ====================================================== */

  registerEvents() {
    /* Save */

    DOM.saveButton.addEventListener(
      "click",

      () => this.saveNote(),
    );

    /* New Note */

    DOM.newNoteButton.addEventListener(
      "click",

      () => this.clearEditor(),
    );

    /* Search */

    DOM.search.addEventListener(
      "input",

      (event) => {
        this.state.currentSearch = event.target.value;

        this.searchNotes();
      },
    );

    /* Sort */

    DOM.sort.addEventListener(
      "change",

      (event) => {
        this.state.currentSort = event.target.value;

        this.sortNotes();
      },
    );

    /* Theme */

    DOM.themeButton.addEventListener(
      "click",

      () => this.toggleTheme(),
    );

    /* Export */

    DOM.exportButton.addEventListener(
      "click",

      () => this.exportNotes(),
    );

    /* Import */

    DOM.importButton.addEventListener(
      "click",

      () => DOM.importFile.click(),
    );

    DOM.importFile.addEventListener(
      "change",

      (event) => {
        this.importNotes(event);
      },
    );

    /* Counter */

    DOM.noteDescription.addEventListener(
      "input",

      () => this.updateCounters(),
    );

    /* Delete Modal */

    DOM.cancelDeleteButton.addEventListener(
      "click",

      () => this.closeDeleteModal(),
    );

    DOM.confirmDeleteButton.addEventListener(
      "click",

      () => this.confirmDelete(),
    );

    /* ==========================
   Close Modal on Outside Click
========================== */

    DOM.deleteModal.addEventListener(
      "click",

      (event) => {
        if (event.target === DOM.deleteModal) {
          this.closeDeleteModal();
        }
      },
    );
    /* ==========================
   Note Card Actions
========================== */

    DOM.notesContainer.addEventListener(
      "click",

      (event) => this.handleNoteAction(event),
    );

    /* ==========================
   Escape Key
========================== */

    document.addEventListener(
      "keydown",

      (event) => {
        if (
          event.key === "Escape" &&
          DOM.deleteModal.classList.contains("show")
        ) {
          this.closeDeleteModal();
        }
      },
    );
  },

  /* ======================================================
   NOTE CARD ACTIONS
====================================================== */

  handleNoteAction(event) {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const action = button.dataset.action;

    const noteId = button.dataset.id;

    switch (action) {
      case "edit":
        this.editNote(noteId);

        break;

      case "delete":
        this.openDeleteModal(noteId);

        break;

      case "pin":
        this.togglePin(noteId);

        break;

      case "favorite":
        this.toggleFavorite(noteId);

        break;

      case "archive":
        this.toggleArchive(noteId);

        break;
    }
  },

  /* ======================================================
   NOTE ACTIONS
====================================================== */

  editNote(noteId) {
    const note = this.state.notes.find((note) => note.id === noteId);

    if (!note) {
      return;
    }

    this.state.editingNoteId = note.id;

    DOM.editorTitle.textContent = "Edit Note";

    DOM.noteTitle.value = note.title;

    DOM.noteDescription.value = note.description;

    DOM.category.value = note.category;

    DOM.tags.value = note.tags.join(", ");

    DOM.noteColor.value = note.color;

    DOM.saveButton.innerHTML = `<i class="fa-solid fa-pen"></i> Update Note`;

    this.updateCounters();

    DOM.noteTitle.focus();
  },

  openDeleteModal(noteId) {
    this.state.noteToDeleteId = noteId;

    DOM.deleteModal.classList.add("show");
  },

  closeDeleteModal() {
    this.state.noteToDeleteId = null;

    DOM.deleteModal.classList.remove("show");
  },

  confirmDelete() {
    if (!this.state.noteToDeleteId) {
      return;
    }

    this.state.notes = this.state.notes.filter(
      (note) => note.id !== this.state.noteToDeleteId,
    );

    this.refreshApp();

    this.closeDeleteModal();

    UI.showToast("Note deleted successfully.");
  },

  togglePin(noteId) {
    const note = this.state.notes.find((note) => note.id === noteId);

    if (!note) {
      return;
    }

    note.pinned = !note.pinned;

    this.refreshApp();

    UI.showToast(note.pinned ? "Note pinned." : "Note unpinned.");
  },

  toggleFavorite(noteId) {
    const note = this.state.notes.find((note) => note.id === noteId);

    if (!note) {
      return;
    }

    UI.showToast(
      note.favorite ? "Added to favorites." : "Removed from favorites.",
    );
  },

  toggleArchive(noteId) {
    const note = this.state.notes.find((note) => note.id === noteId);

    if (!note) {
      return;
    }

    UI.showToast(note.archived ? "Note archived." : "Note restored.");
  },
  /* ======================================================
       THEME
    ====================================================== */

  applyTheme() {
    document.body.classList.toggle(
      "dark",

      this.state.currentTheme === "dark",
    );
  },

  toggleTheme() {
    this.state.currentTheme =
      this.state.currentTheme === "light" ? "dark" : "light";

    this.applyTheme();

    Storage.saveTheme(this.state.currentTheme);
  },

  /* ======================================================
   CRUD OPERATIONS
====================================================== */

  saveNote() {
    if (!this.validateForm()) {
      return;
    }

    if (this.state.editingNoteId) {
      this.updateNote();
    } else {
      this.createNote();
    }
  },

  createNote() {
    const newNote = {
      id: this.generateId(),

      title: DOM.noteTitle.value.trim(),

      description: DOM.noteDescription.value.trim(),

      category: DOM.category.value,

      tags: this.getTags(),

      color: DOM.noteColor.value,

      pinned: false,

      favorite: false,

      archived: false,

      createdAt: this.getCurrentDate(),

      updatedAt: this.getCurrentDate(),
    };

    this.state.notes.unshift(newNote);

    this.refreshApp();

    this.clearEditor();
  },

  updateNote() {
    const note = this.state.notes.find(
      (note) => note.id === this.state.editingNoteId,
    );

    if (!note) {
      return;
    }

    note.title = DOM.noteTitle.value.trim();

    note.description = DOM.noteDescription.value.trim();

    note.category = DOM.category.value;

    note.tags = this.getTags();

    note.color = DOM.noteColor.value;

    note.updatedAt = this.getCurrentDate();

    this.state.editingNoteId = null;

    this.refreshApp();

    this.clearEditor();
  },

  clearEditor() {
    DOM.editorTitle.textContent = "Create New Note";

    DOM.noteTitle.value = "";

    DOM.noteDescription.value = "";

    DOM.category.selectedIndex = 0;

    DOM.tags.value = "";

    DOM.noteColor.value = "#ffffff";

    DOM.characterCount.textContent = "Characters : 0";

    DOM.wordCount.textContent = "Words : 0";

    this.state.editingNoteId = null;

    DOM.saveButton.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Note`;
  },

  /* ======================================================
   HELPER METHODS
====================================================== */

  validateForm() {
    if (DOM.noteTitle.value.trim() === "") {
      UI.showToast(
        "Please enter a note title.",

        "error",
      );

      DOM.noteTitle.focus();

      return false;
    }

    if (DOM.noteDescription.value.trim() === "") {
      UI.showToast(
        "Please enter a description.",

        "error",
      );

      DOM.noteDescription.focus();

      return false;
    }

    return true;
  },

  generateId() {
    return crypto.randomUUID();
  },

  getCurrentDate() {
    return new Date().toISOString();
  },

  getTags() {
    return DOM.tags.value

      .split(",")

      .map((tag) => tag.trim())

      .filter((tag) => tag !== "");
  },

  /* ======================================================
   REFRESH APPLICATION
====================================================== */

  refreshApp() {
    Storage.saveNotes(this.state.notes);

    const visibleNotes = this.getVisibleNotes();

    UI.renderNotes(visibleNotes);

    UI.updateStatistics(this.state.notes);
  },

  //  for search notes

  searchNotes() {
    UI.renderNotes(this.getVisibleNotes());
  },

  //  for sort notes

  sortNotes() {
    UI.renderNotes(this.getVisibleNotes());
  },

  //  for export notes

  exportNotes() {
    Storage.exportNotes(this.state.notes);
  },

  // for import notes

  importNotes(event) {
    const file = event.target.files[0];

    Storage.importNotes(
      file,

      (importedNotes) => {
        this.state.notes = importedNotes;

        this.refreshApp();
      },
    );

    event.target.value = "";
  },

  // update counters for character and word count

  updateCounters() {
    const text = DOM.noteDescription.value;

    DOM.characterCount.textContent = `Characters : ${text.length}`;

    const words = text

      .trim()

      .split(/\s+/)

      .filter((word) => word !== "");

    DOM.wordCount.textContent = `Words : ${words.length}`;
  },

  /* ======================================================
   GET VISIBLE NOTES
====================================================== */

  getVisibleNotes() {
    let notes = [...this.state.notes];

    /* ==========================
       Search
    ========================== */

    if (this.state.currentSearch.trim() !== "") {
      const searchText = this.state.currentSearch.toLowerCase().trim();

      notes = notes.filter((note) => {
        return (
          note.title.toLowerCase().includes(searchText) ||
          note.description.toLowerCase().includes(searchText) ||
          note.category.toLowerCase().includes(searchText) ||
          note.tags.some((tag) => tag.toLowerCase().includes(searchText))
        );
      });
    }

    /* ==========================
       Category
    ========================== */

    if (this.state.currentCategory !== "all") {
      notes = notes.filter(
        (note) => note.category === this.state.currentCategory,
      );
    }

    /* ==========================
       Sorting
    ========================== */

    switch (this.state.currentSort) {
      case "newest":
        notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        break;

      case "oldest":
        notes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        break;

      case "title":
        notes.sort((a, b) => a.title.localeCompare(b.title));

        break;
    }

    return notes;
  },

  /* ======================================================
       PLACEHOLDERS
       (Implemented in next parts)
    ====================================================== */

  closeDeleteModal() {},

  confirmDelete() {},
};

/* ==========================================================
   START APPLICATION
========================================================== */

document.addEventListener(
  "DOMContentLoaded",

  () => App.init(),
);

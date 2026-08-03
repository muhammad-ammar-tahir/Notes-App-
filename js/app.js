"use strict";

/* ==========================================================
   APP.JS
   Main Application Logic
========================================================== */

const DOM = {
  editorTitle: document.getElementById("editorTitle"),
  noteTitle: document.getElementById("noteTitle"),
  noteDescription: document.getElementById("noteDescription"),
  category: document.getElementById("category"),
  tags: document.getElementById("tags"),
  noteColor: document.getElementById("noteColor"),

  saveButton: document.getElementById("saveNoteBtn"),
  newNoteButton: document.getElementById("newNoteBtn"),
  themeButton: document.getElementById("themeBtn"),
  importButton: document.getElementById("importBtn"),
  exportButton: document.getElementById("exportBtn"),

  search: document.getElementById("searchInput"),
  sort: document.getElementById("sortNotes"),

  characterCount: document.getElementById("characterCount"),
  wordCount: document.getElementById("wordCount"),

  notesContainer: document.getElementById("notesContainer"),
  emptyState: document.getElementById("emptyState"),
  emptyStateTitle: document.getElementById("emptyStateTitle"),
  emptyStateMessage: document.getElementById("emptyStateMessage"),

  totalNotes: document.getElementById("totalNotes"),
  pinnedNotes: document.getElementById("pinnedNotes"),
  favoriteNotes: document.getElementById("favoriteNotes"),
  archivedNotes: document.getElementById("archivedNotes"),

  deleteModal: document.getElementById("deleteModal"),
  confirmDeleteButton: document.getElementById("confirmDelete"),
  cancelDeleteButton: document.getElementById("cancelDelete"),

  toast: document.getElementById("toast"),

  importFile: document.getElementById("importFile"),

  filterItems: document.querySelectorAll("[data-filter]"),
  categoryFilters: document.querySelectorAll("[data-category]"),
};

const App = {
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

  init() {
    this.state.notes = Storage.loadNotes();
    this.state.currentTheme = Storage.loadTheme();

    this.populateCategoryOptions();
    this.applyTheme();
    this.registerEvents();
    this.clearEditor();
    this.render();
  },

  registerEvents() {
    DOM.saveButton.addEventListener("click", () => this.saveNote());
    DOM.newNoteButton.addEventListener("click", () => this.clearEditor());

    DOM.search.addEventListener("input", (event) => {
      this.state.currentSearch = event.target.value.trim().toLowerCase();
      this.render();
    });

    DOM.sort.addEventListener("change", (event) => {
      this.state.currentSort = event.target.value;
      this.render();
    });

    DOM.themeButton.addEventListener("click", () => this.toggleTheme());
    DOM.exportButton.addEventListener("click", () => this.exportNotes());

    DOM.importButton.addEventListener("click", () => DOM.importFile.click());
    DOM.importFile.addEventListener("change", (event) => this.importNotes(event));

    DOM.noteTitle.addEventListener("input", () => this.updateCounters());
    DOM.noteDescription.addEventListener("input", () => this.updateCounters());

    DOM.cancelDeleteButton.addEventListener("click", () => this.closeDeleteModal());
    DOM.confirmDeleteButton.addEventListener("click", () => this.confirmDelete());

    DOM.deleteModal.addEventListener("click", (event) => {
      if (event.target === DOM.deleteModal) {
        this.closeDeleteModal();
      }
    });

    DOM.notesContainer.addEventListener("click", (event) => this.handleNoteAction(event));

    DOM.filterItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.state.currentFilter = item.dataset.filter || "all";
        this.render();
      });
    });

    DOM.categoryFilters.forEach((item) => {
      item.addEventListener("click", () => {
        this.state.currentCategory = item.dataset.category || "all";
        this.render();
      });
    });

    document.addEventListener("keydown", (event) => this.handleKeyboardShortcut(event));
  },

  handleKeyboardShortcut(event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "n") {
      event.preventDefault();
      this.clearEditor();
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      this.saveNote();
    }
  },

  findNote(noteId) {
    return this.state.notes.find((note) => note.id === noteId) || null;
  },

  render() {
    const visibleNotes = this.getVisibleNotes();

    UI.renderNotes(visibleNotes, this.state);
    UI.updateStatistics(this.state.notes);
    UI.setThemeButtonIcon(this.state.currentTheme);
    UI.setActiveFilter(this.state.currentFilter);
    UI.setActiveCategory(this.state.currentCategory);

    this.updateCounters();
    Storage.saveNotes(this.state.notes);
  },

  getVisibleNotes() {
    const search = this.state.currentSearch.trim().toLowerCase();

    let filtered = this.state.notes.filter((note) => {
      if (this.state.currentFilter === "pinned") {
        if (!note.pinned) return false;
      } else if (this.state.currentFilter === "favorites") {
        if (!note.favorite) return false;
      } else if (this.state.currentFilter === "archived") {
        if (!note.archived) return false;
      }

      if (this.state.currentCategory !== "all" && note.category !== this.state.currentCategory) {
        return false;
      }

      if (!search) return true;

      const haystack = [
        note.title,
        note.description,
        note.category,
        note.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });

    switch (this.state.currentSort) {
      case "oldest":
        filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "az":
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "updated":
        filtered = filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      default:
        filtered = filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return filtered;
  },

  saveNote() {
    if (!this.validateForm()) {
      UI.showToast("Title and description are required.", "error");
      return;
    }

    const noteData = {
      title: DOM.noteTitle.value.trim(),
      description: DOM.noteDescription.value.trim(),
      category: DOM.category.value.trim() || "General",
      tags: this.getTags(),
      color: DOM.noteColor.value || "#ffffff",
    };

    const now = this.getCurrentDate();

    if (this.state.editingNoteId) {
      this.state.notes = this.state.notes.map((note) =>
        note.id === this.state.editingNoteId
          ? { ...note, ...noteData, updatedAt: now }
          : note,
      );
      UI.showToast("Note updated successfully.");
    } else {
      const newNote = {
        id: this.generateId(),
        ...noteData,
        pinned: false,
        favorite: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      };

      this.state.notes.unshift(newNote);
      UI.showToast("Note created successfully.");
    }

    this.state.editingNoteId = null;
    this.clearEditor();
    this.render();
  },

  editNote(noteId) {
    const note = this.findNote(noteId);

    if (!note) return;

    this.state.editingNoteId = note.id;

    DOM.editorTitle.textContent = "Edit Note";
    DOM.noteTitle.value = note.title;
    DOM.noteDescription.value = note.description;
    DOM.category.value = note.category || "General";
    DOM.tags.value = note.tags.join(", ");
    DOM.noteColor.value = note.color || "#ffffff";

    DOM.saveButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Note';

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
    if (!this.state.noteToDeleteId) return;

    this.state.notes = this.state.notes.filter((note) => note.id !== this.state.noteToDeleteId);

    this.state.noteToDeleteId = null;
    this.render();
    this.closeDeleteModal();
    UI.showToast("Note deleted successfully.");
  },

  togglePin(noteId) {
    const note = this.findNote(noteId);
    if (!note) return;

    note.pinned = !note.pinned;
    note.updatedAt = this.getCurrentDate();
    this.render();
    UI.showToast(note.pinned ? "Note pinned." : "Note unpinned.");
  },

  toggleFavorite(noteId) {
    const note = this.findNote(noteId);
    if (!note) return;

    note.favorite = !note.favorite;
    note.updatedAt = this.getCurrentDate();
    this.render();
    UI.showToast(note.favorite ? "Added to favorites." : "Removed from favorites.");
  },

  toggleArchive(noteId) {
    const note = this.findNote(noteId);
    if (!note) return;

    note.archived = !note.archived;
    note.updatedAt = this.getCurrentDate();
    this.render();
    UI.showToast(note.archived ? "Note archived." : "Note restored.");
  },

  applyTheme() {
    document.body.classList.toggle("dark", this.state.currentTheme === "dark");
  },

  toggleTheme() {
    this.state.currentTheme = this.state.currentTheme === "dark" ? "light" : "dark";
    Storage.saveTheme(this.state.currentTheme);
    this.applyTheme();
    UI.setThemeButtonIcon(this.state.currentTheme);
    UI.showToast(`Theme switched to ${this.state.currentTheme}.`);
  },

  clearEditor() {
    this.state.editingNoteId = null;
    DOM.editorTitle.textContent = "Create New Note";
    DOM.noteTitle.value = "";
    DOM.noteDescription.value = "";
    DOM.category.value = "General";
    DOM.tags.value = "";
    DOM.noteColor.value = "#ffffff";
    DOM.saveButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Note';
    this.updateCounters();
    DOM.noteTitle.focus();
  },

  validateForm() {
    const title = DOM.noteTitle.value.trim();
    const description = DOM.noteDescription.value.trim();
    return title.length > 0 && description.length > 0;
  },

  generateId() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  },

  getCurrentDate() {
    return new Date().toISOString();
  },

  getTags() {
    return DOM.tags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  },

  updateCounters() {
    const titleText = DOM.noteTitle.value.trim();
    const descriptionText = DOM.noteDescription.value.trim();
    const combined = `${titleText} ${descriptionText}`.trim();

    const chars = combined.length;
    const words = combined ? combined.split(/\s+/).length : 0;

    DOM.characterCount.textContent = `${chars} chars`;
    DOM.wordCount.textContent = `${words} words`;
  },

  exportNotes() {
    Storage.exportNotes(this.state.notes);
    UI.showToast("Notes exported successfully.");
  },

  importNotes(event) {
    const file = event.target.files[0];
    if (!file) return;

    Storage.importNotes(file, (importedNotes) => {
      this.state.notes = importedNotes.map((note, index) => this.normalizeNote(note, index));
      this.state.editingNoteId = null;
      this.state.noteToDeleteId = null;
      this.clearEditor();
      this.render();
      UI.showToast("Notes imported successfully.");
    });

    event.target.value = "";
  },

  normalizeNote(note, index) {
    return {
      id: note.id || this.generateId(),
      title: note.title || "Untitled Note",
      description: note.description || "",
      category: note.category || "General",
      tags: Array.isArray(note.tags) ? note.tags : [],
      color: note.color || "#ffffff",
      pinned: Boolean(note.pinned),
      favorite: Boolean(note.favorite),
      archived: Boolean(note.archived),
      createdAt: note.createdAt || this.getCurrentDate(),
      updatedAt: note.updatedAt || this.getCurrentDate(),
    };
  },

  populateCategoryOptions() {
    const categories = [
      "General",
      "Work",
      "Study",
      "Personal",
      "Shopping",
      ...this.state.notes.map((note) => note.category).filter(Boolean),
    ];

    const uniqueCategories = [...new Set(categories.map((item) => item.trim()).filter(Boolean))];

    DOM.category.innerHTML = uniqueCategories
      .map((category) => `<option value="${this.escapeHTML(category)}">${this.escapeHTML(category)}</option>`)
      .join("");

    if (!uniqueCategories.includes(DOM.category.value)) {
      DOM.category.value = "General";
    }
  },

  escapeHTML(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  },

  handleNoteAction(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const noteId = button.dataset.id;

    switch (action) {
      case "edit":
        this.editNote(noteId);
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
      case "delete":
        this.openDeleteModal(noteId);
        break;
      default:
        break;
    }
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());

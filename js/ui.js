"use strict";

/* ==========================================================
   UI.JS
   Handles UI Rendering
========================================================== */

const UI = {
  renderNotes(notes, state) {
    if (notes.length === 0) {
      DOM.notesContainer.innerHTML = "";
      this.renderEmptyState(state, false);
      return;
    }

    this.renderEmptyState(state, true);
    DOM.notesContainer.innerHTML = notes.map((note) => this.createNoteCard(note)).join("");
  },

  createNoteCard(note) {
    const tagsHTML = note.tags
      .map((tag) => `<span class="tag">#${this.escapeHTML(tag)}</span>`)
      .join("");

    const classNames = ["note-card"];
    if (note.pinned) classNames.push("pinned");
    if (note.favorite) classNames.push("favorite");
    if (note.archived) classNames.push("archived");

    return `
      <article
        class="${classNames.join(" ")}"
        style="border-left: 5px solid ${note.color || "#ffffff"};"
        data-id="${note.id}"
      >
        <div class="note-header">
          <div class="note-status">
            ${this.createBadges(note)}
          </div>
          <h3 class="note-title">${this.escapeHTML(note.title)}</h3>
        </div>

        <p class="note-description">${this.escapeHTML(note.description).replace(/\n/g, "<br>")}</p>

        <div class="note-meta">
          <span class="category">📂 ${this.escapeHTML(note.category || "General")}</span>
          <div class="tags">${tagsHTML}</div>
        </div>

        <div class="note-footer">
          <small>${this.formatDate(note.updatedAt)}</small>
          <div class="note-actions">
            ${this.createActionButtons(note)}
          </div>
        </div>
      </article>
    `;
  },

  createBadges(note) {
    let badges = "";

    if (note.pinned) {
      badges += `<span class="badge pinned">📌 Pinned</span>`;
    }

    if (note.favorite) {
      badges += `<span class="badge favorite">⭐ Favorite</span>`;
    }

    if (note.archived) {
      badges += `<span class="badge archived">📦 Archived</span>`;
    }

    return badges;
  },

  createActionButtons(note) {
    return `
      <button class="action-btn ${note.pinned ? "active" : ""}" data-action="pin" data-id="${note.id}" title="Pin">
        <i class="fa-solid fa-thumbtack"></i>
      </button>

      <button class="action-btn ${note.favorite ? "active" : ""}" data-action="favorite" data-id="${note.id}" title="Favorite">
        <i class="fa-solid fa-star"></i>
      </button>

      <button class="action-btn ${note.archived ? "active" : ""}" data-action="archive" data-id="${note.id}" title="Archive">
        <i class="fa-solid fa-box-archive"></i>
      </button>

      <button class="action-btn" data-action="edit" data-id="${note.id}" title="Edit">
        <i class="fa-solid fa-pen"></i>
      </button>

      <button class="action-btn delete-btn" data-action="delete" data-id="${note.id}" title="Delete">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
  },

  updateStatistics(notes) {
    DOM.totalNotes.textContent = notes.length;
    DOM.pinnedNotes.textContent = notes.filter((note) => note.pinned).length;
    DOM.favoriteNotes.textContent = notes.filter((note) => note.favorite).length;
    DOM.archivedNotes.textContent = notes.filter((note) => note.archived).length;
  },

  updateCounters(title, description) {
    const titleText = title ?? DOM.noteTitle.value.trim();
    const descriptionText = description ?? DOM.noteDescription.value.trim();
    const combined = `${titleText} ${descriptionText}`.trim();

    const chars = combined.length;
    const words = combined ? combined.split(/\s+/).length : 0;

    DOM.characterCount.textContent = `${chars} chars`;
    DOM.wordCount.textContent = `${words} words`;
  },

  renderEmptyState(state, hasNotes) {
    if (hasNotes) {
      DOM.emptyState.style.display = "none";
      return;
    }

    let title = "No Notes Found";
    let message = "Create your first note to get started.";

    if (state.currentSearch) {
      title = "No Matching Notes";
      message = "Try another search term or clear the filter.";
    } else if (state.currentFilter !== "all" || state.currentCategory !== "all") {
      title = "No Notes in This View";
      message = "Try changing the filter or category.";
    }

    DOM.emptyStateTitle.textContent = title;
    DOM.emptyStateMessage.textContent = message;
    DOM.emptyState.style.display = "flex";
  },

  showToast(message, type = "success") {
    if (!DOM.toast) return;

    DOM.toast.textContent = message;
    DOM.toast.className = `toast ${type} show`;

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      DOM.toast.classList.remove("show");
    }, 3000);
  },

  setThemeButtonIcon(theme) {
    const themeButtonIcon = DOM.themeButton.querySelector("i");
    if (!themeButtonIcon) return;

    themeButtonIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    DOM.themeButton.title = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  },

  setActiveFilter(filter) {
    DOM.filterItems.forEach((item) => {
      item.classList.toggle("active", item.dataset.filter === filter);
    });
  },

  setActiveCategory(category) {
    DOM.categoryFilters.forEach((item) => {
      item.classList.toggle("active", item.dataset.category === category);
    });
  },

  formatDate(dateValue) {
    if (!dateValue) return "No date";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  },

  escapeHTML(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  },
};

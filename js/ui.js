"use strict";

/* ==========================================================
   UI.JS
   Handles UI Rendering
========================================================== */

const UI = {
  /* ======================================================
       RENDER NOTES
    ====================================================== */

  renderNotes(notes) {
    if (notes.length === 0) {
      DOM.notesContainer.innerHTML = "";

      DOM.emptyState.style.display = "flex";

      return;
    }

    DOM.emptyState.style.display = "none";

    DOM.notesContainer.innerHTML = notes

      .map((note) => this.createNoteCard(note))

      .join("");
  },

  /* ======================================================
       CREATE NOTE CARD
    ====================================================== */

  createNoteCard(note) {
    const tagsHTML = note.tags
      .map(
        (tag) => `
            <span class="tag">
                #${this.escapeHTML(tag)}
            </span>
        `,
      )
      .join("");

    return `

    <article
        class="note-card"
        style="border-left:5px solid ${note.color};"
        data-id="${note.id}">

        <div class="note-header">

            <div class="note-status">

                ${this.createBadges(note)}

            </div>

            <h3 class="note-title">

                ${this.escapeHTML(note.title)}

            </h3>

        </div>

        <p class="note-description">

            ${this.escapeHTML(note.description)}

        </p>

        <div class="note-meta">

            <span class="category">

                📂 ${this.escapeHTML(note.category)}

            </span>

            <div class="tags">

                ${this.createTags(note.tags)}

            </div>

        </div>

        <div class="note-footer">

            <small>

                ${this.formatDate(note.updatedAt)}

            </small>

            <div class="note-actions">

                ${this.createActionButtons(note)}

            </div>

        </div>

    </article>

    `;
  },

  /* ======================================================
   CREATE TAGS
====================================================== */

  createTags(tags) {
    if (tags.length === 0) {
      return "";
    }

    return tags

      .map(
        (tag) => `

            <span class="tag">

                #${this.escapeHTML(tag)}

            </span>

        `,
      )

      .join("");
  },

  /* ======================================================
   CREATE BADGES
====================================================== */

  createBadges(note) {
    let badges = "";

    if (note.pinned) {
      badges += `

            <span class="badge pinned">

                📌 Pinned

            </span>

        `;
    }

    if (note.favorite) {
      badges += `

            <span class="badge favorite">

                ⭐ Favorite

            </span>

        `;
    }

    if (note.archived) {
      badges += `

            <span class="badge archived">

                📦 Archived

            </span>

        `;
    }

    return badges;
  },

  /* ======================================================
   ACTION BUTTONS
====================================================== */

  createActionButtons(note) {
    return `

    <button
        class="action-btn edit-btn"
        data-action="edit"
        data-id="${note.id}"
        title="Edit">

        <i class="fa-solid fa-pen"></i>

    </button>

    <button
        class="action-btn pin-btn"
        data-action="pin"
        data-id="${note.id}"
        title="Pin">

        <i class="fa-solid fa-thumbtack"></i>

    </button>

    <button
        class="action-btn favorite-btn"
        data-action="favorite"
        data-id="${note.id}"
        title="Favorite">

        <i class="fa-solid fa-star"></i>

    </button>

    <button
        class="action-btn archive-btn"
        data-action="archive"
        data-id="${note.id}"
        title="Archive">

        <i class="fa-solid fa-box-archive"></i>

    </button>

    <button
        class="action-btn delete-btn"
        data-action="delete"
        data-id="${note.id}"
        title="Delete">

        <i class="fa-solid fa-trash"></i>

    </button>

    `;
  },
  /* ======================================================
       UPDATE STATISTICS
    ====================================================== */

  updateStatistics(notes) {
    DOM.totalNotes.textContent = notes.length;

    DOM.pinnedNotes.textContent = notes.filter((note) => note.pinned).length;

    DOM.favoriteNotes.textContent = notes.filter(
      (note) => note.favorite,
    ).length;

    DOM.archivedNotes.textContent = notes.filter(
      (note) => note.archived,
    ).length;
  },

  /* ======================================================
       SHOW TOAST
    ====================================================== */

  showToast(message, type = "success") {
    if (!DOM.toast) {
      return;
    }

    DOM.toast.textContent = message;

    DOM.toast.className = `toast ${type}`;

    DOM.toast.classList.add("show");

    clearTimeout(this.toastTimer);

    this.toastTimer = setTimeout(() => {
      DOM.toast.classList.remove("show");
    }, 3000);
  },

  /* ======================================================
       FORMAT DATE
    ====================================================== */

  formatDate(date) {
    return new Date(date).toLocaleString(
      undefined,

      {
        dateStyle: "medium",

        timeStyle: "short",
      },
    );
  },

  /* ======================================================
       ESCAPE HTML
    ====================================================== */

  escapeHTML(text) {
    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
  },
};

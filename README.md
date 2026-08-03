# 📝 Notes App

A modern, fully responsive, and feature-rich **Notes Management Application** built using **HTML, CSS, and Vanilla JavaScript**.

This project follows a modular architecture with separate files for **Application Logic**, **UI Rendering**, and **Local Storage Management**, making the code easy to understand, maintain, and extend.

---

# 🚀 Features

## ✨ Notes Management

- Create Notes
- Edit Notes
- Update Existing Notes
- Delete Notes (Confirmation Modal)
- Pin Notes
- Favorite Notes
- Archive Notes

---

## 🔍 Search & Sorting

- Live Search
- Search by:
  - Title
  - Description
  - Category
  - Tags

- Sort Notes
  - Newest First
  - Oldest First
  - Alphabetically

---

## 📂 Categories

- Work
- Study
- Personal
- Shopping

---

## 🏷 Tags

- Multiple tags per note
- Comma separated input
- Automatic tag rendering

Example:

```
javascript, html, css
```

renders as

```
#javascript
#html
#css
```

---

## 🎨 Custom Colors

Each note can have its own color.

The selected color appears as a colored border on the note card.

---

## 🌙 Theme

- Light Mode
- Dark Mode

Theme preference is automatically saved using Local Storage.

---

## 📦 Import / Export

Export all notes into a JSON file.

Import notes from previously exported JSON files.

---

## 📊 Statistics

Displays:

- Total Notes
- Pinned Notes
- Favorite Notes
- Archived Notes

---

## 📏 Live Counters

Editor automatically updates:

- Character Count
- Word Count

while typing.

---

# 📁 Project Structure

```
Notes-App/

│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── storage.js
│   ├── app.js
│   └── ui.js
│
├── assets/
│
└── README.md
```

---

# 🏗 Architecture

The project follows a modular architecture.

```
                User

                  │

                  ▼

             HTML Interface

                  │

                  ▼

              app.js
        (Application Logic)

                  │

      ┌───────────┴───────────┐

      ▼                       ▼

 storage.js                ui.js

(Local Storage)       (Rendering Layer)

      │                       │

      └───────────┬───────────┘

                  ▼

             Browser UI
```

---

# 📚 File Responsibilities

## index.html

Responsible for:

- Layout
- Forms
- Sidebar
- Header
- Notes Container
- Modal
- Toast

Contains **no business logic**.

---

## style.css

Responsible for:

- Responsive Design
- Layout
- Colors
- Animations
- Theme
- Cards
- Buttons
- Modal
- Toast
- UI Components

---

## storage.js

Responsible only for Local Storage.

Functions include:

```
loadNotes()

saveNotes()

loadTheme()

saveTheme()

exportNotes()

importNotes()
```

No UI code exists here.

---

## app.js

Responsible for all application logic.

Includes:

- Initialization
- Event Registration
- CRUD Operations
- Search
- Sorting
- Theme
- Import
- Export
- Pin
- Favorite
- Archive
- Delete
- Counters

This file acts as the application's controller.

---

## ui.js

Responsible only for UI rendering.

Includes:

- Render Notes
- Create Note Cards
- Render Tags
- Render Badges
- Render Buttons
- Statistics
- Toast Notifications
- Date Formatting

No Local Storage logic exists here.

---

# 🔄 Application Workflow

```
User Action

      │

      ▼

Event Listener

      │

      ▼

App Method

      │

      ▼

Update Application State

      │

      ▼

Save Local Storage

      │

      ▼

Get Visible Notes

      │

      ▼

Render UI

      │

      ▼

Updated Screen
```

---

# 🧠 Application State

The application stores all runtime data inside the App object.

Example:

```javascript
state: {

    notes: [],

    editingNoteId: null,

    noteToDeleteId: null,

    currentFilter: "all",

    currentCategory: "all",

    currentSearch: "",

    currentSort: "newest",

    currentTheme: "light"

}
```

---

# 💾 Local Storage

The application automatically stores:

- Notes
- Theme

Users never lose data after refreshing the page.

---

# 🗂 Note Object Structure

Each note follows this structure.

```javascript
{

    id,

    title,

    description,

    category,

    tags,

    color,

    pinned,

    favorite,

    archived,

    createdAt,

    updatedAt

}
```

---

# 🔍 Search Flow

```
User Types

      │

      ▼

Search Event

      │

      ▼

Update Search State

      │

      ▼

Get Visible Notes

      │

      ▼

Render Notes
```

---

# 📌 Pin Workflow

```
User Clicks Pin

      │

      ▼

togglePin()

      │

      ▼

Update Note

      │

      ▼

Save Notes

      │

      ▼

Render UI
```

---

# ⭐ Favorite Workflow

```
Click Favorite

      │

      ▼

toggleFavorite()

      │

      ▼

Refresh Application

      │

      ▼

Render Notes
```

---

# 📦 Archive Workflow

```
Click Archive

      │

      ▼

toggleArchive()

      │

      ▼

Refresh Application
```

---

# 🗑 Delete Workflow

```
Delete Button

      │

      ▼

Open Modal

      │

      ▼

Confirm Delete

      │

      ▼

Remove Note

      │

      ▼

Save Local Storage

      │

      ▼

Render Notes
```

---

# 🌙 Theme Workflow

```
Click Theme

      │

      ▼

Toggle Theme

      │

      ▼

Save Theme

      │

      ▼

Apply Theme
```

---

# 🎯 Design Principles

This project follows:

- Separation of Concerns
- Modular Design
- Reusable Components
- Simple Business Logic
- Readable Code
- Easy Maintenance
- Clean Architecture

---

# 🛠 Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Local Storage API
- Font Awesome

---

# 📱 Responsive Design

The application works on:

- Desktop
- Laptop
- Tablet
- Mobile

---

# 🚀 Future Improvements

Potential future enhancements:

- Markdown Support
- Rich Text Editor
- Drag & Drop Notes
- Cloud Synchronization
- User Authentication
- Categories Management
- Trash Bin
- Labels
- Reminders
- Due Dates
- Voice Notes
- Image Attachments
- PWA Support
- Offline Sync

---

# 🎓 Learning Outcomes

This project demonstrates understanding of:

- DOM Manipulation
- Event Handling
- Event Delegation
- Local Storage
- CRUD Operations
- Modular JavaScript
- State Management
- Dynamic Rendering
- Responsive Design
- UI/UX Principles
- Clean Code Practices

---

# 📜 License

This project is created for learning and portfolio purposes.

You are free to modify and extend it for personal or educational use.

---

# 👨‍💻 Author

Developed with M AMMAR TAHIR using **HTML, CSS, and Vanilla JavaScript**.
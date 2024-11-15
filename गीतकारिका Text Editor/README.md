# Dynamic Drag and Drop with Autosave

This is a web-based application that allows users to dynamically create editable divs and custom containers, all with drag-and-drop functionality. The application also includes an autosave feature that saves the state of the elements to **localStorage**, ensuring that users' changes persist even after refreshing or reopening the page.

Live URL: 
Option 1: From htmlpreview.github.io 

Option 1: From rawcdn.githack.com 

## Features

- **Dynamic Creation**: Users can create new editable divs and custom containers.
- **Drag-and-Drop**: Editable divs can be moved around within custom containers using drag-and-drop.
- **Resizable Divs**: The editable divs and custom containers are resizable.
- **Content Editable**: Each editable div allows users to edit its text content.
- **Delete Divs**: Users can delete individual editable divs with a delete button.
- **Autosave**: The state of all elements (text, size, positions) is automatically saved to **localStorage**. The layout persists between page reloads.
- **Delete All Divs**: A button to delete all editable divs at once, with a confirmation prompt.

## Requirements

- A modern web browser that supports HTML5, CSS3, and JavaScript.
- No external dependencies are required.

## How to Use

### 1. **Create a Custom Container**
- Click the **Create Custom Container** button on the sidebar to add a new custom container to the main area. The container can hold multiple editable divs and can be resized.

### 2. **Add Editable Divs**
- Click the **Add Editable Div** button to add a new editable div inside the first custom container. The div is initially populated with default text ("Edit me!").
- The div is **content-editable**, so users can directly edit the text within the div.

### 3. **Drag-and-Drop**
- You can drag the editable divs within the container. The divs can be moved around, and the layout will be saved.

### 4. **Resize Divs**
- Both the custom containers and editable divs are resizable. Simply drag the bottom-right corner to adjust the size.

### 5. **Delete Editable Divs**
- Each editable div has a delete button (red icon in the top-right corner). Clicking the button will remove the div from the container.

### 6. **Delete All Divs**
- The **Delete All** button on the sidebar allows you to delete all editable divs and custom containers. A confirmation prompt will appear before deletion.

### 7. **Autosave**
- All changes, such as text edits, resizing, and movements, are automatically saved in the browser's **localStorage**. When you reload the page, the layout and content of the containers and divs will be restored.

### 8. **Toggle Sidebar**
- The sidebar can be collapsed or expanded by clicking the toggle button. The sidebar will shrink to a minimal width, showing just icons, when collapsed.

## Installation

To use this application, simply download or copy the HTML file and open it in any modern web browser. There are no server-side components required.

## Code Explanation

### HTML Structure
- **Sidebar**: Contains buttons to create editable divs, custom containers, and delete all elements.
- **Main Content Area**: Displays the custom containers, which can hold the editable divs.

### CSS Styling
- Styles are included for creating a flexible layout, responsive design, and making the divs resizable and draggable.
- The sidebar and main content area are styled to provide an intuitive user experience.

### JavaScript
- **Drag-and-Drop**: The application supports drag-and-drop functionality using native HTML5 Drag and Drop API.
- **Autosave**: The state of the containers and editable divs is saved in the browser’s **localStorage**.
- **Event Listeners**: Listeners are added for drag events, content edit events, and button clicks to ensure a smooth user experience.

### Functions
- **`saveState()`**: Saves the current layout, content, and size of the containers and editable divs to localStorage.
- **`loadState()`**: Loads the saved layout from localStorage on page load and restores it.
- **`createEditableDiv()`**: Creates a new editable div that can be dragged, edited, and resized.
- **`initializeEditableDiv()`**: Initializes the drag-and-drop functionality for an editable div and adds event listeners for saving changes.
- **`initializeCustomContainer()`**: Initializes drag-and-drop for custom containers, allowing divs to be moved between containers.

## License

This project is open-source and can be used, modified, and distributed freely for personal and educational purposes.

## Issues and Contributions

If you encounter any issues or have suggestions for new features, please feel free to open an issue or submit a pull request.

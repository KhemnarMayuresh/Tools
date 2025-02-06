# Dynamic Drag and Drop with Autosave

This is a web-based application that allows users to dynamically create editable divs and custom containers, all with drag-and-drop functionality. The application also includes an autosave feature that saves the state of the elements to **localStorage**, ensuring that users' changes persist even after refreshing or reopening the page.

## Live URL:

### Version 2:

##### Option 1: From [htmlpreview.github.io](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html)

##### Option 2: From [rawcdn.githack.com](https://rawcdn.githack.com/KhemnarMayuresh/Tools/d63d03564fb59a87508e3c5a153a23b9316b66d7/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html)

### Version 1:

##### Option 1: From [htmlpreview.github.io](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/64e57f6094d13a0059acef2f4b16012931fdf5e9/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html)

##### Option 2: From [rawcdn.githack.com](https://rawcdn.githack.com/KhemnarMayuresh/Tools/64e57f6094d13a0059acef2f4b16012931fdf5e9/%E0%A4%97%E0%A5%80%E0%A4%A4%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%BE%20Text%20Editor%20.html)

## Features

- **Dynamic Section Creation**: Users can create new editable sections with customizable titles.
- **Drag-and-Drop**: Editable divs can be moved around within sections using drag-and-drop.
- **Resizable Sections & Divs**: Sections and editable divs are resizable.
- **Content Editable**: Each editable div allows users to edit its text content.
- **Delete Sections & Divs**: Users can delete individual sections and divs with a delete button.
- **Autosave**: The state of all elements (text, size, positions) is automatically saved to **localStorage**. The layout persists between page reloads.
- **Delete All Sections & Divs**: A button to delete all sections and editable divs at once, with a confirmation prompt.
- **Collapsible Sidebar**: The sidebar can be collapsed or expanded for better screen space utilization.

## Requirements

- A modern web browser that supports HTML5, CSS3, and JavaScript.
- No external dependencies are required.

## How to Use

### 1. **Create a Section**

- Click the **Add Section** button on the sidebar to create a new section.
- Sections are resizable and can contain multiple editable divs.

### 2. **Add Editable Divs**

- Click the **Add Editable Div** button to add a new editable div inside the last created section.
- The div is **content-editable**, allowing direct text edits.

### 3. **Drag-and-Drop**

- Editable divs can be dragged and rearranged within their section.
- Divs can also be moved between different sections.

### 4. **Resize Sections & Divs**

- Drag the edges of a section or div to resize them as needed.

### 5. **Delete Sections & Divs**

- Click the delete button in a section to remove the entire section and its contents.
- Click the delete button on an editable div to remove only that div.

### 6. **Delete All Sections & Divs**

- The **Delete All** button on the sidebar clears all sections and editable divs with a confirmation prompt.

### 7. **Autosave**

- Changes are automatically saved in **localStorage**, ensuring persistence between sessions.

### 8. **Toggle Sidebar**

- Click the **≡** button to collapse or expand the sidebar.

## Installation

To use this application, simply download or copy the HTML file and open it in any modern web browser. There are no server-side components required.

## Code Explanation

### HTML Structure

- **Sidebar**: Contains buttons to create sections, add editable divs, and delete all elements.
- **Main Content Area**: Displays sections that hold editable divs.

### CSS Styling

- Provides a responsive layout with a collapsible sidebar.
- Sections and divs are styled for resizability and smooth drag-and-drop.

### JavaScript

- **Drag-and-Drop**: Supports rearranging elements using native HTML5 Drag and Drop API.
- **Autosave**: Uses **localStorage** to maintain layout and content between sessions.
- **Event Listeners**: Handles user interactions like drag events, content edits, and button clicks.

### Functions

- **`saveSections()`**: Saves the current layout, content, and size of sections and divs to localStorage.
- **`loadSections()`**: Loads saved layout from localStorage on page load.
- **`createSection()`**: Creates a new resizable section.
- **`createEditableDiv()`**: Creates a new editable div within a section.
- **`deleteSection()`**: Deletes a specific section and its contents.
- **`deleteDiv()`**: Deletes a specific editable div.

## License

This project is open-source and can be used, modified, and distributed freely for personal and educational purposes.

## Issues and Contributions

If you encounter any issues or have suggestions for new features, please feel free to open an issue or submit a pull request.


# Passing the Parcel Game

This is a simple web-based version of the "Passing the Parcel" game, where players pass a virtual parcel around while music plays. The music will stop randomly within a specified time range. The game includes an audio file upload, configurable time settings, and buttons to start, stop, and reset the game.

## Live URL: 
#### Option 1: From [htmlpreview.github.io](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Passing%20the%20Parcel%20Game/PassingTheParcel.html)

#### Option 1: From [rawcdn.githack.com](https://rawcdn.githack.com/KhemnarMayuresh/Tools/d63d03564fb59a87508e3c5a153a23b9316b66d7/Passing%20the%20Parcel%20Game/PassingTheParcel.html)


## Features

- **Audio Upload**: Users can upload an audio file that will be used in the game.
- **Time Range**: The game allows users to specify a **minimum** and **maximum** time in seconds, within which the music will stop.
- **Start, Stop, and Reset**:
  - **Start**: The music starts playing, and it stops randomly within the specified time range.
  - **Stop**: The music stops immediately, and the timer is cleared.
  - **Reset**: Resets the game to its initial state, clearing the audio file and time inputs.

## Requirements

- A modern web browser with support for HTML5, CSS3, and JavaScript.
- Audio file (e.g., MP3, WAV) for the game to play.

## How to Use

1. **Upload an Audio File**:
   - Click on the "Choose File" button to select an audio file from your device. The audio file will be used as the background music for the game.
   
2. **Set the Time Range**:
   - Specify the **minimum time** (in seconds) and **maximum time** (in seconds) for how long the music will play before stopping randomly.
   
3. **Start the Game**:
   - Click on the **Start** button to begin playing the audio. The audio will stop at a random time between the minimum and maximum values you specified.

4. **Stop the Game**:
   - If you wish to stop the audio manually before the random time elapses, click on the **Stop** button.

5. **Reset the Game**:
   - To reset the game, click on the **Reset** button. This will stop the audio, reset the time inputs to their default values, and allow you to upload a new audio file if desired.

## Installation

To use this game, simply download or copy the code and open the HTML file in a web browser. There are no additional setup steps required.

## Code Explanation

- **HTML Structure**:
  - A basic HTML structure with an audio player (`<audio>`), file input for uploading audio, number inputs for setting the time range, and buttons for starting, stopping, and resetting the game.
  
- **CSS**:
  - Basic styles to center the game interface, style the buttons, inputs, and create a visually pleasing layout with shadows and padding.

- **JavaScript**:
  - Handles the logic for starting, stopping, and resetting the game. It uses `setTimeout` to stop the audio after a random time between the min and max time. It also handles input validation to ensure the time range is valid and the audio file is selected.

## License

This project is open-source and available for personal and educational use. Feel free to modify and distribute as needed.

## Issues & Contributions

If you encounter any issues or have suggestions for improvements, feel free to open an issue or contribute to the project. 

---

Enjoy playing!
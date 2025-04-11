# Fabric.js Image Cropper with React

This is a simple image cropping tool built with **React** and **Fabric.js**. It allows users to upload an image, select a region with a resizable rectangle, and export the cropped region as a PNG file.

## ✨ Features

- Upload any image from your device
- Visual cropping using Fabric.js canvas
- Adjustable crop area with draggable rectangle
- Export and download cropped image as `.png`

## 📦 Tech Stack

- [React](https://reactjs.org/)
- [Fabric.js](http://fabricjs.com/) (Canvas manipulation)
- HTML5 `<canvas>` for exporting cropped image

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/AslanovRustam/fabric-collab-app.git
cd fabric-collab-app
npm install
```

### Run the app

```bash
npm start
```

The app will open in your default browser at http://localhost:3000

## 🔧 Project Structure

```bash
src/
├── components/
│   └── CropperCanvas.jsx  # Main component using Fabric.js
├── App.js                 # Entry point rendering CropperCanvas
├── index.js               # React DOM bootstrap
```

## 🧠 How It Works

The CropperCanvas component renders a Fabric.js canvas.

On image upload, it sets the image as a background image on the canvas.

A fabric.Rect is used as a cropping area, which the user can move/resize.
When clicking Export, the app creates an invisible HTML <canvas>, draws the selected crop region, and triggers a download using toDataURL.

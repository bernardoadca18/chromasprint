# ChromaSprint 

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**ChromaSprint** is a comprehensive, web-based Color Palette and Sprite Manipulation Tool engineered for Game Developers, Pixel Artists, and UI Designers. Built with Next.js and HTML5 Canvas, it allows users to deeply analyze, dynamically recolor, and organize sprite palettes directly in the browser.

## Core Features

* **🔍 Pixel-Perfect Sprite Analyzer:** Upload any pixel art or sprite (PNG). The engine reads the image pixel-by-pixel via HTML5 `<canvas>` and automatically extracts every unique color into a manageable palette dashboard.
* **🔄 Advanced Palette Swapping:** Select any extracted color, remap it to a new target color, and apply a global palette swap to the sprite with a single click. Export your modified sprite instantly.
* **🎛️ Drag-and-Drop Palette Management:** Organize your extracted colors intuitively. Manually rearrange your palette hierarchy using smooth Drag-and-Drop (powered by `@dnd-kit`).
* **🌈 Pro-Grade Hue Shifter:** A standalone, highly accurate mathematical color converter supporting bi-directional conversion between **Hex, RGB, HSL, and HSV** color models.
* **🌓 Adaptive Theming (Light/Dark Mode):** A sleek, premium user interface that seamlessly transitions between a deep Obsidian Dark Mode and a crisp, modern Light Mode.
* **🌐 Bilingual Interface:** Fully internationalized architecture supporting both English (EN) and Portuguese (PT-BR) out of the box.

## Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Image Processing:** Native HTML5 Canvas API
* **Drag & Drop:** `@dnd-kit/core` & `@dnd-kit/sortable`
* **Theme Management:** `next-themes`
* **Icons:** `lucide-react`

## Getting Started

Follow these instructions to set up ChromaSprint on your local machine.

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

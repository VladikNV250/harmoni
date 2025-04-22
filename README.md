<p align="center">
  <img src="./src/shared/assets/harmoni_logo.png" alt="Harmoni Logo" height="80"/>
</p>

<h1 align="center">Harmoni – A Spotify-inspired music streaming application.</h1> 

Harmoni is a frontend application emulating core Spotify functionalities. Built with React, TypeScript, and Vite, it offers features like track playback, playlist management, and responsive design for both desktop and mobile platforms.<br />

![Image](https://github.com/user-attachments/assets/bd715fb2-d7c9-4f86-ac87-1d21ba748c1d)
<p align="center">
  <a href="https://harmoni-nu-six.vercel.app/">
    <img src="https://img.shields.io/badge/View-%20Demo-green" alt="View Demo" />
  </a>
</p>

## Features

- Full-featured audio player with real-time playback sync

- Responsive design (mobile/desktop player UIs)

- User queue, library of saved media, and available devices

- Feature-Sliced Design architecture

- Flexible library management with albums, artists, playlists and others.

- Playlist editing, deletion, sorting (by title, date, etc.)

## Tech Stack

- React + TypeScript

- Redux Toolkit for state management

- React Router for routing

- Spotify Web API and Web Playback SDK

- Vite for blazing fast dev builds

- SCSS for flexible UI styling

- Feature-Sliced Design (FSD)

- Custom hooks, adapters, selectors for clean logic separation

## Installation
For installation app, you need to run the commands below.
```bash
git clone https://github.com/VladikNV250/harmoni.git
cd harmoni
npm install
npm run dev
```
Once you run the commands, you need to create your app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and get a ClientID.
Then you need to go to `src/shared/consts/auth.ts` and change the CLIEND_ID constant to your ClientID.

## Contact
Vlad Nemichev - [Telegram](https://nemichev_v.t.me/) - [Instagram](https://www.instagram.com/nemichev.v/?next=%2F) - vladiknemichev@gmail.com

Project Link: [https://github.com/VladikNV250/harmoni](https://github.com/VladikNV250/harmoni)

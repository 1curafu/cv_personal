# ✨ Interactive CV Website ✨

[![Netlify Status](https://api.netlify.com/api/v1/badges/8fe0561e-811d-436a-812c-424a1b21f8f4/deploy-status)](https://app.netlify.com/projects/cv-mykhailo-khimich/deploys)

A responsive, modern CV website with dark/light mode transition and multi-language support.

<div align="center">

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

</div>

## 🌟 Live Website

[View Website ](https://cv-mykhailo-khimich.netlify.app)

## ✨ Features

- 📱 **Responsive Design** - Looks great on all devices
- 🌓 **Dark/Light Mode** - Toggle between dark and light themes with animated backgrounds
- 🌍 **Multi-language Support** - Available in English, German, Russian, and Ukrainian
- 📊 **Interactive Skills Visualization** - Unique rotating radar chart for skills
- 💫 **Smooth Animations** - Scroll animations and interactive elements
- 🔥 **Firebase Backend** - Translations stored in Firestore database

## 🛠️ Technology Stack

- 🖥️ **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- 🎨 **Styling:** Bootstrap 5
- ⚙️ **Backend:** Node.js, Express.js
- 🗄️ **Database:** Firebase Firestore
- 🚀 **Deployment:** Netlify

## 📁 Project Structure

```text
my-cv-website/
├── 🖼️  assets/             Icons, images, and video backgrounds
│   ├── 🎬  light.mp4        Light-mode background video
│   ├── 🌑  dark.mp4         Dark-mode background video
│   ├── 👤  avatar.png       Profile picture
│   └── 🔣  icons/           SVG icons for UI elements
├── 🎨  css/
│   └── style.css           Main stylesheet
├── 📜  js/
│   └── main.js             Main JavaScript (translations & animations)
├── 🖧  server/
│   └── server.js           Express server + Firebase integration
├── 📄  index.html           Main HTML structure
└── 🔒  .env                 Environment variables (not in repo)
```

## 🚀 Getting Started

### Prerequisites

- 📦 Node.js (v14 or higher)
- 🔥 Firebase account with Firestore database
- 🔐 Environment variables configured

### Installation

<div align="center">
  
```bash
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/cv-website.git
cd cv-website

# 2️⃣ Install dependencies
npm install
cd server && npm install

# 3️⃣ Set up environment variables
# In the server directory
cp .env.example .env
# Edit .env with your Firebase credentials

# 4️⃣ Start the development server
npm start

# 5️⃣ Open http://localhost:3000 in your browser
```

🔧 Environment Configuration
Create a .env file in the server directory with the following structure:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
``` 

</div>

## 📚 What I Learned

<div align="center">
<table>
<tr>
<td align="center">🌓</td>
<td>Implementing dark/light mode with smooth transitions</td>
</tr>
<tr>
<td align="center">📱</td>
<td>Creating responsive layouts with Bootstrap and custom CSS</td>
</tr>
<tr>
<td align="center">🌍</td>
<td>Managing translations and internationalization</td>
</tr>
<tr>
<td align="center">📊</td>
<td>Building interactive SVG visualizations</td>
</tr>
<tr>
<td align="center">⚙️</td>
<td>Setting up a Node.js/Express backend with Firebase</td>
</tr>
<tr>
<td align="center">👁️</td>
<td>Using the Intersection Observer API for scroll animations</td>
</tr>
<tr>
<td align="center">🎬</td>
<td>Implementing video backgrounds with fallbacks</td>
</tr>
<tr>
<td align="center">💾</td>
<td>Managing state with localStorage and sessionStorage</td>
</tr>
</table>
</div>

## 🔮 Future Improvements

<div align="center">

🌐 Add more languages  
📨 Implement contact form functionality - Done
📥 Add PDF download option for CV  
♿ Improve accessibility features  
🖼️ Add more project showcase features

</div>

## 📬 Contact Me

<div align="center">
  
[![Email](https://img.shields.io/badge/Email-icurafu333%40icloud.com-blue?style=for-the-badge&logo=mail.ru&logoColor=white)](mailto:icurafu333@icloud.com)
[![GitHub](https://img.shields.io/badge/GitHub-1curafu-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/1curafu)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mykhailo_Khimich-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mykhailo-khimich-a73a13265/)

</div>

## 📄 License

<div align="center">
  
This project is licensed under the GNU License - see the LICENSE file for details.

</div>


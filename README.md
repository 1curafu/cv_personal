# ✨ Interactive CV Website ✨

A responsive, modern CV / portfolio site built with Next.js, featuring dark/light mode, multi-language support, a live weather widget, and a working contact form.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

## 🌟 Live Website

[View Website ](https://cv-mykhailo-khimich.netlify.app)

## ✨ Features

- 📱 **Responsive Design** - Looks great on all devices
- 🌓 **Dark/Light Mode** - Theme toggle powered by `next-themes`
- 🌍 **Multi-language Support** - English, German, Russian, and Ukrainian, persisted in `localStorage`
- 🌦️ **Live Weather Widget** - Real-time weather with city autocomplete search
- 📨 **Working Contact Form** - Email delivery via the [Resend](https://resend.com) API through a serverless route, with copy-to-clipboard email
- 💫 **Smooth Animations** - Scroll reveal, scroll progress bar, custom cursor, and marquee effects
- 🧩 **Component-driven** - Hero, About, Work, Timeline, Skills, and Contact sections
- ✅ **Tested & Typed** - Jest + Testing Library, fully TypeScript

## 🛠️ Technology Stack

- 🖥️ **Framework:** Next.js 16 (App Router), React 19
- 🔤 **Language:** TypeScript
- 🎨 **Styling:** Tailwind CSS 4, CSS custom properties
- 🌓 **Theming:** next-themes
- 📧 **Email:** Resend (serverless API route)
- 🧪 **Testing:** Jest, React Testing Library
- 🚀 **Deployment:** Vercel

## 📁 Project Structure

```text
cv-website-next/
├── 📂  app/                  Next.js App Router
│   ├── 🌐  api/contact/      Serverless contact form route (Resend)
│   ├── 🧱  layout.tsx        Root layout + providers
│   ├── 📄  page.tsx          Home page assembling all sections
│   └── 🎨  globals.css       Global styles & CSS variables
├── 🧩  components/           Hero, About, Work, Timeline, Skills,
│                             Contact, LiveWeather, Nav, Footer, …
├── 🔁  context/              LangContext (i18n provider)
├── 🪝  hooks/                useLang, useReveal
├── 📚  lib/                  translations.ts, skills.ts
├── 🖼️   public/               Static assets (images, favicon)
├── 🧪  __tests__/            Jest test suites
└── ⚙️   vercel.json           Deployment config
```

## 🚀 Getting Started

### Prerequisites

- 📦 Node.js (v18 or higher)
- 🔐 A [Resend](https://resend.com) API key (for the contact form)

### Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/1curafu/cv-website.git
cd cv-website/cv-website-next

# 2️⃣ Install dependencies
npm install

# 3️⃣ Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Resend credentials

# 4️⃣ Start the development server
npm run dev

# 5️⃣ Open http://localhost:3000 in your browser
```

### 🔧 Environment Configuration

Create a `.env.local` file in the `cv-website-next` directory:

```env
RESEND_API_KEY=your_resend_api_key
MAIL_TO=your_destination_inbox@example.com
MAIL_FROM=onboarding@resend.dev   # or an address on your verified domain
```

### 📜 Scripts

```bash
npm run dev     # Start the development server
npm run build   # Production build
npm run start   # Run the production build
npm run lint    # Lint with ESLint
npm test        # Run the test suite
```

## 📚 What I Learned

<div align="center">
<table>
<tr>
<td align="center">⚛️</td>
<td>Migrating a vanilla HTML/Bootstrap site to Next.js App Router & React 19</td>
</tr>
<tr>
<td align="center">🔤</td>
<td>Building a fully typed codebase with TypeScript</td>
</tr>
<tr>
<td align="center">🌓</td>
<td>Implementing dark/light theming with next-themes and CSS variables</td>
</tr>
<tr>
<td align="center">🌍</td>
<td>Managing internationalization with React context and localStorage</td>
</tr>
<tr>
<td align="center">📨</td>
<td>Sending email reliably from a serverless route with Resend</td>
</tr>
<tr>
<td align="center">🌦️</td>
<td>Integrating a live weather API with city autocomplete</td>
</tr>
<tr>
<td align="center">💫</td>
<td>Creating scroll-reveal and progress animations with custom hooks</td>
</tr>
<tr>
<td align="center">🧪</td>
<td>Writing component tests with Jest and React Testing Library</td>
</tr>
</table>
</div>

## 🔮 Future Improvements

<div align="center">

🌐 Add more languages  
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

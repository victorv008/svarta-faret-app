# 👋 Handoff: Svarta Fåret App

Här är allt du behöver veta för att ta över utvecklingen av **Svarta Fåret** – en gamifierad AI-coachningsplattform för UF-företagare.

## 🚀 Kom igång
1. **Klona repot:** `git clone https://github.com/victorv008/svarta-faret-app.git`
2. **Installera dependencies:** `npm install`
3. **Starta dev-server:** `npm run dev` (öppnas oftast på `http://localhost:5173`)

---

## 🛠 Tech Stack
- **Framework:** React + Vite
- **Styling:** Vanilla CSS (Ingen Tailwind – vi kör på "Premium Dark Tech"-estetik med custom tokens)
- **State:** React Hooks (`useState`, `useCallback`, `useRef`) för navigering och spelmekanik.

---

## 📱 Nuvarande Status (Vad som är byggt)

### 1. Onboarding Flow (`OnboardingScreen.jsx`)
En interaktiv guide med slides som introducerar användaren till plattformen.

### 2. Character Selection (`CharacterSelectScreen.jsx`)
- **Design:** Swipeable karaktärskarusell med "flip-cards".
- **Mentorer:** 4 unika får-karaktärer (Elton, Stevie, Maxwell, Garry) baserade på kända entreprenörer.
- **Interaktion:** Tryck på ett kort för att vända det (3D-animation) och se mentor-bios. Bakgrundens glow ändras dynamiskt beroende på vald karaktär.

### 3. Dashboard (`DashboardScreen.jsx`)
Huvudvyn med stats (XP, streaks), mentor-tips och en att-göra-lista.

### 4. The Path / Milestones (`MilestonesScreen.jsx`)
Detta är appens "hjärta". En Candy Crush-inspirerad spelkarta.
- **Väg:** En slingrande SVG-väg som lyser upp ju längre man kommer.
- **Gamification:** XP-system, level-up badges, partikelexplosioner vid avklarade steg och en "undo"-funktion med bekräftelse-modal.
- **UX:** Auto-scrollar till den aktuella noden vid start.

### 5. AI Chat & Kalender (`ChatScreen.jsx`, `CalendarScreen.jsx`)
Fungerande UI-skal för chatten och en fullständig kalendervy för att hålla koll på UF-deadlines.

---

## 🎨 Designspråk (The "Vibe")
- **Bakgrund:** `#080808` (Deep Dark)
- **Accenter:** `#ecb213` (Gold), `#4ade80` (Green), `#60a5fa` (Blue), `#a78bfa` (Purple)
- **Effekter:** Glassmorphism (`backdrop-filter`), tunga skuggor, och "breathing" animationer för interaktiva element.
- **Bilder:** Alla får-illustrationer finns i `/public`.

---

## 🚩 Nästa steg (Roadmap)
1. **AI-Integration:** Koppla ihop `ChatScreen` med ett riktigt LLM API (t.ex. OpenAI eller Gemini).
2. **Persistens:** Just nu sparas progress bara i state (försvinner vid refresh). Implementera `localStorage` eller en riktig backend (Firebase/Supabase).
3. **PWA:** Slutför `manifest.json` och service workers så att appen kan installeras på mobilen som en riktig app.
4. **Mentor-logik:** Låt valet av karaktär i början styra tonläget och råden i chatten.

---

## 📂 Filstruktur
- `src/App.jsx` - Hanterar routing och huvud-state.
- `src/screens/` - Alla sidor och deras specifika CSS-filer.
- `src/index.css` - Globala stilar och design-tokens.
- `public/` - Statiska assets (bilder, ikoner).

Lycka till! Det är ett sjukt kul projekt att jobba med. 🐑✨

# webStory [https://webstory-6wc7.onrender.com]
This project is a full-stack Web Stories CMS &amp; Player. The Admin Dashboard (Node/Express/MongoDB) allows effortless creation of multi-slide stories with media uploads via Cloudinary. The React Frontend delivers a mobile-first, seamless auto-playing player, enabling users to view category-organized stories with intuitive tap-to-navigate controls. 

🛠 Admin Panel (CMS)
Create, edit, delete stories
Upload images/videos for each slide
Add animations (fade, slide-left, slide-right, zoom)
Slide reordering (drag-and-drop + mobile buttons)
Fully responsive (works on mobile)
Auth-protected routes (admin only)

🎥 Story Player (User Side)
Auto-play stories
Tap/click navigation
Swipe-friendly mobile UX
Story progress bars
Category filtering

🔐 Authentication
JWT-based sign up & login
Role-based access (Admin / User)
Protected API routes

🧱 Tech Stack

Frontend:
React (Vite)
TailwindCSS
shadcn/ui components
Axios
React Router

Backend:
Node.js + Express
MongoDB + Mongoose
Cloudinary (media uploads)
Multer
JWT Auth
bcrypt


 .Env Sample
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.apzegq1.mongodb.net/?appName=Cluster0
CLOUDINARY_CLOUD_NAME= 
CLOUDINARY_API_KEY= 
CLOUDINARY_API_SECRET= 
CLOUDINARY_URL=cloudinary://id:key
JWT_SECRET=bvcmbvghhfxbmfxf
JWT_EXPIRES_IN=7d
NODE_ENV=development


Frontend & Backend
npm istall & npm run dev

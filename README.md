# PastForward

PastForward is a one-of-a-kind application that bridges the gap between history and modern social interaction. With a unique twist, it allows users to step back in time and engage with historical posts as if they were part of today’s social feed. Browse iconic moments, like legendary events, and comment on the past — all through a familiar, interactive social media experience.

Whether it’s a royal decree, a revolutionary speech, or a snapshot of daily life from centuries ago, PastForward makes history feel alive and personal. It’s not just about learning the past — it’s about living it..






**Presentation Link**:

https://docs.google.com/presentation/d/1PC9J7_nf_X8zuRKeX_Jw09rF2KhYCQiy/edit?usp=drivesdk&ouid=118321480189044695096&rtpof=true&sd=true


**Live Demo** : 

https://pastforward-neon.vercel.app/

## Screenshots

### Home Page
<img width="1502" alt="image" src="https://github.com/user-attachments/assets/521a4dbe-4203-4a99-aed5-34d597ca9f1a" />


### Public Feed
<img width="1499" alt="image" src="https://github.com/user-attachments/assets/4f2812f0-26a1-43a0-a255-107e2239957a" />


### Profile Page
<img width="1510" alt="image" src="https://github.com/user-attachments/assets/ab6a6c8e-6500-4259-a692-31e577743876" />

### Create Post
<img width="1494" alt="Screenshot 2025-04-20 at 1 54 43 PM" src="https://github.com/user-attachments/assets/3c44e605-b016-4192-b523-214646ecfcdd" />

### Profile Page

<img width="1511" alt="Screenshot 2025-04-20 at 1 55 27 PM" src="https://github.com/user-attachments/assets/a4802a29-a450-4fd0-8fcb-ffa3ffec96b1" />


### Settings Page 
<img width="1511" alt="image" src="https://github.com/user-attachments/assets/ec87b14c-976a-454c-b6ee-4945b90daf75" />

### How it Works ?
<img width="1506" alt="image" src="https://github.com/user-attachments/assets/252df348-a163-461a-aa5e-16bbb4931ffa" />


## Features

- **Authentication**: User registration and login with Google OAuth
- **Post Creation**: Create posts with images and captions
- **Public Feed**: Browse posts from all users with infinite scrolling
- **Interaction**: Like and comment on posts
- **Profile Management**: View and edit user profiles
- **Follow System**: Follow/unfollow other users
- **Historical Content**: Browse and interact with historical posts
- **Search**: Find users and content
- **Responsive Design**: Works on mobile and desktop devices

## Technologies Used

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI, ElevenLabs (with free alternatives)
- **Image Generation**: Replicate, Stability AI
- **Deployment**: Vercel

## Flowcharts

### API Routes Structure
![image](https://github.com/user-attachments/assets/fd1dc01a-4738-43fe-9d5a-372395e1424a)

### Authentication Flow

![image](https://github.com/user-attachments/assets/9e9105a2-91d6-4893-bd2b-ff75dc5c0cb0)

### Component Hierarchy

![image](https://github.com/user-attachments/assets/66337ea3-0a30-4a20-b40b-c1ee91946e91)

### Data Model Relationships

![image](https://github.com/user-attachments/assets/97c1f668-f5a0-41bc-90ac-92caeed30e6e)


### Overall Application Architecture

![image](https://github.com/user-attachments/assets/db26e7f8-21fd-48a1-9f4e-64add9cc0d79)

### Post Creation Flow

![image](https://github.com/user-attachments/assets/5fa1fd0b-21c2-4bd7-8284-f1448da54567)


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Anubhab-Rakshit/pastforward.git
   cd pastforward
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```
   # Database
   DATABASE_URL=
   DATABASE_URL_UNPOOLED=
   PGHOST=

   # Authentication
   NEXTAUTH_SECRET=
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=

   
   # AI Services
   GEMINI_API_KEY=
   HUGGINGFACE_API_KEY=
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
  ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating an Account
1. Navigate to the sign-up page
2. Sign up with Google or create a new account
3. Complete your profile setup

### Creating Posts
1. Click on the "+" button in the navigation
2. Upload an image
3. Add a caption
4. Click "Post"

### Interacting with Posts
1. Browse the public feed
2. Like posts by clicking the heart icon
3. Comment on posts by clicking the comment icon
4. Follow users by visiting their profile and clicking "Follow"

### Exploring Historical Content
1. Navigate to the "Interact" page
2. Browse historical posts
3. Like and comment on historical content

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Connect your repository in Vercel
3. Configure project:
   - Framework Preset: Next.js
   - Build Command: `prisma generate && prisma migrate deploy && next build`
   - Output Directory: `.next`

4. Add Environment Variables:
   - Add all your environment variables from `.env.local` to Vercel
   - Make sure to include database connection strings and API keys

5. Update Google OAuth:
   - Add your Vercel deployment URL to Google Cloud Console
   - Add `https://your-vercel-app.vercel.app` to Authorized JavaScript origins
   - Add `https://your-vercel-app.vercel.app/api/auth/callback/google` to Authorized redirect URIs

6. Deploy and test your application

## Free API Alternatives

PastForward includes support for free alternatives to paid APIs:

- **Text Generation**: HuggingFace models instead of OpenAI
- **Image Generation**: Stable Diffusion XL instead of DALL-E
- **Text-to-Speech**: ElevenLabs free tier or browser-based alternatives

See `lib/free-api-alternatives.ts` for implementation details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

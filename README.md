# DriveNote

DriveNote is a modern note-taking application that seamlessly integrates with Google Drive, allowing users to create, edit, and manage their documents with ease.

## Features

- 🔐 Secure Google Authentication
- 📝 Rich Text Editor with Google Docs-like features
- 📁 Seamless Google Drive Integration
- 🎨 Modern, Responsive UI
- 📱 Mobile-Friendly Design
- ⚡ Real-time Auto-saving
- 🔍 Document Search and Filtering
- ⭐ Starred Documents
- 🗑️ Trash Management
- ⚙️ User Settings
- ❓ Help & Support

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Firebase Authentication
- React Router for navigation
- TinyMCE for rich text editing

### Backend
- Node.js with Express
- TypeScript
- Google Drive API
- MongoDB for user data
- JWT for authentication

## Project Structure

```
drivenote/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript type definitions
│   └── public/           # Static assets
└── server/               # Backend Node.js application
    ├── src/
    │   ├── config/      # Configuration files
    │   ├── controllers/ # Route controllers
    │   ├── middleware/  # Custom middleware
    │   ├── models/      # Database models
    │   ├── routes/      # API routes
    │   └── utils/       # Utility functions
    └── tests/           # Test files
```

## Key Components

### Frontend Components

1. **AppSidebar**
   - Main navigation sidebar
   - Collapsible design
   - Quick access to documents, starred items, and settings

2. **TextEditor**
   - Rich text editor with formatting options
   - Auto-save functionality
   - Google Docs-like interface

3. **Documents**
   - Document list view
   - Search and filter capabilities
   - Document actions (edit, delete, star)

4. **LoginForm**
   - Google authentication
   - User onboarding
   - Error handling

### Backend Components

1. **User Controller**
   - User authentication
   - Profile management
   - Google Drive token management

2. **Document Controller**
   - Document CRUD operations
   - Google Drive integration
   - Content synchronization

3. **Auth Middleware**
   - JWT verification
   - Request authentication
   - Error handling

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/drivenote.git
   cd drivenote
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both `client` and `server` directories
   - Add necessary environment variables (see `.env.example` files)

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm run dev
   ```

## Environment Variables

### Client (.env)
```
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Server (.env)
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

### Google Drive API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs (e.g., `http://localhost:5173`)
   - Save your Client ID and Client Secret
5. Add credentials to your `.env` file:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to "Authentication" > "Sign-in method"
   - Enable "Google" sign-in
4. Get your Firebase config:
   - Go to Project Settings (gear icon)
   - Under "Your apps", click the web icon (</>)
   - Register your app and copy the config
5. Add Firebase config to your `.env` file:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### TinyMCE Setup
1. Sign up for a [TinyMCE account](https://www.tiny.cloud/auth/signup/)
2. Get your API key from the TinyMCE dashboard
3. Install TinyMCE in your project:
   ```bash
   npm install @tinymce/tinymce-react
   ```
4. Add your TinyMCE API key to your `.env` file:
   ```
   VITE_TINYMCE_API_KEY=your_api_key
   ```
5. Initialize TinyMCE in your component:
   ```typescript
   import { Editor } from '@tinymce/tinymce-react';

   const MyEditor = () => {
     return (
       <Editor
         apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
         init={{
           height: 500,
           menubar: false,
           plugins: [
             'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
             'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
             'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
           ],
           toolbar: 'undo redo | blocks | ' +
             'bold italic backcolor | alignleft aligncenter ' +
             'alignright alignjustify | bullist numlist outdent indent | ' +
             'removeformat | help',
           content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
         }}
       />
     );
   };
   ```

For more information, visit:
- [Google Drive API Documentation](https://developers.google.com/drive)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TinyMCE Documentation](https://www.tiny.cloud/docs/) 
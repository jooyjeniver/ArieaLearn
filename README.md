# AreaLearn Backend API

Backend for the AreaLearn mobile application with authentication, education modules, user progress tracking, and 3D AR model management.

## Features

- **User Authentication**: Register, login, profile management
- **Education Modules**: Content management with text, images, and resources
- **AR Learning**: 3D model management for AR experiences
- **Progress Tracking**: User progress tracking across modules
- **User Profiles**: Profile management with avatars
- **Admin Controls**: Admin panel for content management

## Technology Stack

- **Backend**: Node.js and Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local file system (can be extended to cloud storage)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/progress` - Get user progress

### Education Modules

- `GET /api/modules` - Get all modules
- `GET /api/modules/:id` - Get specific module
- `POST /api/modules` - Create new module (admin)
- `PUT /api/modules/:id` - Update module (admin)
- `DELETE /api/modules/:id` - Delete module (admin)
- `POST /api/modules/:id/resources` - Add resource to module (admin)
- `POST /api/modules/:id/models` - Add AR model to module (admin)
- `PUT /api/modules/:id/progress` - Update user progress for module

### AR Models

- `GET /api/armodels` - Get all AR models
- `GET /api/armodels/:id` - Get specific AR model
- `POST /api/armodels` - Create new AR model (admin)
- `PUT /api/armodels/:id` - Update AR model (admin)
- `DELETE /api/armodels/:id` - Delete AR model (admin)

## Production Deployment

This backend is configured for easy deployment to various free hosting platforms.

### Prerequisites

1. Create a MongoDB Atlas account and obtain a connection string
2. Update the `MONGODB_URI` in the `.env` file with your connection string
3. Set a strong `JWT_SECRET` in the `.env` file
4. Update `CORS_ORIGIN` with your frontend app URL

### Deploy to Render (Free)

1. Sign up for [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Use the following settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables from your `.env` file
6. Deploy the service

### Deploy to Railway (Free)

1. Sign up for [Railway](https://railway.app)
2. Create a new project and select GitHub repository
3. Add a MongoDB plugin or use your MongoDB Atlas connection
4. Configure the environment variables from your `.env` file
5. Deploy using the `railway.json` configuration

### Deploy to Heroku (Free tier for small projects)

1. Sign up for [Heroku](https://heroku.com)
2. Install the Heroku CLI: `npm install -g heroku`
3. Login to Heroku: `heroku login`
4. Create a new app: `heroku create your-app-name`
5. Set environment variables:
   ```
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```
6. Push to Heroku: `git push heroku main`

### Deploy to Vercel (Free)

1. Sign up for [Vercel](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`
3. Run `vercel` in the project directory
4. Configure environment variables in the Vercel dashboard
5. Deploy with `vercel --prod`

## File Upload Considerations

For free hosting, consider these options for file storage:

1. **Cloudinary**: For image and media storage
2. **AWS S3 Free Tier**: For 3D model storage
3. **Firebase Storage**: Alternative for file storage

Update the storage logic in the controllers to use cloud storage instead of local file system for production.

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the development variables
4. Start the development server:
   ```
   npm run dev
   ```

## Folder Structure

```
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middlewares/        # Custom middlewares
├── models/             # Database models
├── routes/             # API routes
├── uploads/            # Uploaded files
├── utils/              # Utility functions
├── .env                # Environment variables
├── package.json        # Dependencies
└── server.js           # Main application file
```

## License

MIT
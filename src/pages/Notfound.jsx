import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-400 dark:text-gray-600">404</h1>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-4">
          Page Not Found
        </h2>
        <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link 
          to="/" 
          className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
        >
          Go back to Homepage
        </Link>
      </div>
    </div>
  );
};


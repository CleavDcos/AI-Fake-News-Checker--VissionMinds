import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Home, AlertCircle } from 'lucide-react';
import { ROUTES } from '../utils/constants';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="pt-12 pb-12 text-center">
          <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h1 className="text-gray-900 mb-3">404</h1>
          <h2 className="text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to={ROUTES.HOME}>
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

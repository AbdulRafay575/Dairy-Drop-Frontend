import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Search, 
  Milk,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-primary/20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              404
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-300/10 rounded-full blur-xl"></div>
        </div>

        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Milk className="h-12 w-12 text-primary" />
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold mb-4">Freshness Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for seems to have gone sour. 
          Don't worry, we have plenty of fresh dairy waiting for you!
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Button size="lg" asChild className="w-full">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" asChild>
              <Link to="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">
                <Search className="mr-2 h-4 w-4" />
                Get Help
              </Link>
            </Button>
          </div>

          <Button variant="ghost" asChild>
            <Link to="/" className="text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Or go back to previous page
            </Link>
          </Button>
        </div>

        {/* Fun Facts */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="font-semibold mb-4">While you're here...</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-2">🥛</div>
              <p className="text-sm">Fresh milk delivered daily</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-2">🧀</div>
              <p className="text-sm">Artisanal cheese varieties</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-2">🍦</div>
              <p className="text-sm">Creamy ice cream flavors</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-2">🚚</div>
              <p className="text-sm">Same day delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
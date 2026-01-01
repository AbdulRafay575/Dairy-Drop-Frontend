import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const EmptyState = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'default',
  variant = 'default'
}) => {
  const sizeClasses = {
    small: 'py-8',
    default: 'py-12',
    large: 'py-16',
    xlarge: 'py-20'
  };

  const variantClasses = {
    default: 'bg-background',
    muted: 'bg-muted/30',
    card: 'bg-card border rounded-lg'
  };

  return (
    <div className={cn(
      'text-center',
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-muted">
            {React.cloneElement(icon, {
              className: cn('h-6 w-6 text-muted-foreground', icon.props.className)
            })}
          </div>
        </div>
      )}
      
      <h3 className={cn(
        'font-semibold mb-2',
        size === 'small' ? 'text-base' : 'text-lg'
      )}>
        {title}
      </h3>
      
      {description && (
        <p className={cn(
          'text-muted-foreground mb-6 max-w-md mx-auto',
          size === 'small' ? 'text-sm' : 'text-base'
        )}>
          {description}
        </p>
      )}
      
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <div>
              {action}
            </div>
          )}
          {secondaryAction && (
            <div>
              {secondaryAction}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Pre-configured empty states
export const EmptyCartState = ({ onContinueShopping }) => (
  <EmptyState
    icon={<ShoppingCart className="h-8 w-8" />}
    title="Your cart is empty"
    description="Add some fresh dairy products to get started"
    action={
      <Button onClick={onContinueShopping}>
        Continue Shopping
      </Button>
    }
    size="large"
    variant="card"
  />
);

export const EmptyWishlistState = ({ onBrowseProducts }) => (
  <EmptyState
    icon={<Heart className="h-8 w-8" />}
    title="Your wishlist is empty"
    description="Save your favorite dairy products here"
    action={
      <Button onClick={onBrowseProducts}>
        Browse Products
      </Button>
    }
    size="large"
    variant="card"
  />
);

export const EmptyOrdersState = ({ onStartShopping }) => (
  <EmptyState
    icon={<Package className="h-8 w-8" />}
    title="No orders yet"
    description="Your order history will appear here"
    action={
      <Button onClick={onStartShopping}>
        Start Shopping
      </Button>
    }
    size="large"
    variant="card"
  />
);

export const EmptySearchState = ({ onClearFilters }) => (
  <EmptyState
    icon={<Search className="h-8 w-8" />}
    title="No results found"
    description="Try adjusting your filters or search terms"
    action={
      <Button onClick={onClearFilters}>
        Clear Filters
      </Button>
    }
    size="default"
    variant="muted"
  />
);

export const EmptyAddressesState = ({ onAddAddress }) => (
  <EmptyState
    icon={<MapPin className="h-8 w-8" />}
    title="No addresses saved"
    description="Add your first delivery address"
    action={
      <Button onClick={onAddAddress}>
        Add Address
      </Button>
    }
    size="default"
    variant="card"
  />
);

export const EmptyReviewsState = ({ onAddReview, canReview }) => (
  <EmptyState
    icon={<Star className="h-8 w-8" />}
    title="No reviews yet"
    description={canReview ? "Be the first to review this product" : "No reviews available"}
    action={canReview && (
      <Button onClick={onAddReview}>
        Write a Review
      </Button>
    )}
    size="default"
    variant="muted"
  />
);

// Icon components (these would be imported from lucide-react in real usage)
const ShoppingCart = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const Heart = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Package = (props) => (
  <svg {...props} xmlns="http://www.w3.org2000/svg" viewBox="0 0 24 24">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const Search = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const MapPin = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Star = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default EmptyState;
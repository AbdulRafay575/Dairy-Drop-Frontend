import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Lock,
  AlertCircle
} from 'lucide-react';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51SmHluBmkGBpjX5xXdBQZyowoBFYkNdLrdYt6G4dqr69KqO8yPfXVJlSQULN1pwF5GMXXZgBrcrbOqB9gS3AKCrA00i1eJ5ydt');

const CheckoutForm = ({ orderId, amount, clientSecret, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      console.error('Stripe not ready');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        setError(submitError.message);
        setIsProcessing(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation/${orderId}`,
        },
        redirect: 'if_required'
      });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        setError(stripeError.message);
        toast({
          title: 'Payment Failed',
          description: stripeError.message,
          variant: 'destructive'
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment successful!');
        toast({
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully.',
          variant: 'default'
        });
        
        // Call onSuccess callback after a short delay
        setTimeout(() => {
          if (onSuccess) onSuccess(paymentIntent);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
      toast({
        title: 'Payment Error',
        description: error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    }
  };

  if (loading || !clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Setting up secure payment...</p>
      </div>
    );
  }

  if (error && !clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Setup Failed</h3>
        <p className="text-gray-600 mb-6 text-center">
          {error}
        </p>
        <Button onClick={() => window.location.reload()} className="mb-3">
          Try Again
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Payment Header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Your Payment
        </h2>
        <p className="text-gray-600 mb-1">
          Amount: <span className="font-bold">₨{amount}</span>
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
          <Shield className="h-4 w-4 text-green-600" />
          <span>100% Secure Payment</span>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Element */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Card Details
            </label>
            <div className="p-4 border border-gray-300 rounded-lg bg-white">
              {clientSecret && (
                <PaymentElement 
                  id="payment-element" 
                  options={paymentElementOptions}
                />
              )}
            </div>
            
            {/* Test Card Info */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-1">Test Mode</p>
              <div className="text-xs text-yellow-700 space-y-0.5">
                <p>Use card: <span className="font-mono bg-yellow-100 px-1 rounded">4242 4242 4242 4242</span></p>
                <p>Any future expiry: <span className="font-mono bg-yellow-100 px-1 rounded">12/34</span></p>
                <p>Any CVC: <span className="font-mono bg-yellow-100 px-1 rounded">123</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{message}</span>
            </div>
            <p className="text-sm text-green-600 mt-2">Redirecting to order confirmation...</p>
          </div>
        )}

        {/* Security Note */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Your payment is secure</p>
              <p>
                Your payment details are encrypted and processed securely by Stripe.
                We never store your card information on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            type="submit"
            disabled={isProcessing || !stripe || !elements}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-base font-medium"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ₨{amount}
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full h-12"
            disabled={isProcessing}
          >
            Cancel Payment
          </Button>
        </div>
      </form>
    </div>
  );
};

const Payment = ({ orderId, amount, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!orderId) return;

    const init = async () => {
      try {
        setLoading(true);
        const response = await apiService.createPaymentIntent(orderId);
        if (response && response.success && response.data && response.data.clientSecret) {
          setClientSecret(response.data.clientSecret);
          console.log('Fetched clientSecret for order', orderId);
        } else {
          throw new Error(response.message || 'Failed to create payment intent');
        }
      } catch (err) {
        console.error('Error creating payment intent:', err);
        toast({
          title: 'Payment Initialization Failed',
          description: err.message || 'Could not initialize payment.',
          variant: 'destructive'
        });
        if (onCancel) onCancel();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [orderId]);

  const options = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2563eb',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px'
          }
        }
      }
    : null;

  if (loading || !clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Preparing secure payment...</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm 
        orderId={orderId} 
        amount={amount} 
        clientSecret={clientSecret}
        onSuccess={onSuccess} 
        onCancel={onCancel} 
      />
    </Elements>
  );
};

export default Payment;
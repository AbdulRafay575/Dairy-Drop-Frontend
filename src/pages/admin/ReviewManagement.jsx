import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  CheckCircle, 
  XCircle,
  Eye,
  MoreVertical,
  User,
  Package,
  ThumbsUp,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiService } from '@/services/api';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [searchQuery, statusFilter, ratingFilter, reviews]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllReviews();
      if (response.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(review =>
        review.user?.name?.toLowerCase().includes(query) ||
        review.product?.name?.toLowerCase().includes(query) ||
        review.comment?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(review => 
        statusFilter === 'approved' ? review.isApproved : !review.isApproved
      );
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    setFilteredReviews(filtered);
  };

  const handleUpdateReview = async (reviewId, updates) => {
    try {
      const response = await apiService.updateReviewApproval(reviewId, updates);
      if (response.success) {
        fetchReviews(); // Refresh reviews
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await apiService.deleteReview(reviewId);
      if (response.success) {
        fetchReviews(); // Refresh reviews
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const viewReviewDetails = (review) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Review Management</h2>
          <p className="text-muted-foreground">
            Manage product reviews and ratings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {reviews.filter(r => !r.isApproved).length} Pending
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Approval Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending Approval</SelectItem>
          </SelectContent>
        </Select>

        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger>
            <Star className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => {
          setSearchQuery('');
          setStatusFilter('all');
          setRatingFilter('all');
        }}>
          Clear Filters
        </Button>
      </div>

      {/* Reviews Table */}
      <div className="border rounded-lg bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product & Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Package className="h-3 w-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{review.product?.name}</p>
                          <p className="text-xs text-muted-foreground">{review.product?.brand}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-2 w-2" />
                        </div>
                        <span className="text-sm">{review.user?.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {renderStars(review.rating)}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{review.helpful?.count || 0} helpful</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {review.title && (
                        <p className="font-medium text-sm mb-1">{review.title}</p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {review.isApproved ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!review.isApproved && (
                          <DropdownMenuItem onClick={() => handleUpdateReview(review._id, { isApproved: true })}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Review
                          </DropdownMenuItem>
                        )}
                        {review.isApproved && (
                          <DropdownMenuItem onClick={() => handleUpdateReview(review._id, { isApproved: false })}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Disapprove Review
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Delete Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No reviews found</h3>
            <p className="text-muted-foreground">
              {reviews.length === 0 
                ? 'No reviews submitted yet' 
                : 'No reviews match your filters'}
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">{reviews.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-bold">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">
                {reviews.filter(r => r.isApproved).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">
                {reviews.filter(r => !r.isApproved).length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Review Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    {selectedReview.product?.images?.[0]?.url ? (
                      <img
                      src={`https://dairydrop.onrender.com${selectedReview.product.images[0].url}`}
                        alt={selectedReview.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold">{selectedReview.product?.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedReview.product?.brand}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-2">{renderStars(selectedReview.rating)}</div>
                  <Badge className={selectedReview.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {selectedReview.isApproved ? 'Approved' : 'Pending Approval'}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Review Content */}
              <div>
                <h4 className="font-medium mb-2">Review</h4>
                {selectedReview.title && (
                  <h5 className="text-lg font-medium mb-2">{selectedReview.title}</h5>
                )}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedReview.comment}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-medium mb-2">Customer Information</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedReview.user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {new Date(selectedReview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div>
                <h4 className="font-medium mb-2">Order Information</h4>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Order:</span>
                  <span className="text-muted-foreground">{selectedReview.order?.orderNumber || 'N/A'}</span>
                </div>
              </div>

              {/* Helpful Votes */}
              <div>
                <h4 className="font-medium mb-2">Helpful Votes</h4>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                  <span>{selectedReview.helpful?.count || 0} people found this helpful</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {!selectedReview.isApproved ? (
                  <Button onClick={() => {
                    handleUpdateReview(selectedReview._id, { isApproved: true });
                    setIsDialogOpen(false);
                  }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Review
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => {
                    handleUpdateReview(selectedReview._id, { isApproved: false });
                    setIsDialogOpen(false);
                  }}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Disapprove
                  </Button>
                )}
                <Button 
                  variant="destructive"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this review?')) {
                      handleDeleteReview(selectedReview._id);
                      setIsDialogOpen(false);
                    }
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Delete Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewManagement;
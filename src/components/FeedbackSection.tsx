import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';

interface Comment {
  _id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

interface FeedbackSectionProps {
  verificationId: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  onUpvote: () => void;
  onDownvote: () => void;
  onAddComment: (text: string) => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  verificationId,
  upvotes,
  downvotes,
  comments,
  onUpvote,
  onDownvote,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState<'up' | 'down' | null>(null);

  const handleUpvote = () => {
    if (hasVoted === 'up') {
      toast.info('You already upvoted this');
      return;
    }
    setHasVoted('up');
    onUpvote();
    toast.success('Upvoted!');
  };

  const handleDownvote = () => {
    if (hasVoted === 'down') {
      toast.info('You already downvoted this');
      return;
    }
    setHasVoted('down');
    onDownvote();
    toast.success('Downvoted!');
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddComment(commentText);
      setCommentText('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Vote Buttons */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleUpvote}
            variant={hasVoted === 'up' ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-2"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{upvotes}</span>
          </Button>
          <Button
            onClick={handleDownvote}
            variant={hasVoted === 'down' ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-2"
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{downvotes}</span>
          </Button>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageSquare className="w-4 h-4" />
            <span>{comments.length} Comments</span>
          </div>
        </div>

        {/* Add Comment */}
        <div className="space-y-3">
          <Textarea
            placeholder="Add your thoughts or feedback..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button
            onClick={handleSubmitComment}
            disabled={isSubmitting || !commentText.trim()}
            className="w-full sm:w-auto"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>

        {/* Comments List */}
        {comments.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-gray-900">Comments</h4>
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getInitials(comment.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-900">{comment.username}</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

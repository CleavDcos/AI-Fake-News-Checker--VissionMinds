import React, { useEffect, useState } from 'react';
import {
  getCommunityPosts,
  upvoteVerification,
  downvoteVerification,
  addComment,
  CommunityPost,
} from '../services/verifyService';
import { ResultCard } from '../components/ResultCard';
import { FeedbackSection } from '../components/FeedbackSection';
import { Loader } from '../components/Loader';
import { Card, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Users, AlertCircle, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export const Community: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getCommunityPosts();
        setPosts(data);
      } catch (err: any) {
        console.error('Failed to fetch community posts:', err);
        // Generate mock community posts for demo
        const mockPosts: CommunityPost[] = [
          {
            _id: '1',
            userId: 'user123',
            text: 'Major tech company announces breakthrough in quantum computing',
            result: 'true',
            confidence: 0.88,
            explanation:
              'This announcement has been covered by multiple reputable technology news sources and confirmed by the company through official press releases.',
            sources: ['https://techcrunch.com', 'https://theverge.com'],
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            upvotes: 42,
            downvotes: 3,
            comments: [
              {
                _id: 'c1',
                userId: 'user456',
                username: 'TechEnthusiast',
                text: 'This is really exciting! Finally some real progress in quantum computing.',
                createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              },
              {
                _id: 'c2',
                userId: 'user789',
                username: 'SkepticalReader',
                text: 'The sources check out. Good verification!',
                createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
              },
            ],
          },
          {
            _id: '2',
            userId: 'user456',
            text: 'Video claims miracle cure for common disease',
            result: 'false',
            confidence: 0.95,
            explanation:
              'This claim has been thoroughly debunked by medical professionals and fact-checkers. No peer-reviewed studies support these claims. The source has a history of promoting unverified medical information.',
            sources: ['https://healthfactcheck.org', 'https://who.int'],
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            upvotes: 68,
            downvotes: 5,
            comments: [
              {
                _id: 'c3',
                userId: 'user101',
                username: 'HealthProfessional',
                text: 'Thanks for verifying this. Too many people fall for these scams.',
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              },
            ],
          },
          {
            _id: '3',
            userId: 'user789',
            url: 'https://example.com/political-claim',
            text: 'Politician makes controversial statement about policy',
            result: 'uncertain',
            confidence: 0.52,
            explanation:
              'The statement was made, but the context and interpretation are debatable. Different sources present conflicting accounts of the full statement and its meaning.',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            upvotes: 23,
            downvotes: 18,
            comments: [],
          },
        ];
        setPosts(mockPosts);
        setError('Demo mode: Showing sample community posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleUpvote = async (postId: string) => {
    try {
      await upvoteVerification(postId);
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
        )
      );
    } catch (err: any) {
      console.error('Upvote failed:', err);
      // Demo: Update locally anyway
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
        )
      );
    }
  };

  const handleDownvote = async (postId: string) => {
    try {
      await downvoteVerification(postId);
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, downvotes: post.downvotes + 1 } : post
        )
      );
    } catch (err: any) {
      console.error('Downvote failed:', err);
      // Demo: Update locally anyway
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, downvotes: post.downvotes + 1 } : post
        )
      );
    }
  };

  const handleAddComment = async (postId: string, text: string) => {
    try {
      await addComment(postId, text);
      // Add comment locally
      const newComment = {
        _id: Math.random().toString(36).substr(2, 9),
        userId: 'currentUser',
        username: 'You',
        text,
        createdAt: new Date().toISOString(),
      };
      setPosts(
        posts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
    } catch (err: any) {
      console.error('Add comment failed:', err);
      throw err;
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const scoreA = a.upvotes - a.downvotes;
    const scoreB = b.upvotes - b.downvotes;
    return scoreB - scoreA;
  });

  const recentPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading community posts..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-gray-900">Community</h1>
            <p className="text-gray-600">
              See what others are verifying and share your insights
            </p>
          </div>
        </div>

        {/* Demo Alert */}
        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Posts */}
        <Tabs defaultValue="trending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trending">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            {sortedPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">No Posts Yet</h3>
                  <p className="text-gray-600">
                    Be the first to share a verification with the community
                  </p>
                </CardContent>
              </Card>
            ) : (
              sortedPosts.map((post) => (
                <div key={post._id} className="space-y-4">
                  <ResultCard result={post} showDate />
                  <FeedbackSection
                    verificationId={post._id}
                    upvotes={post.upvotes}
                    downvotes={post.downvotes}
                    comments={post.comments}
                    onUpvote={() => handleUpvote(post._id)}
                    onDownvote={() => handleDownvote(post._id)}
                    onAddComment={(text) => handleAddComment(post._id, text)}
                  />
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            {recentPosts.map((post) => (
              <div key={post._id} className="space-y-4">
                <ResultCard result={post} showDate />
                <FeedbackSection
                  verificationId={post._id}
                  upvotes={post.upvotes}
                  downvotes={post.downvotes}
                  comments={post.comments}
                  onUpvote={() => handleUpvote(post._id)}
                  onDownvote={() => handleDownvote(post._id)}
                  onAddComment={(text) => handleAddComment(post._id, text)}
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

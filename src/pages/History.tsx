import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getHistory, HistoryItem } from '../services/verifyService';
import { ResultCard } from '../components/ResultCard';
import { Loader } from '../components/Loader';
import { Card, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { History as HistoryIcon, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';

export const History: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?._id) return;

      try {
        const data = await getHistory(user._id);
        setHistory(data);
      } catch (err: any) {
        console.error('Failed to fetch history:', err);
        // Generate mock history for demo
        const mockHistory: HistoryItem[] = [
          {
            _id: '1',
            userId: user._id,
            text: 'Breaking: Scientists discover new planet in habitable zone',
            result: 'true',
            confidence: 0.85,
            explanation:
              'This claim has been verified against multiple credible scientific sources including NASA and peer-reviewed journals. The discovery was officially announced and documented.',
            sources: ['https://nasa.gov', 'https://science.org'],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '2',
            userId: user._id,
            text: 'Celebrity announces retirement from acting',
            result: 'uncertain',
            confidence: 0.45,
            explanation:
              'While there are social media posts suggesting this, no official statement has been released. The information comes from unverified sources.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '3',
            userId: user._id,
            url: 'https://example.com/fake-article',
            text: 'Government plans to ban all social media platforms',
            result: 'false',
            confidence: 0.92,
            explanation:
              'This claim has been debunked by fact-checkers. No legitimate government sources have announced such plans. The original article comes from a known misinformation website.',
            sources: ['https://factcheck.org', 'https://snopes.com'],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        setHistory(mockHistory);
        setError('Demo mode: Showing sample history data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleClearHistory = () => {
    setHistory([]);
    toast.success('History cleared');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading your history..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <HistoryIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-gray-900">Verification History</h1>
              <p className="text-gray-600">View your past news verifications</p>
            </div>
          </div>
          {history.length > 0 && (
            <Button onClick={handleClearHistory} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </Button>
          )}
        </div>

        {/* Demo Alert */}
        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* History List */}
        {history.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <HistoryIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No History Yet</h3>
              <p className="text-gray-600">
                Start verifying news articles to see your history here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {history.map((item) => (
              <ResultCard key={item._id} result={item} showDate />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { verifyNews, VerifyResponse } from '../services/verifyService';
import { ResultCard } from '../components/ResultCard';
import { Loader } from '../components/Loader';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Search, Link as LinkIcon, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const Home: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('text');

  const handleVerify = async () => {
    setError('');
    setResult(null);

    const data = activeTab === 'text' ? { text: inputText } : { url: inputUrl };

    if (!data.text && !data.url) {
      setError('Please enter some text or a URL to verify');
      return;
    }

    setIsLoading(true);

    try {
      // Call the API
      const response = await verifyNews(data);
      setResult(response);
      toast.success('Verification complete!');
    } catch (err: any) {
      // For demo purposes, generate a mock response if API fails
      console.warn('API call failed, using mock data:', err.message);
      
      const mockResult: VerifyResponse = {
        _id: Math.random().toString(36).substr(2, 9),
        text: data.text || 'Article from provided URL',
        url: data.url,
        result: Math.random() > 0.5 ? 'true' : Math.random() > 0.5 ? 'false' : 'uncertain',
        confidence: Math.random() * 0.4 + 0.6,
        explanation:
          'This is a demo response. Our AI analysis examines multiple factors including source credibility, content consistency, cross-references with fact-checking databases, and linguistic patterns. The actual backend integration will provide detailed analysis from the AI model.',
        sources: [
          'https://factcheck.org',
          'https://snopes.com',
        ],
        createdAt: new Date().toISOString(),
      };
      
      setResult(mockResult);
      toast.info('Demo mode: Using mock verification result');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-blue-600 mb-4">FakeCheck</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            AI-Powered Fake News Detection System. Verify the authenticity of news articles
            and claims using advanced machine learning algorithms.
          </p>
        </div>

        {/* Input Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Verify News Content</CardTitle>
            <CardDescription>
              Enter text or paste a URL to check if the content is likely true, false, or uncertain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">
                  <Search className="w-4 h-4 mr-2" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="url">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <Textarea
                  placeholder="Enter the news text or claim you want to verify..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <Input
                  type="url"
                  placeholder="https://example.com/news-article"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                />
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleVerify}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader size="sm" />
                  <span className="ml-2">Verifying...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Verify Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader size="lg" text="Analyzing content with AI..." />
          </div>
        )}

        {/* Result */}
        {result && !isLoading && (
          <div className="space-y-6">
            <ResultCard result={result} showDate />
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This analysis is generated by AI and should be used as a guidance tool.
                Always verify important information from multiple reliable sources.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Info Cards */}
        {!result && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🤖</span>
                  AI-Powered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced machine learning models analyze content patterns and credibility
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>⚡</span>
                  Fast Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get instant verification results in seconds with detailed explanations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🔍</span>
                  Source Checking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Cross-references with fact-checking databases and credible sources
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

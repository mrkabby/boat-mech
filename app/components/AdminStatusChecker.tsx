"use client";

import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export default function AdminStatusChecker() {
  const { user, refreshUserClaims, isLoading } = useAuth();

  const handleRefreshClaims = async () => {
    await refreshUserClaims();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Admin Status</CardTitle>
        <CardDescription>Check your current role and refresh if needed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <span>Current Role:</span>
          <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
            {user?.role || 'not logged in'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <span>User ID:</span>
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            {user?.id || 'N/A'}
          </code>
        </div>

        <div className="flex items-center gap-4">
          <span>Email:</span>
          <span>{user?.email || 'N/A'}</span>
        </div>

        <Button 
          onClick={handleRefreshClaims} 
          disabled={isLoading || !user}
          className="w-full"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Admin Status'}
        </Button>

        {user?.role === 'admin' && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-800 text-sm">
              ✅ You have admin access! You can create and manage products.
            </p>
          </div>
        )}

        {user?.role === 'user' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ You only have user access. Try refreshing your status or contact an administrator.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

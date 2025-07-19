
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Loader2, UserCircle2, Edit3, ShieldCheck, Mail, LogOut, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.title = "User Profile - Boat Mech";
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login?redirect=/profile');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center text-center py-12">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center text-center py-12">
        <p className="text-lg text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  const userEmail = user.email || 'no-email@example.com'; // Fallback for avatar if email is null
  const avatarFallbackChar = user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U');


  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card className="shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="text-center bg-gray-50 p-6 border-b">
          <div className="flex justify-center mb-4">
            <Avatar className="h-28 w-28 border-4 border-primary shadow-md">
              <AvatarImage 
                src={`https://avatar.vercel.sh/${userEmail}.png?size=160`} 
                alt={user.name || userEmail}
                data-ai-hint="user avatar large"
              />
              <AvatarFallback className="text-5xl bg-secondary text-secondary-foreground">
                {avatarFallbackChar}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">{user.name || 'User Profile'}</CardTitle>
          <CardDescription className="text-md">View and manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <InfoItem icon={UserCircle2} label="Full Name" value={user.name || 'Not Provided'} />
            <InfoItem icon={Mail} label="Email Address" value={user.email || 'Not Provided'} />
            <InfoItem 
              icon={ShieldCheck} 
              label="Role" 
              value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
            />
            {/* Add more user details here if available, e.g., member since */}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" className="w-full sm:w-auto" disabled> {/* Edit Profile is a future feature */}
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
          {user.role === 'admin' && (
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Panel
              </Link>
            </Button>
          )}
          <Button variant="destructive" onClick={logout} className="w-full sm:w-auto sm:ml-auto">
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start space-x-4 p-4 bg-background rounded-md border shadow-sm hover:shadow-md transition-shadow">
      <Icon className="h-6 w-6 text-primary mt-1 shrink-0" />
      <div className="flex-grow">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-md font-semibold text-foreground break-words">{value}</p>
      </div>
    </div>
  );
}

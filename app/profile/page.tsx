
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Loader2, UserCircle2, MapPin, Mail, Building, Save, LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../hooks/use-toast';

interface UserProfile {
  fullName: string;
  phone: string;
  address: {
    gpsAddress: string;
    landmark: string;
    area: string;
    city: string;
    region: string;
    additionalDirections: string;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
}

export default function UserProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    phone: '',
    address: {
      gpsAddress: '',
      landmark: '',
      area: '',
      city: '',
      region: 'Greater Accra',
      additionalDirections: '',
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
    },
  });

  useEffect(() => {
    document.title = "My Account - Boat Mech";
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login?redirect=/profile');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        fullName: user.name || '',
      }));
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Here you would typically save to your backend
      // For now, we'll just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center text-center py-12">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your account...</p>
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

  const userEmail = user.email || 'no-email@example.com';
  const avatarFallbackChar = user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24 border-4 border-gray-200">
              <AvatarImage 
                src={`https://avatar.vercel.sh/${userEmail}.png?size=160`} 
                alt={user.name || userEmail}
              />
              <AvatarFallback className="text-4xl bg-gray-800 text-white">
                {avatarFallbackChar}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-bold">My Account</CardTitle>
          <CardDescription>
            Manage your personal information and delivery preferences
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="flex w-full h-auto p-1 bg-gray-100 rounded-lg overflow-x-auto">
          <TabsTrigger 
            value="personal" 
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm bg-transparent text-gray-600 hover:text-gray-900 transition-all duration-200 py-2.5 px-3 text-sm font-medium whitespace-nowrap min-w-0"
          >
            Personal Info
          </TabsTrigger>
          <TabsTrigger 
            value="address" 
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm bg-transparent text-gray-600 hover:text-gray-900 transition-all duration-200 py-2.5 px-3 text-sm font-medium whitespace-nowrap min-w-0"
          >
            Delivery Address
          </TabsTrigger>
          <TabsTrigger 
            value="account" 
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm bg-transparent text-gray-600 hover:text-gray-900 transition-all duration-200 py-2.5 px-3 text-sm font-medium whitespace-nowrap min-w-0"
          >
            Account Settings
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle2 className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  type="tel"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Address Tab */}
        <TabsContent value="address">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
              <CardDescription>
                Set your default shipping address for faster checkout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gpsAddress">GPS Address (Ghana Post GPS)</Label>
                <Input
                  id="gpsAddress"
                  value={profile.address.gpsAddress}
                  onChange={(e) => setProfile(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, gpsAddress: e.target.value }
                  }))}
                  placeholder="GA-123-4567 (Ghana Post GPS Code)"
                />
                <p className="text-xs text-gray-500">Enter your Ghana Post GPS address code</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  value={profile.address.landmark}
                  onChange={(e) => setProfile(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, landmark: e.target.value }
                  }))}
                  placeholder="Near Circle Mall, Opposite Shell Filling Station"
                />
                <p className="text-xs text-gray-500">Popular landmark or building nearby</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area/Neighborhood</Label>
                  <Input
                    id="area"
                    value={profile.address.area}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, area: e.target.value }
                    }))}
                    placeholder="Osu, Labone, East Legon"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.address.city}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    placeholder="Accra, Kumasi, Tamale"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <select
                  id="region"
                  value={profile.address.region}
                  onChange={(e) => setProfile(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, region: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Greater Accra">Greater Accra</option>
                  <option value="Ashanti">Ashanti</option>
                  <option value="Western">Western</option>
                  <option value="Central">Central</option>
                  <option value="Eastern">Eastern</option>
                  <option value="Volta">Volta</option>
                  <option value="Northern">Northern</option>
                  <option value="Upper East">Upper East</option>
                  <option value="Upper West">Upper West</option>
                  <option value="Brong Ahafo">Brong Ahafo</option>
                  <option value="Western North">Western North</option>
                  <option value="Ahafo">Ahafo</option>
                  <option value="Bono">Bono</option>
                  <option value="Bono East">Bono East</option>
                  <option value="Oti">Oti</option>
                  <option value="North East">North East</option>
                  <option value="Savannah">Savannah</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalDirections">Additional Directions</Label>
                <Textarea
                  id="additionalDirections"
                  value={profile.address.additionalDirections}
                  onChange={(e) => setProfile(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, additionalDirections: e.target.value }
                  }))}
                  placeholder="Turn left after the traffic light, white gate with blue doors, house number visible from main road..."
                  rows={3}
                />
                <p className="text-xs text-gray-500">Detailed directions to help delivery find your location</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View your account details and manage your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Email Address</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Account Type</p>
                      <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                    </div>
                  </div>
                  {user.role === 'admin' && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-end">
                <Button variant="destructive" onClick={logout} className="bg-red-600 hover:bg-red-700 text-white">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-black hover:bg-gray-800 text-white">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

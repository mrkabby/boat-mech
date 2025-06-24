
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Users - Boat Mech Admin',
  description: 'View and manage user accounts and roles.',
};

export default function ManageUsersPage() {
  // In a real application, you would fetch user data here
  // For example, using a server action or an API route that calls Firebase Admin SDK

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Manage Users</CardTitle>
          <CardDescription>Oversee user accounts and their roles within the application.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-24 w-24 text-muted-foreground mb-6" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">User Management Coming Soon</h3>
          <p className="text-muted-foreground">
            This section will allow you to view user lists, edit user roles, and manage account statuses.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            (Note: User role assignment can be done via API for now. UI for this is pending.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

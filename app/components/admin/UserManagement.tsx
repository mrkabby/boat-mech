"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useToast } from '../../hooks/use-toast';
import { UserRecord } from '../../lib/server/users';
import { Shield, ShieldCheck, User, Mail, Calendar, Clock } from 'lucide-react';

interface UserManagementProps {
  initialUsers: UserRecord[];
  onUpdateRole: (uid: string, role: 'user' | 'admin') => Promise<void>;
  onToggleStatus: (uid: string, disabled: boolean) => Promise<void>;
}

export default function UserManagement({ initialUsers, onUpdateRole, onToggleStatus }: UserManagementProps) {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleRoleUpdate = async (uid: string, newRole: 'user' | 'admin') => {
    try {
      await onUpdateRole(uid, newRole);
      
      setUsers(prev => prev.map(user => 
        user.uid === uid ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Role Updated",
        description: `User role updated to ${newRole} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update role: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleStatusToggle = async (uid: string, disabled: boolean) => {
    try {
      await onToggleStatus(uid, disabled);
      
      setUsers(prev => prev.map(user => 
        user.uid === uid ? { ...user, disabled } : user
      ));

      toast({
        title: "Status Updated",
        description: `User ${disabled ? 'disabled' : 'enabled'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions. Total users: {users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{user.email || 'No email'}</span>
                        </div>
                        {user.displayName && (
                          <div className="text-sm text-muted-foreground">
                            {user.displayName}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground font-mono">
                          {user.uid}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.role === 'admin' ? (
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                        ) : (
                          <Shield className="h-4 w-4 text-gray-400" />
                        )}
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.disabled ? 'destructive' : 'secondary'}>
                          {user.disabled ? 'Disabled' : 'Active'}
                        </Badge>
                        {user.emailVerified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.creationTime)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {user.lastSignInTime ? formatDate(user.lastSignInTime) : 'Never'}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.role}
                          onValueChange={(value: 'user' | 'admin') => 
                            startTransition(() => handleRoleUpdate(user.uid, value))
                          }
                          disabled={isPending}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant={user.disabled ? "default" : "destructive"} 
                              size="sm"
                              disabled={isPending}
                            >
                              {user.disabled ? 'Enable' : 'Disable'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {user.disabled ? 'Enable' : 'Disable'} User Account
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to {user.disabled ? 'enable' : 'disable'} this user account?
                                {!user.disabled && ' This will prevent them from signing in.'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => startTransition(() => handleStatusToggle(user.uid, !user.disabled))}
                              >
                                {user.disabled ? 'Enable' : 'Disable'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import type { Metadata } from 'next';
import { getUsers } from '../../lib/server/users';
import UserManagement from '../../components/admin/UserManagement';
import { updateUserRoleAction, toggleUserStatusAction } from '../../actions/users';

export const metadata: Metadata = {
  title: 'Manage Users - Boat Mech Admin',
  description: 'View and manage user accounts and roles.',
};

export default async function ManageUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <UserManagement 
        initialUsers={users}
        onUpdateRole={updateUserRoleAction}
        onToggleStatus={toggleUserStatusAction}
      />
    </div>
  );
}

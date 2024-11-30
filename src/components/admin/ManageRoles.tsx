'use client'

import useRoles from '@/hooks/useRoles';
import usePermissions from '@/hooks/usePermissions';
import { Role } from '@/types';
import React, { useState } from 'react';
import RoleForm from './RoleForm';
import RolesList from './RoleList';
import { Card } from '../ui/Card';

const ManageRoles: React.FC = () => {
  const { roles, loading, error, addRole, updateRole, deleteRole } = useRoles();
  const { permissions, loading: permLoading, error: permError } = usePermissions();
  const [selectedRole, setSelectedRole] = useState<Role | null>();
  const [isRoleFormOpen, setIsRoleFormOpen] = useState<boolean>(false)

  const handleEditRole = (role: Role | null) => {
    setSelectedRole(role);
    setIsRoleFormOpen(true);
  };

  const handleSubmitRole = (role: Role) => {
    console.log(role)
    if (role._id) {
      updateRole(role);
    } else {
      addRole(role);
    }
    setSelectedRole(null); // Reset selected role
    setIsRoleFormOpen(false)
  };

  const onCancel = () => {
    setSelectedRole(null)
    setIsRoleFormOpen(false);
  }

  if (loading || permLoading) return <div className='dark:text-sky-300'>Loading...</div>;
  if (error || permError) return <div className='dark:text-red-300'>Error: {error || permError}</div>;

  return (
    <Card>
      {isRoleFormOpen ? (
        <RoleForm role={selectedRole} permissions={permissions} onSubmit={handleSubmitRole} onCancel={onCancel} />
      ) : (
        <RolesList roles={roles} onEdit={handleEditRole} onDelete={deleteRole} />
      )}
    </Card>
  );
};

export default ManageRoles;
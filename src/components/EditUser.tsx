'use client'

import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { User } from '@/types';
import Image from "next/image";
import { CircleUserRound } from 'lucide-react';

interface EditUserProps {
  user?: User
  isLoading: boolean
  updateUser: (user: User) => Promise<void>
  cancel: () => void
}

export default function EditUser({ user, isLoading, updateUser, cancel }: EditUserProps) {
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setRole(user?.role || "");
    setStatus(user?.status || "");
  }, [user])

  const handleRoleChange = (event: ChangeEvent) => {
    setRole(((event.target) as HTMLInputElement).value);
  };

  const handleStatusChange = (event: ChangeEvent) => {
    setStatus(((event.target) as HTMLInputElement).value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      updateUser({ ...user, role, status })
    }
  };

  return (
    <div className="space-y-4 p-4 min-w-96">
      <h1 className="text-2xl font-bold">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {user?.image ? (
            <Image
              src={user.image}
              alt="User profile"
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <CircleUserRound className="w-20 h-20" />
          )}
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400">
            Name
          </label>
          <label id="name" className="block text-lg font-medium dark:text-gray-100">
            {user?.name}
          </label>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400">
            Email
          </label>
          <label id="email" className="block text-lg font-medium dark:text-gray-100">
            {user?.email}
          </label>
        </div>
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-400">
            Provider
          </label>
          <label id="provider" className="block text-lg font-medium dark:text-gray-100">
            {user?.provider}
          </label>
        </div>
        <div>
          <label htmlFor="createdAt" className="block text-sm font-medium text-gray-400">
            Created At
          </label>
          <label id="createdAt" className="block text-lg font-medium dark:text-gray-100">
            {user ? new Date(user?.createdAt).toLocaleString() : '-'}
          </label>
        </div>
        <div>
          <label htmlFor="lastLoginAt" className="block text-sm font-medium text-gray-400">
            Last Login At
          </label>
          <label id="lastLoginAt" className="block text-lg font-medium dark:text-gray-100">
            {user ? new Date(user?.lastLoginAt).toLocaleString() : '-'}
          </label>
        </div>
        <div>
          <label htmlFor="isEmailVerified" className="block text-sm font-medium text-gray-400">
            Is Email Verified
          </label>
          <label id="isEmailVerified" className="block text-lg font-medium dark:text-gray-100">
            {user?.isEmailVerified ? "YES" : "NO"}
          </label>
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-400">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={handleRoleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-400">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3 mt-6 border-t pt-4 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={cancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={isLoading}
            isLoading={isLoading}
          >
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
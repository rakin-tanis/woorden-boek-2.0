'use client'

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  provider: string;
  role: string;
  image: string;
  status: string;
  isEmailVerified: boolean
}

export default function EditUserPage() {
  console.log("EDIT USER PAGE")
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get('userId');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!userId) {
      router.push('/admin');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
        setRole(data.role);
        setStatus(data.status);
      } catch (error) {
        console.error('Error fetching user: ', error);
        toast.error("Error", {
          description: 'Failed to fetch user data. ' + JSON.stringify(error),
          duration: 5000,
        })
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleRoleChange = (event: ChangeEvent) => {
    setRole(((event.target) as HTMLInputElement).value);
  };

  const handleStatusChange = (event: ChangeEvent) => {
    setStatus(((event.target) as HTMLInputElement).value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role,
          status
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json()
      toast.success("Success", {
        description: data.message,
        duration: 5000,
      })
      // router.push('/admin/users');
    } catch (error) {
      console.error('Error updating user: ', error);
      toast.error("Error", {
        description: 'Failed to update user. ' + JSON.stringify(error),
        duration: 5000,
      })
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-4">User not found.</div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400">
            Name
          </label>
          <label id="name" className="block text-lg font-medium text-gray-100">
            {user.name}
          </label>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400">
            Email
          </label>
          <label id="email" className="block text-lg font-medium text-gray-100">
            {user.email}
          </label>
        </div>
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-400">
            Provider
          </label>
          <label id="provider" className="block text-lg font-medium text-gray-100">
            {user.provider}
          </label>
        </div>
        <div>
          <label htmlFor="createdAt" className="block text-sm font-medium text-gray-400">
            Created At
          </label>
          <label id="createdAt" className="block text-lg font-medium text-gray-100">
            {new Date(user.createdAt).toLocaleString()}
          </label>
        </div>
        <div>
          <label htmlFor="isEmailVerified" className="block text-sm font-medium text-gray-400">
            Is Email Verified
          </label>
          <label id="isEmailVerified" className="block text-lg font-medium text-gray-100">
            {user.isEmailVerified ? "YES" : "NO"}
          </label>
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-400">
            Role
          </label>
          <Select
            id="role"
            value={role}
            onChange={handleRoleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </Select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-400">
            Status
          </label>
          <Select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
        <Button type="submit" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
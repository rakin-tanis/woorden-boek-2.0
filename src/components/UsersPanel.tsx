'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import Pagination from "@/components/ui/Pagination";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ConfirmModal from './ui/ConfirmModal';
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
}

export default function UserPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState('');
  const itemsPerPage = 10;

  // Create query string from params
  const createQueryString = (params: Record<string, string | number>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    for (const [key, value] of Object.entries(params)) {
      if (value === '') {
        current.delete(key);
      } else {
        current.set(key, value.toString());
      }
    }

    return current.toString();
  };

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const queryString = createQueryString({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm
      });
      const response = await fetch(`/api/users?${queryString}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setUsers(data.users);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Error", {
        description: 'Error fetching users. ' + JSON.stringify(error),
        duration: 5000,
      })
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    router.push(
      `${pathname}?${createQueryString({
        search: value,
        page: 1
      })}`
    );
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/users?userId=${userToDeleteId}`, {
        method: 'DELETE',
      });
      fetchUsers(); // Refetch users after deletion
      setShowDeleteModal(false);
      const data = await response.json()
      toast.success("Success", {
        description: data.message,
        duration: 5000,
      })
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: 'Error deleting user. ' + JSON.stringify(error),
        duration: 5000,
      })
    }
  };

  const deleteUser = (userId: string) => {
    if (userId === session!.user.id) return
    setUserToDeleteId(userId);
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Input
          type="search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user._id} className={`${index % 2 === 0 ? "dark:bg-gray-800 bg-gray-200" : "dark:bg-gray-950 bg-white"}`}>
                    {/* <TableCell>
                    {user.image ? <Image src={user.image} alt='user image' width={40} height={40} className='w-10' /> : <CircleUser />}
                  </TableCell> */}
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.provider}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Link
                        className={`hover:border-b-2 hover:border-b-blue-400 text-blue-900 dark:text-blue-400 ${user._id === session?.user.id ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
                        href={user._id === session!.user.id ? '#' : `/admin/user?userId=${user._id}`}
                        aria-disabled={user._id === session!.user.id}
                      >
                        {"Edit"}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <a
                        className={`hover:border-b-2 hover:border-b-blue-400 text-blue-900 dark:text-blue-400 ${user._id === session?.user.id ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
                        onClick={() => deleteUser(user._id)}
                      >
                        {"Delete"}
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center h-24"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination
              total={total}
              page={page}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange} />
          </div>
          {/* Delete Modal */}
          <ConfirmModal
            showConfirmModal={showDeleteModal}
            confirmText={'Are you sure you want to delete this user?'}
            handleDeleteConfirm={handleDeleteConfirm}
            handleDeleteCancel={() => setShowDeleteModal(false)} />
        </>
      )}
    </div>
  );
}

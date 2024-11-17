"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/UseDebounce';
import ExamplesDataTable from './ExamplesDataTable';
import { Example } from '@/types';
import ConfirmModal from './ui/ConfirmModal';
import EditExample from './EditExample';
import { toast } from 'sonner';

interface FilterState {
  source: string[];
  level: string[];
  theme: string[];
  status: string[];
}

interface ExamplesResponse {
  data: Example[];
  total: number;
  filters: {
    sources: string[];
    levels: string[];
    themes: string[];
    statuses: string[];
  };
}

const ExamplesPanel: React.FC = () => {
  const [data, setData] = useState<Example[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    source: [],
    level: [],
    theme: [],
    status: []
  });
  const [availableFilters, setAvailableFilters] = useState({
    sources: [],
    levels: [],
    themes: [],
    statuses: []
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exampleToDeleteId, setExampleToDeleteId] = useState('');
  const [editExampleItem, setEditExampleItem] = useState<Example | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const itemsPerPage = 30;

  const fetchData = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search: debouncedSearch,
      });

      // Add multiple values for each filter
      filters.source.forEach(value => queryParams.append('source', value));
      filters.level.forEach(value => queryParams.append('level', value));
      filters.theme.forEach(value => queryParams.append('theme', value));
      filters.status.forEach(value => queryParams.append('status', value));

      const response = await fetch(`/api/words?${queryParams}`);
      const json: ExamplesResponse = await response.json();

      setData(json.data);
      setTotal(json.total);
      setAvailableFilters(json.filters);
    } catch (error) {
      console.error('Failed to fetch examples:', error);
      toast.error("Error", {
        description: 'Failed to fetch examples: ' + JSON.stringify(error),
        duration: 5000,
      })
    }
  }, [page, debouncedSearch, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setPage(1);
  };

  const handleFilterChange = (filterName: string, values: string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: values
    }));
    setPage(1);
  };

  const editExample = (example: Example) => {
    setEditExampleItem(example)
    setShowEditModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/words?exampleId=${exampleToDeleteId}`, {
        method: 'DELETE',
      });
      fetchData(); // Refetch users after deletion
      setShowDeleteModal(false);
      const data = await response.json()
      toast.success("Success", {
        description: data.message,
        duration: 5000,
      })
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: 'Error adding example: ' + JSON.stringify(error),
        duration: 5000,
      })
    }
  };

  const deleteExample = (exampleId?: string) => {
    if (!exampleId) return
    setExampleToDeleteId(exampleId);
    setShowDeleteModal(true);
  };

  const handleSaveExample = async (example: Example) => {
    if (example._id) {
      updateExample(example);
    } else {
      createExample(example);
    }
  };

  const updateExample = async (updatedExample: Example) => {
    try {
      const { _id, ...body } = updatedExample;
      // API call to update the example
      const response = await fetch(`/api/words/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to update example');
      }

      fetchData();
      // Close the edit mode
      setEditExampleItem(null);
      setShowEditModal(false);
      const data = await response.json()
      toast.success("Success", {
        description: data.message,
        duration: 5000,
      })
    } catch (error) {
      console.error('Error updating example:', error);
      toast.error("Error", {
        description: 'Error updating example: ' + JSON.stringify(error),
        duration: 5000,
      })
    }
  }

  const createExample = async (newExample: Example) => {
    try {
      // API call to add the example
      const response = await fetch(`/api/words/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExample),
      });

      if (!response.ok) {
        throw new Error('Failed to add example');
      }

      fetchData();
      // Close the edit mode
      setEditExampleItem(null);
      setShowEditModal(false);
      const data = await response.json()
      toast.success("Success", {
        description: data.message,
        duration: 5000,
      })
    } catch (error) {
      console.error('Error adding example:', error);
      toast.error("Error", {
        description: 'Error adding example: ' + JSON.stringify(error),
        duration: 5000,
      })
    }
  }

  const handleCancelEdit = () => {
    setEditExampleItem(null);
    setShowEditModal(false);
  };

  return (
    <div className='p-4'>
      <ExamplesDataTable
        data={data}
        total={total}
        page={page}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        filters={availableFilters}
        currentFilters={filters}
        editExample={editExample}
        deleteExample={deleteExample}
        addNewExample={() => setShowEditModal(true)}
      />
      <EditExample
        showEditModal={showEditModal}
        example={editExampleItem}
        onSave={handleSaveExample}
        onCancel={handleCancelEdit} />
      {/* Delete Modal */}
      <ConfirmModal
        showConfirmModal={showDeleteModal}
        confirmText={'Are you sure you want to delete this example?'}
        handleDeleteConfirm={handleDeleteConfirm}
        handleDeleteCancel={() => setShowDeleteModal(false)} />
    </div>
  );
};

export default ExamplesPanel;
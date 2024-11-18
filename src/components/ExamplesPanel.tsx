"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/UseDebounce';
import ExamplesDataTable from './ExamplesDataTable';
import { Example } from '@/types';
import ConfirmModal from './ui/ConfirmModal';
import EditExample from './EditExample';
import { toast } from 'sonner';
import { Modal } from './ui/Modal';

interface FilterState {
  source: string[];
  level: string[];
  theme: string[];
  status: string[];
}

interface AvailableFilters {
  sources: string[];
  levels: string[];
  themes: string[];
  statuses: string[];
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
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters>({
    sources: [],
    levels: [],
    themes: [],
    statuses: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exampleToDeleteId, setExampleToDeleteId] = useState('');
  const [exampleToEdit, setExampleToEdit] = useState<Example | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const itemsPerPage = 30;

  const fetchData = useCallback(async () => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
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
    setExampleToEdit(example)
    setIsModalOpen(true);
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
    setIsUpdateLoading(true);
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
      setExampleToEdit(undefined);
      setIsModalOpen(false)
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
    } finally {
      setIsUpdateLoading(false);
    }
  }

  const createExample = async (newExample: Example) => {
    setIsUpdateLoading(true);
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
      setExampleToEdit(undefined);
      setIsModalOpen(false)
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
    } finally {
      setIsUpdateLoading(false);
    }
  }

  const handleCancelEdit = () => {
    setExampleToEdit(undefined);
    setIsModalOpen(false)
  };

  const addNewExample = () => {
    setExampleToEdit(undefined)
    setIsModalOpen(true)
  }

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
        addNewExample={addNewExample}
        isLoading={isLoading}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bgBlur={false}
      >
        <EditExample
          example={exampleToEdit}
          isLoading={isUpdateLoading}
          onSave={handleSaveExample}
          onCancel={handleCancelEdit} />
      </Modal>

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
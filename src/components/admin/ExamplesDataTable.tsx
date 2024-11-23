"use client"

import React, { useState } from 'react';
import { Search, X, Plus, Files } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { MultiSelect, Option } from '@/components/ui/MultiSelect';
import HighlightText from '../ui/HighlightText';
import Pagination from '../ui/Pagination';
import { Example } from '@/types';

interface ExamplesTableProps {
  data: Example[];
  total: number;
  page: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onFilterChange: (filter: string, values: string[]) => void;
  filters: {
    sources: string[];
    levels: string[];
    themes: string[];
    statuses: string[];
  };
  currentFilters: {
    source: string[];
    level: string[];
    theme: string[];
    status: string[];
  };
  editExample: (example: Example) => void;
  deleteExample: (exampleId?: string) => void;
  addNewExample: () => void
  isLoading: boolean
}

const ExamplesDataTable: React.FC<ExamplesTableProps> = ({
  data,
  total,
  page,
  itemsPerPage,
  onPageChange,
  onSearchChange,
  onFilterChange,
  filters,
  currentFilters,
  editExample,
  deleteExample,
  addNewExample,
  isLoading,
}) => {
  const [searchText, setSearchText] = useState('')

  const sourceOptions: Option[] = filters.sources.map(source => ({
    label: source.charAt(0).toUpperCase() + source.slice(1),
    value: source
  }));

  const levelOptions: Option[] = filters.levels.map(level => ({
    label: level.toUpperCase(),
    value: level
  }));

  const themeOptions: Option[] = filters.themes.map(theme => ({
    label: theme.toUpperCase(),
    value: theme
  }));

  const statusOptions: Option[] = filters.statuses.map(status => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value: status
  }));

  const watchSearchText = (searchString: string) => {
    onSearchChange(searchString)
    setSearchText(searchString)
  }

  const clearSearch = () => {
    setSearchText('')
    onSearchChange('')
  }

  return (
    <div className="w-full space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64 max-w-5xl">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search in Dutch or Turkish..."
              className="pl-8 text-gray-900 font-bold"
              value={searchText}
              onChange={(e) => watchSearchText(e.target.value)}
            />
            {searchText && (
              <X
                className="absolute right-2 top-3 h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={clearSearch}
              />
            )}
            {/* Copy Button with Tooltip */}
            <div className="absolute -right-14 -top-1 group" data-tooltip-target="copy-tooltip">
              <button
                className="p-2 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                onClick={() => {
                  if (searchText) {
                    navigator.clipboard.writeText(searchText);
                    toast.success('Copied to clipboard', {
                      description: `"${searchText}" has been copied`,
                      duration: 2000,
                    });
                  }
                }}
                disabled={!searchText}
              >
                <Files className="h-8 w-8" />
              </button>
              {/* Tooltip */}
              <div
                className="absolute z-10 w-28 mx-auto invisible group-hover:visible 
                         bg-gray-800 text-white text-xs 
                         px-2 py-1 rounded -top-4 left-1/2 transform -translate-x-1/2
                         transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                Copy search text
              </div>
            </div>
            {/* Add Example Button */}
            <button
              className="absolute -right-56 top-0 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={addNewExample}
            >
              <div className='flex flex-row gap-2 items-center'>
                <Plus className="h-4 w-4" />
                <span>New Example</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="w-48">
          <MultiSelect
            options={sourceOptions}
            selected={currentFilters.source}
            onChange={(values) => onFilterChange('source', values)}
            placeholder="Select sources"
          />
        </div>

        <div className="w-48">
          <MultiSelect
            options={levelOptions}
            selected={currentFilters.level}
            onChange={(values) => onFilterChange('level', values)}
            placeholder="Select levels"
          />
        </div>

        <div className="w-48">
          <MultiSelect
            options={themeOptions}
            selected={currentFilters.theme}
            onChange={(values) => onFilterChange('theme', values)}
            placeholder="Select themes"
          />
        </div>

        <div className="w-48">
          <MultiSelect
            options={statusOptions}
            selected={currentFilters.status}
            onChange={(values) => onFilterChange('status', values)}
            placeholder="Select statuses"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="border rounded-lg">
          <Table className='rounded-xl bg-gray-50 dark:bg-gray-900'>
            <TableHeader>
              <TableRow className='hover:dark:bg-transparent hover:bg-transparent'>
                <TableHead>Dutch</TableHead>
                <TableHead>Turkish</TableHead>
                <TableHead>Words</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item._id} className={`text-gray-950 dark:text-white 
                ${index % 2 === 0 
                ? "hover:dark:bg-gray-600 hover:bg-gray-200 dark:bg-gray-700 bg-gray-100" 
                : "hover:dark:bg-gray-600 hover:bg-gray-200 dark:bg-gray-900 bg-white"}`}>
                  <TableCell>
                    <HighlightText targetText={item.dutch} searchText={searchText} />
                  </TableCell>
                  <TableCell>
                    <HighlightText targetText={item.turkish} searchText={searchText} />
                  </TableCell>
                  <TableCell>
                    <HighlightText targetText={item.words.join(', ')} searchText={searchText} />
                  </TableCell>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>{item.level}</TableCell>
                  <TableCell>{item.theme}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-sm 
                  ${item.status === 'published'
                        ? 'bg-green-600 text-white'
                        : 'bg-yellow-100 text-gray-800'}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <a
                      className={`cursor-pointer hover:border-b-2 hover:shadow-sm text-blue-900 dark:text-blue-400`}
                      onClick={() => editExample(item)}
                    >
                      {"Edit"}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a
                      className={`cursor-pointer hover:border-b-2 hover:shadow-sm text-blue-900 dark:text-blue-400`}
                      onClick={() => deleteExample(item._id)}
                    >
                      {"Delete"}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        total={total}
        page={page}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange} />
    </div>
  );
};

export default ExamplesDataTable;
'use client';

import React, { FC } from 'react';
import { FilterState } from '@/types/filters';

interface CourtFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const CourtFilters: FC<CourtFiltersProps> = ({ filters, onFilterChange }) => {
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, query: e.target.value });
  };

  const handleSurfaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const surfaces = value ? [value] : [];
    onFilterChange({ ...filters, surface: surfaces });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const types = value ? [value] : [];
    onFilterChange({ ...filters, type: types });
  };

  const handleBooleanChange = (field: keyof Pick<FilterState, 'lighted' | 'indoor' | 'reservable'>) => 
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onFilterChange({ ...filters, [field]: value === '' ? undefined : value === 'true' });
    };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          type="text"
          value={filters.query}
          onChange={handleQueryChange}
          placeholder="Search courts..."
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Surface</label>
          <select
            value={filters.surface[0] || ''}
            onChange={handleSurfaceChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="">All Surfaces</option>
            <option value="hard">Hard</option>
            <option value="clay">Clay</option>
            <option value="grass">Grass</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={filters.type[0] || ''}
            onChange={handleTypeChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="">All Types</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lighted</label>
          <select
            value={filters.lighted === undefined ? '' : filters.lighted.toString()}
            onChange={handleBooleanChange('lighted')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Indoor</label>
          <select
            value={filters.indoor === undefined ? '' : filters.indoor.toString()}
            onChange={handleBooleanChange('indoor')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reservable</label>
          <select
            value={filters.reservable === undefined ? '' : filters.reservable.toString()}
            onChange={handleBooleanChange('reservable')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CourtFilters;

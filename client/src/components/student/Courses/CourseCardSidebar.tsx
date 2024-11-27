/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type FilterProps = {
  categories: string[];
  levels: string[];
  onFilterChange: (filter: any) => void; // Callback to send selected filters to the parent
};

const Sidebar: React.FC<FilterProps> = ({ categories, levels, onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = React.useState<string | null>(null);
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);

  const handleFilterChange = () => {
    onFilterChange({
      category: selectedCategory,
      level: selectedLevel,
      rating: selectedRating,
    });
  };

  return (
    <div className="w-64 p-4 border-r bg-gray-50 h-screen">
      <h2 className="font-bold text-lg mb-4">Filters</h2>

      {/* Category Filter */}
      <div className="mb-4">
        <h3 className="font-medium text-gray-700">Category</h3>
        <select
          className="w-full p-2 mt-2 border rounded"
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            handleFilterChange();
          }}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Level Filter */}
      <div className="mb-4">
        <h3 className="font-medium text-slategray">Level</h3>
        <select
          className="w-full p-2 mt-2 border rounded"
          onChange={(e) => {
            setSelectedLevel(e.target.value);
            handleFilterChange();
          }}
        >
          <option value="">All Levels</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-medium text-gray">Customer Ratings</h3>
        <select
          className="w-full p-2 mt-2 border rounded"
          onChange={(e) => {
            setSelectedRating(Number(e.target.value));
            handleFilterChange();
          }}
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating} Stars & Up
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Sidebar;

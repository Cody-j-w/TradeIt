// app/search
'use client'

import React, { useState, useEffect } from "react";
import SearchIcon from "@/assets/search2.svg";
import Image from "next/image";

interface SearchResult {
  id: number;
  name: string;
  category: string;
  price: number;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [resultCount, setResultCount] = useState(0);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value);
  };

  const handleSearch = async () => {
    console.log("Searching for:", searchTerm);
    console.log("Filter:", filter);
    console.log("Sort:", sort);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const simulatedResults = simulateSearchResults(searchTerm, filter, sort);
    setSearchResults(simulatedResults);
    setResultCount(simulatedResults.length);
  };

  const simulateSearchResults = (searchTerm: string, filter: string, sort: string): SearchResult[] => {
    let results: SearchResult[] = [
      { id: 1, name: "Product A", category: "category1", price: 10 },
      { id: 2, name: "Product B", category: "category2", price: 20 },
      { id: 3, name: "Product C", category: "category1", price: 15 },
      { id: 4, name: "Product D", category: "category2", price: 25 },
      { id: 5, name: "Product E", category: "category1", price: 5 },
      { id: 6, name: "Product F", category: "category2", price: 30 },
    ];

    if (filter) {
      results = results.filter((item) => item.category === filter);
    }

    if (sort === "price_asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      results.sort((a, b) => b.price - a.price);
    }

    if (searchTerm) {
      results = results.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return results;
  };

  return (
    <div className="p-4">
      <div className="flex items-center bg-trade-white mb-4 border rounded-md p-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-grow border-none focus:outline-none"
        />
        <button onClick={handleSearch} className="text-gray-500">
          <Image src={SearchIcon} alt="Search Icon" width={24} height={24} />
        </button>
      </div>

      <div className="flex space-x-2 mb-4">
        <div className="relative">
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="border rounded-md p-2 pr-6 appearance-none bg-trade-white"
          >
            <option value="">Filter</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            {/* Add more filter options here */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707 0.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            id="sort"
            value={sort}
            onChange={handleSortChange}
            className="border rounded-md appearance-none p-2 pr-8 bg-trade-white"
          >
            <option value="">Sort</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            {/* Add more sort options here */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707 0.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center">
          <p className="text-gray-600">{resultCount} results</p>
        </div>
      </div>

      {/* Placeholder for search results */}
      <div>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result) => (
              <li key={result.id}>{result.name} - ${result.price}</li>
            ))}
          </ul>
        ) : (
          <p>Search results will appear here.</p>
        )}
      </div>
    </div>
  );
}
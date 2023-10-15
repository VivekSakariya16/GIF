"use client";

import React, { useState } from 'react';
import axios from 'axios';

interface Image {
  id: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
    };
  };
}

export default function HomePage() {
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3); // Set the limit to 3 GIFs per page
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  // Replace with your Giphy API key
  const API_KEY = 'Y3x3aKefFhP1wKORTLi9vNZsE425poS2';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to the first page when searching
    if (searchTerm) {
      axios
        .get(`https://api.giphy.com/v1/gifs/search`, {
          params: {
            api_key: API_KEY,
            q: searchTerm,
            limit: limit,
            offset: 0,
          },
        })
        .then((response) => {
          setImages(response.data.data);
          setTotalPages(Math.ceil(response.data.pagination.total_count / limit));
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
        });
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      axios
        .get(`https://api.giphy.com/v1/gifs/search`, {
          params: {
            api_key: API_KEY,
            q: searchTerm,
            limit: limit,
            offset: (newPage - 1) * limit,
          },
        })
        .then((response) => {
          setImages(response.data.data);
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg p-8 shadow-md search-bar w-96">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="border border-black rounded-l p-4 w-3/4 focus:outline-none focus:shadow-outline-black text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-black text-white rounded-r p-4 ml-2 focus:outline-none focus:shadow-outline-black"
          >
            Search
          </button>
        </div>
      </div>
      {images.length > 0 && (
        <div className="w-full max-w-6xl mt-8">
          <div className="grid grid-cols-3 gap-4">
            {images.map((image) => (
              <img key={image.id} src={image.images.fixed_height.url} alt={image.title} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="mr-4 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Previous
              </button>
              <span className="px-2 py-1 text-blue-500 text-lg">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-2 py-1 bg-blue-500 text-white rounded hover-bg-blue-600"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

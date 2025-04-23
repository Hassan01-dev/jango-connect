// src/components/FriendRequest.tsx
import { useState, useEffect } from 'react';
import { 
  useGetNonFriendsListQuery,
  useSendFriendRequestMutation,
} from '@/store/friendRequestsApi';

export const FriendRequest = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { 
    data, 
    isLoading, 
    isError 
  } = useGetNonFriendsListQuery({
    page,
    limit: 10,
    search: debouncedSearch
  });

  const [sendFriendRequest, { isLoading: isSending }] = useSendFriendRequestMutation();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle request responses
  const handleSendRequest = async (userId: string) => {
    try {
      await sendFriendRequest({ userId }).unwrap();
    } catch (err) {
      console.error('Failed to send friend request:', err);
    }
  };

  return (
    <div className="friend-request-container p-4">
      <h1 className="text-2xl font-bold mb-6">Friend Requests</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or username..."
          className="p-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {isLoading && <div className="text-center py-4">Loading friend requests...</div>}

      {/* Error State */}
      {isError && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          Error loading friend requests. Please try again.
        </div>
      )}

      {/* No Results */}
      {!isLoading && data?.data.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No friend requests found.
        </div>
      )}

      {/* Friend Request List */}
      {data?.data.map((request) => (
        <div 
          key={request.id} 
          className="border rounded-lg p-4 mb-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            {request.profileImage ? (
              <img 
                src={request.profileImage} 
                alt={request.name} 
                className="w-12 h-12 rounded-full mr-4" 
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
                {request.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-medium">{request.name}</h3>
              <p className="text-sm text-gray-500">@{request.username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSendRequest(request.id)}
              disabled={isSending}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 mx-1">
            Page {page} of {data.pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === data.pagination.totalPages}
            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FriendRequest;
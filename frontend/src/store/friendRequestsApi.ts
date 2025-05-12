import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PaginatedRequestParams, PaginatedResponse} from "@/types/pagination";
import { FriendRequest, User } from "@/types/api"

const API_URL = `${import.meta.env.VITE_API_URL}/friends/`

export const friendRequestsApi = createApi({
  reducerPath: 'friendRequestsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('X-AUTH-TOKEN', token);
      }
      return headers;
    }
  }),
  tagTypes: ['FriendRequests'],
  endpoints: (builder) => ({
    getReceivedFriendRequests: builder.query<PaginatedResponse<FriendRequest>, PaginatedRequestParams>({
      query: (params = {}) => ({
        url: '/received_requests',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
        },
      }),

      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'FriendRequests' as const, id })),
              { type: 'FriendRequests', id: 'LIST' },
            ]
          : [{ type: 'FriendRequests', id: 'LIST' }],
    }),
    
    getNonFriendsList: builder.query<PaginatedResponse<User>, PaginatedRequestParams>({
      query: (params = {}) => ({
        url: '/non_friends',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
        },
      }),

      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'FriendRequests' as const, id })),
              { type: 'FriendRequests', id: 'LIST' },
            ]
          : [{ type: 'FriendRequests', id: 'LIST' }],
    }),

    getFriendsList: builder.query<PaginatedResponse<User>, PaginatedRequestParams>({
      query: (params = {}) => ({
        url: '/list',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
        },
      }),

      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'FriendRequests' as const, id })),
              { type: 'FriendRequests', id: 'LIST' },
            ]
          : [{ type: 'FriendRequests', id: 'LIST' }],
    }),

    sendFriendRequest: builder.mutation<{ message: string }, { userId: string }>({
      query: (data) => ({
        url: '/send_request',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FriendRequests'],
    }),

    approveFriendRequest: builder.mutation<{ message: string }, { friendRequestId: string }>({
      query: (data) => ({
        url: '/approve_request',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['FriendRequests'],
    }),
    
    rejectFriendRequest: builder.mutation<{ message: string }, { friendRequestId: string }>({
      query: (data) => ({
        url: '/reject_request',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['FriendRequests'],
    }),

    removeFriend: builder.mutation<{ message: string }, { userId: string }>({
      query: (data) => ({
        url: '/remove',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['FriendRequests'],
    }),
  }),
});

export const { 
  useGetReceivedFriendRequestsQuery,
  useGetNonFriendsListQuery,
  useGetFriendsListQuery,
  useSendFriendRequestMutation,
  useApproveFriendRequestMutation,
  useRejectFriendRequestMutation,
  useRemoveFriendMutation
} = friendRequestsApi;
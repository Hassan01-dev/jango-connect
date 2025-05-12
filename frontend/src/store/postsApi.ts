import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PaginatedRequestParams, PaginatedResponse} from "@/types/pagination";
import { Post } from "@/types/api"

const API_URL = `${import.meta.env.VITE_API_URL}/posts`

export const postApi = createApi({
  reducerPath: 'postsApi',
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
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    getPosts: builder.query<PaginatedResponse<Post>, PaginatedRequestParams>({
      query: (params = {}) => ({
        url: '/list',
        params: {
          page: params.page || 1,
          limit: params.limit || 5,
        },
      }),

      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Posts' as const, id })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    

    // sendFriendRequest: builder.mutation<{ message: string }, { userId: string }>({
    //   query: (data) => ({
    //     url: '/send_request',
    //     method: 'POST',
    //     body: data,
    //   }),
    //   invalidatesTags: ['FriendRequests'],
    // }),

    // approveFriendRequest: builder.mutation<{ message: string }, { friendRequestId: string }>({
    //   query: (data) => ({
    //     url: '/approve_request',
    //     method: 'PATCH',
    //     body: data,
    //   }),
    //   invalidatesTags: ['FriendRequests'],
    // }),
    
    // rejectFriendRequest: builder.mutation<{ message: string }, { friendRequestId: string }>({
    //   query: (data) => ({
    //     url: '/reject_request',
    //     method: 'PATCH',
    //     body: data,
    //   }),
    //   invalidatesTags: ['FriendRequests'],
    // }),

    // removeFriend: builder.mutation<{ message: string }, { userId: string }>({
    //   query: (data) => ({
    //     url: '/remove',
    //     method: 'DELETE',
    //     body: data,
    //   }),
    //   invalidatesTags: ['FriendRequests'],
    // }),
  }),
});

export const { 
  useGetPostsQuery,
  // useSendFriendRequestMutation,
  // useApproveFriendRequestMutation,
  // useRejectFriendRequestMutation,
  // useRemoveFriendMutation
} = postApi
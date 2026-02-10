import './App.css'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import axios from 'axios'

export default function App() {
  const [formVisible, setFormVisible] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const [form, setForm] = useState({
    title: '',
    content: '',
    likes: 0,
    dislikes: 0,
  })

  const truncate = (text, limit) => {
    if (!text) return ''
    return text.length > limit
      ? text.slice(0, limit) + '...'
      : text
  }

  // Fetch blogs
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await axios.get(
        'http://localhost:8000/blog/'
      )
      return response.data
    },
  })

  // Create blog
  const postMutation = useMutation({
    mutationFn: async (newBlog) => {
      const response = await axios.post(
        'http://localhost:8000/blog/',
        newBlog
      )
      return response.data
    },
    onSuccess: () => {
      refetch()
      setForm({
        title: '',
        content: '',
        likes: 0,
        dislikes: 0,
      })
      setFormVisible(false)
    },
  })

  // Delete blog
  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      await axios.delete(
        `http://localhost:8000/blog/${postId}/`
      )
    },
    onSuccess: () => {
      refetch()
    },
  })

  const likeMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await axios.patch(
        `http://localhost:8000/blog/${postId}/`,
        { likes: 1 }
      )
      return response.data
    },
    onSuccess: () => {
      refetch()
    },
  })

  // Dislike blog
  const dislikeMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await axios.patch(
        `http://localhost:8000/blog/${postId}/`,
        { dislikes: 1 }
      )
      return response.data
    },
    onSuccess: () => {
      refetch()
    },
  })


  return (
    <div className="container">
      <h1 className="heading">Welcome to the Blog</h1>

      {isLoading && (
        <p className="info">Loading posts...</p>
      )}

      {error && (
        <p className="error">
          Error loading posts: {error.message}
        </p>
      )}

      {/* Toggle form */}
      <button
        className="primary-btn"
        onClick={() => setFormVisible(!formVisible)}
      >
        {formVisible ? 'Close Form' : 'Add New Blog'}
      </button>

      {/* Blog Form */}
      {formVisible && (
        <div className="form-container">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) =>
              setForm({
                ...form,
                content: e.target.value,
              })
            }
          />

          <button
            className="submit-btn"
            onClick={() => postMutation.mutate(form)}
            disabled={postMutation.isLoading}
          >
            {postMutation.isLoading
              ? 'Posting...'
              : 'Post'}
          </button>
        </div>
      )}

      {/* Blog List */}
      <ul className="post-list">
        {data?.map((blog) => {
          const isExpanded = expandedId === blog.id

          return (
            <li
              key={blog.id}
              className={`post-item ${isExpanded ? 'expanded' : ''
                }`}
              onClick={() =>
                setExpandedId(
                  isExpanded ? null : blog.id
                )
              }
            >
              {/* Header */}
              <div className="post-header">
                <h2>
                  {isExpanded
                    ? blog.title
                    : truncate(blog.title, 10)}
                </h2>

                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteMutation.mutate(blog.id)
                  }}
                  disabled={deleteMutation.isLoading}
                >
                  {deleteMutation.isLoading
                    ? 'Deleting...'
                    : 'Delete'}
                </button>
              </div>

              {/* Content */}
              <p className="post-content">
                {isExpanded
                  ? blog.content
                  : truncate(blog.content, 25)}
              </p>

              {/* Footer */}
              {/* Footer */}
              <div
                className="post-footer"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="like-btn"
                  onClick={() =>
                    likeMutation.mutate(blog.id)
                  }
                >
                  <ThumbsUp size={16} /> {blog.likes}
                </button>

                <button
                  className="dislike-btn"
                  onClick={() =>
                    dislikeMutation.mutate(blog.id)
                  }
                >
                  <ThumbsDown size={16} />{' '}
                  {blog.dislikes}
                </button>
              </div>

            </li>
          )
        })}
      </ul>
    </div>
  )
}

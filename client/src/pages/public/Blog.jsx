import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cmsAPI } from '../../services/api';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [activeCategory, searchTerm]);

  const fetchBlogs = async () => {
    try {
      const params = {};
      if (activeCategory !== 'all') params.category = activeCategory;
      if (searchTerm) params.search = searchTerm;
      const res = await cmsAPI.getBlogs(params);
      setBlogs(res.data.data || []);
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await cmsAPI.getBlogCategories();
      setCategories(['all', ...(res.data.data || [])]);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const filteredPosts = blogs;

  return (
    <div className="blog-page py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="mb-3">Our <span className="text-gradient">Blog</span></h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Explore our collection of articles on mental health topics, written by our expert counsellors to help you understand and manage your mental wellbeing.
          </p>
        </div>

        {/* Blog Filters */}
        <div className="filter-container mb-5">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Search Bar */}
        <div className="mb-5">
          <div className="search-bar">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Blog Posts */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="row g-4">
            {filteredPosts.map(post => (
              <div className="col-md-6 col-lg-4" key={post._id}>
                <div className="card blog-card h-100 border-0 shadow-sm">
                  <div className="blog-image-wrapper">
                    <img src={post.featuredImage || 'https://placehold.co/400x300?text=Blog'} alt={post.title} className="card-img-top" />
                    <div className="blog-category">{post.categories?.[0] || 'General'}</div>
                  </div>
                  <div className="card-body p-4">
                    <div className="blog-meta mb-2">
                      <span><i className="bi bi-person me-1"></i> {post.author?.name || 'Admin'}</span>
                      <span><i className="bi bi-clock me-1"></i> {post.readTime || '5'} min</span>
                    </div>
                    <h5 className="card-title mb-3">{post.title}</h5>
                    <p className="card-text text-muted">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="blog-link">
                      Read More <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                  <div className="card-footer bg-white border-0 p-4 pt-0">
                    <small className="text-muted">
                      <i className="bi bi-calendar3 me-1"></i> {new Date(post.publishedAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
            <h3>No Results Found</h3>
            <p className="text-muted">We couldn't find any posts matching your search criteria.</p>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}



        {/* Newsletter Section */}
        <div className="newsletter-section rounded-4 p-5 mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card newsletter-card border-0 shadow-sm">
                <div className="card-body p-4 text-center">
                  <div className="newsletter-icon mb-4">
                    <i className="bi bi-envelope-paper"></i>
                  </div>
                  <h3 className="mb-3">Subscribe to Our Newsletter</h3>
                  <p className="text-muted mb-4">
                    Stay updated with our latest articles, tips, and resources on mental health and wellbeing.
                  </p>
                  <form className="row g-3 justify-content-center">
                    <div className="col-md-8">
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="Your email address"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <button type="submit" className="btn btn-primary btn-lg w-100">
                        Subscribe
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
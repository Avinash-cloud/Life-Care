import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cmsAPI } from '../../services/api';
import SEOHead from '../../components/shared/SEOHead';
import { parseBlogContent, getBlogPlainText } from '../../utils/blogContentParser';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [copied, setCopied] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    fetchBlogData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchBlogData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cmsAPI.getBlog(id);
      const blogData = res.data.data;
      setBlog(blogData);

      // Fetch related blogs (by category or recent)
      try {
        const category = blogData.categories?.[0];
        const params = { limit: 4 };
        if (category && category.toLowerCase() !== 'all') {
          params.category = category;
        }
        const relRes = await cmsAPI.getBlogs(params);
        const related = (relRes.data.data || [])
          .filter(b => b._id !== blogData._id && b.slug !== blogData.slug)
          .slice(0, 3);
        
        // If not enough related from category, fetch recent
        if (related.length === 0) {
          const generalRes = await cmsAPI.getBlogs({ limit: 4 });
          const generalRelated = (generalRes.data.data || [])
            .filter(b => b._id !== blogData._id && b.slug !== blogData.slug)
            .slice(0, 3);
          setRelatedBlogs(generalRelated);
        } else {
          setRelatedBlogs(related);
        }
      } catch (relErr) {
        console.warn('Could not fetch related articles:', relErr);
      }
    } catch (err) {
      console.error('Failed to load blog:', err);
      setError(err.response?.data?.message || 'The article you are looking for does not exist or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const defaultImage = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80';

  // Loading State
  if (loading) {
    return (
      <div className="single-blog-page py-5">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-muted fw-normal">Loading article...</h4>
        </div>
      </div>
    );
  }

  // Error / Not Found State
  if (error || !blog) {
    return (
      <div className="single-blog-page py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 text-center">
              <div className="card border-0 shadow-sm rounded-4 p-5">
                <div className="mb-4 text-warning">
                  <i className="bi bi-exclamation-circle" style={{ fontSize: '4rem' }}></i>
                </div>
                <h2 className="fw-bold mb-3">Article Not Found</h2>
                <p className="text-muted mb-4">
                  {error || "We couldn't find the article you requested. It might have been updated, moved, or deleted."}
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <button onClick={() => navigate(-1)} className="btn btn-outline-secondary px-4 py-2">
                    <i className="bi bi-arrow-left me-2"></i> Go Back
                  </button>
                  <Link to="/blog" className="btn btn-primary px-4 py-2">
                    Browse All Articles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate read time if not provided
  const calculateReadTime = () => {
    if (blog.readTime) return blog.readTime;
    const plainText = getBlogPlainText(blog.content);
    const words = plainText.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="single-blog-page pb-5">
      {/* Dynamic SEO Meta */}
      <SEOHead
        title={blog.metaTitle || blog.title}
        description={blog.metaDescription || blog.excerpt || (blog.content ? getBlogPlainText(blog.content).substring(0, 160) : '') || 'Read this insightful article on mental health and psychological wellbeing.'}
        keywords={blog.metaKeywords || (blog.tags && blog.tags.join(', '))}
        image={blog.featuredImage || defaultImage}
        url={`/blog/${blog.slug || blog._id}`}
        author={blog.author?.name || 'SS Psych Life Care'}
        publishedTime={blog.publishedAt || blog.createdAt}
        modifiedTime={blog.updatedAt}
        type="article"
      />

      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">
                <i className="bi bi-house-door me-1"></i>Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/blog" className="text-decoration-none text-muted">
                Blog
              </Link>
            </li>
            {blog.categories?.[0] && (
              <li className="breadcrumb-item text-muted">
                {blog.categories[0]}
              </li>
            )}
            <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '300px' }} aria-current="page">
              {blog.title}
            </li>
          </ol>
        </nav>

        {/* Hero / Header Section */}
        <div className="single-blog-hero mb-4">
          {/* Categories */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {blog.categories && blog.categories.length > 0 ? (
              blog.categories.map((cat, idx) => (
                <span key={idx} className="badge bg-primary-light text-primary px-3 py-2 rounded-pill fs-7 fw-semibold">
                  {cat}
                </span>
              ))
            ) : (
              <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill fs-7 fw-semibold">
                Mental Health
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="fw-bold display-6 mb-3 text-dark">{blog.title}</h1>

          {/* Excerpt Subtitle if available */}
          {blog.excerpt && (
            <p className="lead text-muted mb-4 fs-5" style={{ lineHeight: 1.6 }}>
              {blog.excerpt}
            </p>
          )}

          {/* Author & Meta Row */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 py-3 border-top border-bottom">
            <div className="d-flex align-items-center gap-3">
              <img
                src={blog.author?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'}
                alt={blog.author?.name || 'Author'}
                className="single-blog-author-avatar shadow-sm"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80';
                }}
              />
              <div>
                <h6 className="mb-0 fw-bold text-dark">{blog.author?.name || 'SS Psych Life Care Team'}</h6>
                <small className="text-muted">Mental Health Professional</small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-4 text-muted fs-7">
              <span>
                <i className="bi bi-calendar3 me-1 text-primary"></i> {formattedDate}
              </span>
              <span>
                <i className="bi bi-clock me-1 text-primary"></i> {calculateReadTime()} min read
              </span>
              {blog.viewCount !== undefined && (
                <span>
                  <i className="bi bi-eye me-1 text-primary"></i> {blog.viewCount} views
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="single-blog-hero mb-5">
          <div className="position-relative overflow-hidden rounded-4">
            <img
              src={blog.featuredImage || defaultImage}
              alt={blog.title}
              className="single-blog-featured-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
          </div>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="row g-5 justify-content-center">
          {/* Article Column */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5">
              {/* Blog HTML Content */}
              <article
                className="single-blog-content"
                dangerouslySetInnerHTML={{ __html: parseBlogContent(blog.content) }}
              />

              {/* Tags Section */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-5 pt-4 border-top">
                  <h6 className="fw-bold mb-3 text-secondary text-uppercase fs-7">
                    <i className="bi bi-tags me-2"></i>Related Topics
                  </h6>
                  <div className="d-flex flex-wrap gap-1">
                    {blog.tags.map((tag, idx) => (
                      <span key={idx} className="single-blog-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Bar */}
              <div className="mt-4 pt-4 border-top d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-semibold text-dark">Share this article:</span>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + ' ' + currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn whatsapp"
                    title="Share on WhatsApp"
                  >
                    <i className="bi bi-whatsapp"></i>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn twitter"
                    title="Share on X (Twitter)"
                  >
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn facebook"
                    title="Share on Facebook"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn linkedin"
                    title="Share on LinkedIn"
                  >
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="share-btn copy-link border-0"
                    title="Copy Article Link"
                  >
                    <i className={`bi ${copied ? 'bi-check-lg' : 'bi-link-45deg'}`}></i>
                  </button>
                  {copied && (
                    <span className="text-success small fw-medium ms-1">
                      <i className="bi bi-check-circle me-1"></i>Copied!
                    </span>
                  )}
                </div>

                <Link to="/blog" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                  <i className="bi bi-arrow-left me-1"></i> All Articles
                </Link>
              </div>

              {/* Author Bio Box */}
              <div className="author-bio-card mt-5 d-flex gap-3 align-items-center">
                <img
                  src={blog.author?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'}
                  alt={blog.author?.name || 'Author'}
                  className="rounded-circle shadow-sm"
                  style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80';
                  }}
                />
                <div>
                  <h6 className="fw-bold mb-1">{blog.author?.name || 'SS Psych Life Care Team'}</h6>
                  <p className="text-muted small mb-0">
                    Dedicated to spreading evidence-based awareness and practical strategies for mental health, emotional wellness, and balanced living.
                  </p>
                </div>
              </div>
            </div>

            {/* In-Article Consultation Callout */}
            <div className="card border-0 rounded-4 p-4 text-white shadow-sm mb-5" style={{ background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)' }}>
              <div className="row align-items-center">
                <div className="col-md-8 mb-3 mb-md-0">
                  <h4 className="fw-bold text-white mb-2">Need Guidance with Your Mental Wellbeing?</h4>
                  <p className="mb-0 text-white-50">
                    Our verified therapists and counsellors are here to provide confidential, compassionate care tailored to you.
                  </p>
                </div>
                <div className="col-md-4 text-md-end">
                  <Link to="/consilar" className="btn btn-light btn-lg rounded-pill px-4 text-primary fw-bold">
                    Talk to a Counsellor
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="col-lg-4">
            <div className="sticky-sidebar">
              {/* Quick Book Appointment Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-center">
                <div className="icon-box bg-primary-light text-primary mx-auto mb-3">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h5 className="fw-bold mb-2">Book a Consultation</h5>
                <p className="text-muted small mb-3">
                  Connect with experienced clinical psychologists online or in-person.
                </p>
                <Link to="/consilar" className="btn btn-primary w-100 rounded-pill mb-2">
                  Book Session
                </Link>
                <a href="tel:+919716129129" className="btn btn-outline-secondary w-100 rounded-pill btn-sm">
                  <i className="bi bi-telephone me-1"></i> Call +91 9716129129
                </a>
              </div>

              {/* Free Mental Health Test Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-light">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="icon-box bg-success-light text-success">
                    <i className="bi bi-clipboard2-pulse"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Free Anxiety Test</h6>
                    <small className="text-muted">Takes 2 minutes</small>
                  </div>
                </div>
                <p className="text-muted small mb-3">
                  Evaluate your current stress and anxiety levels with our clinically validated self-assessment tool.
                </p>
                <Link to="/anxiety-test" className="btn btn-outline-success w-100 rounded-pill btn-sm fw-semibold">
                  Take Free Test <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>

              {/* Categories Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h6 className="fw-bold mb-3 border-bottom pb-2">
                  <i className="bi bi-folder2-open me-2 text-primary"></i>Explore Categories
                </h6>
                <div className="d-flex flex-column gap-2">
                  {['Mental Health', 'Anxiety', 'Depression', 'Self-Help', 'Relationships', 'Stress Management'].map((cat, i) => (
                    <Link
                      key={i}
                      to={`/blog?category=${encodeURIComponent(cat.toLowerCase())}`}
                      className="d-flex justify-content-between align-items-center py-2 text-decoration-none text-dark border-bottom border-light"
                    >
                      <span>{cat}</span>
                      <i className="bi bi-chevron-right text-muted small"></i>
                    </Link>
                  ))}
                </div>
              </div>

              {/* WhatsApp Quick Chat */}
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                <i className="bi bi-whatsapp text-success fs-1 mb-2"></i>
                <h6 className="fw-bold mb-1">Instant Support</h6>
                <p className="text-muted small mb-3">Have questions about our therapies? Chat with our care coordinator.</p>
                <a
                  href="https://wa.me/9716129129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success rounded-pill w-100"
                >
                  <i className="bi bi-whatsapp me-2"></i> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <div className="related-articles-section mt-5 pt-5 border-top">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold mb-1">Related Articles</h3>
                <p className="text-muted small mb-0">Continue reading insights from our clinical psychologists</p>
              </div>
              <Link to="/blog" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                View All <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>

            <div className="row g-4">
              {relatedBlogs.map((rel) => (
                <div className="col-md-6 col-lg-4" key={rel._id}>
                  <div className="card blog-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    <Link to={`/blog/${rel.slug || rel._id}`}>
                      <div className="blog-image-wrapper">
                        <img
                          src={rel.featuredImage || defaultImage}
                          alt={rel.title}
                          className="card-img-top"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultImage;
                          }}
                        />
                        <div className="blog-category">{rel.categories?.[0] || 'General'}</div>
                      </div>
                    </Link>
                    <div className="card-body p-4 d-flex flex-column">
                      <div className="blog-meta mb-2">
                        <span><i className="bi bi-person me-1"></i> {rel.author?.name || 'Admin'}</span>
                        <span><i className="bi bi-clock me-1"></i> {rel.readTime || '5'} min</span>
                      </div>
                      <Link to={`/blog/${rel.slug || rel._id}`} className="text-decoration-none text-dark">
                        <h5 className="card-title mb-3 fw-bold">{rel.title}</h5>
                      </Link>
                      <p className="card-text text-muted small flex-grow-1">
                        {rel.excerpt || (rel.content ? getBlogPlainText(rel.content).substring(0, 100) + '...' : '')}
                      </p>
                      <Link to={`/blog/${rel.slug || rel._id}`} className="blog-link mt-3 fw-semibold">
                        Read Article <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  <h3 className="mb-3 fw-bold">Subscribe to Our Newsletter</h3>
                  <p className="text-muted mb-4">
                    Stay updated with our latest articles, tips, and resources on mental health and wellbeing.
                  </p>
                  {newsletterSubscribed ? (
                    <div className="alert alert-success rounded-pill py-2 px-4 d-inline-block">
                      <i className="bi bi-check-circle me-2"></i> Thank you for subscribing!
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="row g-3 justify-content-center">
                      <div className="col-md-8">
                        <input
                          type="email"
                          className="form-control form-control-lg rounded-pill px-4"
                          placeholder="Your email address"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill">
                          Subscribe
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
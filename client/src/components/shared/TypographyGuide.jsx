import React from 'react';

const TypographyGuide = () => {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-1 mb-4">Typography Guide</h1>
          <p className="lead mb-5">
            This guide demonstrates the typography system used throughout the S S Psychologist Life Care platform.
          </p>

          {/* Display Headings */}
          <section className="mb-5">
            <h2 className="h2 mb-4">Display Headings</h2>
            <div className="row">
              <div className="col-md-6">
                <h1 className="display-1">Display 1</h1>
                <h2 className="display-2">Display 2</h2>
                <h3 className="display-3">Display 3</h3>
                <h4 className="display-4">Display 4</h4>
              </div>
              <div className="col-md-6">
                <p className="text-sm text-muted">
                  <strong>Display 1:</strong> 72px/56px (desktop/mobile), Extra Bold<br/>
                  <strong>Display 2:</strong> 56px/48px, Bold<br/>
                  <strong>Display 3:</strong> 40px/36px, Bold<br/>
                  <strong>Display 4:</strong> 32px/30px, Semibold
                </p>
              </div>
            </div>
          </section>

          {/* Regular Headings */}
          <section className="mb-5">
            <h2 className="h2 mb-4">Regular Headings</h2>
            <div className="row">
              <div className="col-md-6">
                <h1 className="h1">Heading 1</h1>
                <h2 className="h2">Heading 2</h2>
                <h3 className="h3">Heading 3</h3>
                <h4 className="h4">Heading 4</h4>
                <h5 className="h5">Heading 5</h5>
                <h6 className="h6">Heading 6</h6>
              </div>
              <div className="col-md-6">
                <p className="text-sm text-muted">
                  Headings use consistent sizing and weights for clear hierarchy.
                </p>
              </div>
            </div>
          </section>

          {/* Body Text */}
          <section className="mb-5">
            <h2 className="h2 mb-4">Body Text</h2>
            <p className="lead">This is lead text for introductions.</p>
            <p>This is regular body text with optimal readability.</p>
            <p className="text-lg">This is large body text for emphasis.</p>
            <p className="text-sm text-muted">This is small text for metadata.</p>
          </section>

          {/* Font Weights */}
          <section className="mb-5">
            <h2 className="h2 mb-4">Font Weights</h2>
            <p className="font-light">Light (300)</p>
            <p className="font-normal">Regular (400)</p>
            <p className="font-medium">Medium (500)</p>
            <p className="font-semibold">Semibold (600)</p>
            <p className="font-bold">Bold (700)</p>
            <p className="font-extrabold">Extra Bold (800)</p>
          </section>

          {/* Component Examples */}
          <section className="mb-5">
            <h2 className="h2 mb-4">Component Typography</h2>
            
            <div className="mb-4">
              <h6 className="section-subtitle">SECTION EXAMPLE</h6>
              <h2 className="section-title">Section Title</h2>
              <p className="section-description">
                This demonstrates section typography with proper hierarchy.
              </p>
            </div>

            <div className="card" style={{ maxWidth: '400px' }}>
              <div className="card-body">
                <h5 className="card-title">Card Title</h5>
                <h6 className="card-subtitle">Card Subtitle</h6>
                <p className="card-text">Card text example.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TypographyGuide;
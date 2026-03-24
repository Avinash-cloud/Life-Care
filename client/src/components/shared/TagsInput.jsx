import { useState } from 'react';
import { Form, Badge } from 'react-bootstrap';

const TagsInput = ({ value = [], onChange, placeholder, label }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue('');
  };

  const removeTag = (index) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  return (
    <div>
      {label && <Form.Label>{label}</Form.Label>}
      <div className="tags-input-container" style={{ 
        border: '1px solid #ced4da', 
        borderRadius: '0.375rem', 
        padding: '0.375rem 0.75rem',
        minHeight: '38px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '4px'
      }}>
        {value.map((tag, index) => (
          <Badge 
            key={index} 
            bg="primary" 
            className="d-flex align-items-center"
            style={{ fontSize: '0.875rem', padding: '4px 8px' }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                marginLeft: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ×
            </button>
          </Badge>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            minWidth: '120px',
            fontSize: '1rem'
          }}
        />
      </div>
      <Form.Text className="text-muted">
        Press Enter or comma to add tags
      </Form.Text>
    </div>
  );
};

export default TagsInput;
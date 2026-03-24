import { $getRoot, $getSelection, $isRangeSelection, $insertNodes, $createTextNode } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import React, { useCallback, useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { DecoratorNode } from 'lexical';

const ImageComponent = ({ src, alt }) => (
  <img 
    src={src} 
    alt={alt} 
    style={{
      maxWidth: '100%',
      height: 'auto',
      margin: '10px 0',
      display: 'block'
    }}
  />
);

class ImageNode extends DecoratorNode {
  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  constructor(src, alt, key) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }

  createDOM() {
    const span = document.createElement('span');
    return span;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <ImageComponent src={this.__src} alt={this.__alt} />;
  }

  exportJSON() {
    return {
      type: 'image',
      src: this.__src,
      alt: this.__alt,
      version: 1
    };
  }

  static importJSON(serializedNode) {
    const { src, alt } = serializedNode;
    return new ImageNode(src, alt);
  }
}

function $createImageNode(src, alt) {
  return new ImageNode(src, alt);
}
import { Button, ButtonGroup, Dropdown, Modal, Form } from 'react-bootstrap';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createListNode, $createListItemNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { $createCodeNode } from '@lexical/code';
import { $createLinkNode, TOGGLE_LINK_COMMAND, $isLinkNode } from '@lexical/link';
import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode, FORMAT_TEXT_COMMAND } from 'lexical';
import { uploadAPI } from '../../services/api';
import './LexicalEditor.css';

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
    h6: 'editor-heading-h6',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    hashtag: 'editor-text-hashtag',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable',
  },
};

function onError(error) {
  console.error(error);
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [blockType, setBlockType] = useState('paragraph');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [uploading, setUploading] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const formats = new Set();
      if (selection.hasFormat('bold')) formats.add('bold');
      if (selection.hasFormat('italic')) formats.add('italic');
      if (selection.hasFormat('underline')) formats.add('underline');
      if (selection.hasFormat('strikethrough')) formats.add('strikethrough');
      if (selection.hasFormat('code')) formats.add('code');
      setActiveFormats(formats);
      
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      
      if (elementDOM !== null) {
        if (elementDOM.tagName === 'H1') setBlockType('h1');
        else if (elementDOM.tagName === 'H2') setBlockType('h2');
        else if (elementDOM.tagName === 'H3') setBlockType('h3');
        else if (elementDOM.tagName === 'H4') setBlockType('h4');
        else if (elementDOM.tagName === 'BLOCKQUOTE') setBlockType('quote');
        else if (elementDOM.tagName === 'CODE') setBlockType('code');
        else setBlockType('paragraph');
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatBlock = (blockType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        if (blockType === 'paragraph') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (blockType.startsWith('h')) {
          $setBlocksType(selection, () => $createHeadingNode(blockType));
        } else if (blockType === 'quote') {
          $setBlocksType(selection, () => $createQuoteNode());
        } else if (blockType === 'code') {
          $setBlocksType(selection, () => $createCodeNode());
        }
      }
    });
  };

  const insertList = (listType) => {
    if (listType === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const insertLink = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const selectedText = selection.getTextContent();
      setLinkText(selectedText);
      setLinkUrl('');
      setShowLinkModal(true);
    }
  };

  const handleLinkSubmit = () => {
    if (linkUrl) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          if (linkText && selection.getTextContent() === '') {
            const textNode = $createTextNode(linkText);
            const linkNode = $createLinkNode(linkUrl);
            linkNode.append(textNode);
            selection.insertNodes([linkNode]);
          } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
          }
        }
      });
    }
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };

  const insertImage = () => {
    setImageUrl('');
    setImageAlt('');
    setShowImageModal(true);
  };

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const response = await uploadAPI.uploadBlogImage(file);
      console.log('Upload response:', response.data);
      
      // Handle different response structures
      const imageUrl = response.data?.data?.url || response.data?.url || response.data?.imageUrl;
      if (imageUrl) {
        setImageUrl(imageUrl);
        console.log('Image URL set:', imageUrl);
      } else {
        console.error('No URL found in response:', response.data);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setUploading(false);
    }
  };

  const handleImageSubmit = () => {
    if (imageUrl) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const imageNode = $createImageNode(imageUrl, imageAlt);
          selection.insertNodes([imageNode]);
        }
      });
    }
    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
  };

  const getBlockTypeLabel = () => {
    switch (blockType) {
      case 'h1': return 'Heading 1';
      case 'h2': return 'Heading 2';
      case 'h3': return 'Heading 3';
      case 'h4': return 'Heading 4';
      case 'quote': return 'Quote';
      case 'code': return 'Code Block';
      default: return 'Paragraph';
    }
  };

  return (
    <>
      <div className="advanced-toolbar">
        <div className="toolbar-row">
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              {getBlockTypeLabel()}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => formatBlock('paragraph')}>Paragraph</Dropdown.Item>
              <Dropdown.Item onClick={() => formatBlock('h1')}>Heading 1</Dropdown.Item>
              <Dropdown.Item onClick={() => formatBlock('h2')}>Heading 2</Dropdown.Item>
              <Dropdown.Item onClick={() => formatBlock('h3')}>Heading 3</Dropdown.Item>
              <Dropdown.Item onClick={() => formatBlock('h4')}>Heading 4</Dropdown.Item>
              <Dropdown.Item onClick={() => formatBlock('quote')}>Quote</Dropdown.Item>
              <Dropdown.Item onClick={() => formatBlock('code')}>Code Block</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          <ButtonGroup size="sm" className="me-2">
            <Button 
              variant={activeFormats.has('bold') ? 'primary' : 'outline-secondary'}
              onClick={() => formatText('bold')}
              title="Bold (Ctrl+B)"
            >
              <i className="bi bi-type-bold"></i>
            </Button>
            <Button 
              variant={activeFormats.has('italic') ? 'primary' : 'outline-secondary'}
              onClick={() => formatText('italic')}
              title="Italic (Ctrl+I)"
            >
              <i className="bi bi-type-italic"></i>
            </Button>
            <Button 
              variant={activeFormats.has('underline') ? 'primary' : 'outline-secondary'}
              onClick={() => formatText('underline')}
              title="Underline (Ctrl+U)"
            >
              <i className="bi bi-type-underline"></i>
            </Button>
            <Button 
              variant={activeFormats.has('strikethrough') ? 'primary' : 'outline-secondary'}
              onClick={() => formatText('strikethrough')}
              title="Strikethrough"
            >
              <i className="bi bi-type-strikethrough"></i>
            </Button>
          </ButtonGroup>
          
          <ButtonGroup size="sm" className="me-2">
            <Button 
              variant="outline-secondary"
              onClick={() => insertList('bullet')}
              title="Bullet List"
            >
              <i className="bi bi-list-ul"></i>
            </Button>
            <Button 
              variant="outline-secondary"
              onClick={() => insertList('number')}
              title="Numbered List"
            >
              <i className="bi bi-list-ol"></i>
            </Button>
          </ButtonGroup>
          
          <ButtonGroup size="sm" className="me-2">
            <Button 
              variant="outline-secondary"
              onClick={insertLink}
              title="Insert Link"
            >
              <i className="bi bi-link-45deg"></i>
            </Button>
            <Button 
              variant="outline-secondary"
              onClick={insertImage}
              title="Insert Image"
            >
              <i className="bi bi-image"></i>
            </Button>
            <Button 
              variant={activeFormats.has('code') ? 'primary' : 'outline-secondary'}
              onClick={() => formatText('code')}
              title="Inline Code"
            >
              <i className="bi bi-code"></i>
            </Button>
          </ButtonGroup>
        </div>
      </div>
      
      {/* Link Modal */}
      <Modal 
        show={showLinkModal} 
        onHide={() => setShowLinkModal(false)} 
        centered
        backdrop={false}
        style={{ zIndex: 1055 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Insert Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Link Text</Form.Label>
            <Form.Control
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLinkModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLinkSubmit}>
            Insert Link
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Image Modal */}
      <Modal 
        show={showImageModal} 
        onHide={() => setShowImageModal(false)} 
        centered
        backdrop={false}
        style={{ zIndex: 1055 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Insert Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  console.log('File selected:', file.name);
                  handleImageUpload(file);
                }
              }}
            />
            {uploading && <div className="mt-2">Uploading...</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Or Image URL</Form.Label>
            <Form.Control
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Alt Text</Form.Label>
            <Form.Control
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Describe the image"
            />
          </Form.Group>
          {imageUrl && (
            <div className="mb-3">
              <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImageSubmit} disabled={!imageUrl}>
            Insert Image
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ContentPlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();
  
  const handleChange = (editorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      
      // Smart content output: JSON for rich content, HTML for simple content
      const jsonState = editorState.toJSON();
      const hasRichContent = JSON.stringify(jsonState).includes('"format"') || 
                            JSON.stringify(jsonState).includes('"type":"heading"') ||
                            JSON.stringify(jsonState).includes('"type":"list"');
      
      const content = hasRichContent ? JSON.stringify(jsonState) : $generateHtmlFromNodes(editor, null);
      onChange?.(content, textContent, editorState);
    });
  };
  
  return <OnChangePlugin onChange={handleChange} />;
}

function InitialContentPlugin({ initialContent }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    if (initialContent && initialContent.trim()) {
      // Smart detection: JSON starts with { or [, HTML contains < tags
      const isJSON = initialContent.trim().startsWith('{') || initialContent.trim().startsWith('[');
      const isHTML = initialContent.includes('<') && initialContent.includes('>');
      
      if (isJSON) {
        try {
          const editorState = editor.parseEditorState(initialContent);
          editor.setEditorState(editorState);
        } catch (e) {
          console.warn('Failed to parse JSON content:', e);
        }
      } else if (isHTML) {
        editor.update(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialContent, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          const root = $getRoot();
          root.clear();
          root.append(...nodes);
        });
      } else {
        // Plain text
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(initialContent));
          root.append(paragraph);
        });
      }
    }
  }, []);
  
  return null;
}

const LexicalEditor = ({ initialContent, onChange, placeholder = "Start writing..." }) => {
  const initialConfig = {
    namespace: 'BlogEditor',
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
      ImageNode
    ],

  };

  return (
    <div className="lexical-editor">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="editor-input form-control"
                style={{ minHeight: '300px', padding: '12px' }}
              />
            }
            placeholder={
              <div className="editor-placeholder">{placeholder}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ContentPlugin onChange={onChange} />
          <InitialContentPlugin initialContent={initialContent} />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default LexicalEditor;
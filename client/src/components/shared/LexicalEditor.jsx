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
import { 
  $createListNode, 
  $createListItemNode, 
  $isListNode, 
  $isListItemNode, 
  INSERT_ORDERED_LIST_COMMAND, 
  INSERT_UNORDERED_LIST_COMMAND, 
  REMOVE_LIST_COMMAND 
} from '@lexical/list';
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

      // Check if current selection or parent is a Link
      const anchorNode = selection.anchor.getNode();
      const parent = anchorNode.getParent();
      if ($isLinkNode(anchorNode) || $isLinkNode(parent)) {
        formats.add('link');
      }

      setActiveFormats(formats);
      
      // Check if current selection is inside a list
      let listNode = null;
      if ($isListNode(anchorNode)) {
        listNode = anchorNode;
      } else if ($isListItemNode(anchorNode)) {
        listNode = anchorNode.getParent();
      } else if (parent && $isListItemNode(parent)) {
        listNode = parent.getParent();
      } else if (parent && $isListNode(parent)) {
        listNode = parent;
      }

      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      if (!listNode && $isListNode(element)) {
        listNode = element;
      }

      if ($isListNode(listNode)) {
        const listType = typeof listNode.getListType === 'function' ? listNode.getListType() : null;
        const tag = typeof listNode.getTag === 'function' ? listNode.getTag() : null;
        if (listType === 'number' || tag === 'ol') {
          setBlockType('number');
        } else {
          setBlockType('bullet');
        }
      } else {
        const elementKey = element.getKey();
        const elementDOM = editor.getElementByKey(elementKey);
        
        if (elementDOM !== null) {
          const tagName = elementDOM.tagName;
          if (tagName === 'H1') setBlockType('h1');
          else if (tagName === 'H2') setBlockType('h2');
          else if (tagName === 'H3') setBlockType('h3');
          else if (tagName === 'H4') setBlockType('h4');
          else if (tagName === 'BLOCKQUOTE') setBlockType('quote');
          else if (tagName === 'CODE') setBlockType('code');
          else if (tagName === 'UL') setBlockType('bullet');
          else if (tagName === 'OL') setBlockType('number');
          else setBlockType('paragraph');
        } else {
          setBlockType('paragraph');
        }
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

  const formatBlock = (newBlockType) => {
    if (blockType === 'bullet' || blockType === 'number') {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        if (newBlockType === 'paragraph') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (newBlockType.startsWith('h')) {
          $setBlocksType(selection, () => $createHeadingNode(newBlockType));
        } else if (newBlockType === 'quote') {
          $setBlocksType(selection, () => $createQuoteNode());
        } else if (newBlockType === 'code') {
          $setBlocksType(selection, () => $createCodeNode());
        }
      }
    });
  };

  const insertList = (listType) => {
    editor.focus();
    editor.update(() => {
      let selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        const root = $getRoot();
        const lastChild = root.getLastChild();
        if (lastChild && typeof lastChild.selectEnd === 'function') {
          lastChild.selectEnd();
        } else {
          const paragraph = $createParagraphNode();
          root.append(paragraph);
          paragraph.select();
        }
      }
    });

    if (blockType === listType) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      if (listType === 'bullet') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      }
    }
  };

  const insertLink = () => {
    let selectedText = '';
    let existingUrl = '';

    // Safely read editor state without throwing
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selectedText = selection.getTextContent();

        const anchorNode = selection.anchor.getNode();
        const parent = anchorNode.getParent();
        if ($isLinkNode(parent)) {
          existingUrl = parent.getURL();
        } else if ($isLinkNode(anchorNode)) {
          existingUrl = anchorNode.getURL();
        }
      }
    });

    setLinkText(selectedText);
    setLinkUrl(existingUrl);
    setShowLinkModal(true);
  };

  const handleLinkSubmit = () => {
    if (!linkUrl.trim()) {
      setShowLinkModal(false);
      return;
    }

    let formattedUrl = linkUrl.trim();
    if (
      !/^https?:\/\//i.test(formattedUrl) && 
      !/^mailto:/i.test(formattedUrl) && 
      !/^tel:/i.test(formattedUrl) && 
      !/^\//i.test(formattedUrl) && 
      !/^#/i.test(formattedUrl)
    ) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const displayText = linkText.trim() || formattedUrl;

    editor.focus();
    editor.update(() => {
      let selection = $getSelection();

      // If selection was lost when modal gained focus, restore or select end of editor
      if (!$isRangeSelection(selection)) {
        const root = $getRoot();
        const lastChild = root.getLastChild();
        if (lastChild && typeof lastChild.selectEnd === 'function') {
          lastChild.selectEnd();
        } else {
          const paragraph = $createParagraphNode();
          root.append(paragraph);
          paragraph.select();
        }
        selection = $getSelection();
      }

      if ($isRangeSelection(selection)) {
        const currentSelectedText = selection.getTextContent();
        const anchorNode = selection.anchor.getNode();
        const parent = anchorNode.getParent();
        const isCurrentLink = $isLinkNode(anchorNode) || $isLinkNode(parent);

        if (isCurrentLink) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, formattedUrl);
        } else if (currentSelectedText && currentSelectedText === displayText) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, formattedUrl);
        } else {
          const linkNode = $createLinkNode(formattedUrl);
          const textNode = $createTextNode(displayText);
          linkNode.append(textNode);
          selection.insertNodes([linkNode]);
        }
      }
    });

    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };

  const handleRemoveLink = () => {
    editor.focus();
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      }
    });
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };

  const insertImage = () => {
    setImageUrl('');
    setImageAlt('');
    setShowImageModal(true);
  };

  const handleImageSubmit = () => {
    if (imageUrl) {
      editor.focus();
      editor.update(() => {
        let selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          const root = $getRoot();
          const lastChild = root.getLastChild();
          if (lastChild && typeof lastChild.selectEnd === 'function') {
            lastChild.selectEnd();
          } else {
            const paragraph = $createParagraphNode();
            root.append(paragraph);
            paragraph.select();
          }
          selection = $getSelection();
        }
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


  const getBlockTypeLabel = () => {
    switch (blockType) {
      case 'h1': return 'Heading 1';
      case 'h2': return 'Heading 2';
      case 'h3': return 'Heading 3';
      case 'h4': return 'Heading 4';
      case 'quote': return 'Quote';
      case 'code': return 'Code Block';
      case 'bullet': return 'Bullet List';
      case 'number': return 'Numbered List';
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
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => formatText('bold')}
              title="Bold (Ctrl+B)"
            >
              <i className="bi bi-type-bold"></i>
            </Button>
            <Button 
              variant={activeFormats.has('italic') ? 'primary' : 'outline-secondary'}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => formatText('italic')}
              title="Italic (Ctrl+I)"
            >
              <i className="bi bi-type-italic"></i>
            </Button>
            <Button 
              variant={activeFormats.has('underline') ? 'primary' : 'outline-secondary'}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => formatText('underline')}
              title="Underline (Ctrl+U)"
            >
              <i className="bi bi-type-underline"></i>
            </Button>
            <Button 
              variant={activeFormats.has('strikethrough') ? 'primary' : 'outline-secondary'}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => formatText('strikethrough')}
              title="Strikethrough"
            >
              <i className="bi bi-type-strikethrough"></i>
            </Button>
          </ButtonGroup>
          
          <ButtonGroup size="sm" className="me-2">
            <Button 
              variant={blockType === 'bullet' ? 'primary' : 'outline-secondary'}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertList('bullet')}
              title="Bullet List"
            >
              <i className="bi bi-list-ul"></i>
            </Button>
            <Button 
              variant={blockType === 'number' ? 'primary' : 'outline-secondary'}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertList('number')}
              title="Numbered List"
            >
              <i className="bi bi-list-ol"></i>
            </Button>
          </ButtonGroup>
          
          <ButtonGroup size="sm" className="me-2">
            <Button 
              variant={activeFormats.has('link') ? 'primary' : 'outline-secondary'}
              onClick={insertLink}
              title={activeFormats.has('link') ? 'Edit Link' : 'Insert Link'}
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
              onMouseDown={(e) => e.preventDefault()}
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
        style={{ zIndex: 1060 }}
      >
        <Form onSubmit={(e) => { e.preventDefault(); handleLinkSubmit(); }}>
          <Modal.Header closeButton>
            <Modal.Title>{linkUrl ? 'Edit / Insert Link' : 'Insert Link'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">URL / Destination Address <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com or /contact"
                autoFocus
                required
              />
              <Form.Text className="text-muted small">
                Paste any web address (e.g. https://google.com) or site route (e.g. /about, /consilar)
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Link Display Text</Form.Label>
              <Form.Control
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Clickable text (defaults to URL or selected text)"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <div>
              {linkUrl && (
                <Button variant="outline-danger" size="sm" onClick={handleRemoveLink} type="button">
                  <i className="bi bi-link-45deg me-1"></i>Remove Link
                </Button>
              )}
            </div>
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowLinkModal(false)} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={!linkUrl.trim()}>
                Save Link
              </Button>
            </div>
          </Modal.Footer>
        </Form>
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
      const jsonStr = JSON.stringify(jsonState);
      const hasRichContent = jsonStr.includes('"format"') || 
                            jsonStr.includes('"type":"heading"') ||
                            jsonStr.includes('"type":"list"') ||
                            jsonStr.includes('"type":"link"') ||
                            jsonStr.includes('"type":"image"');
      
      const content = hasRichContent ? jsonStr : $generateHtmlFromNodes(editor, null);
      onChange?.(content, textContent, editorState);
    });
  };
  
  return <OnChangePlugin onChange={handleChange} />;
}

function InitialContentPlugin({ initialContent }) {
  const [editor] = useLexicalComposerContext();
  const hasInitializedRef = React.useRef(false);
  
  useEffect(() => {
    if (initialContent && initialContent.trim() && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
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
  }, [initialContent, editor]);
  
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
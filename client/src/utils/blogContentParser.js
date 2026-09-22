function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function lexicalNodeToHtml(node) {
  if (!node) return '';
  switch (node.type) {
    case 'root':
      return (node.children || []).map(lexicalNodeToHtml).join('');
    case 'paragraph': {
      const content = (node.children || []).map(lexicalNodeToHtml).join('');
      const styles = [];
      if (node.format) styles.push(`text-align:${node.format}`);
      if (node.indent) styles.push(`padding-left:${node.indent * 20}px`);
      const styleAttr = styles.length ? ` style="${styles.join(';')}"` : '';
      return `<p${styleAttr}>${content || '<br>'}</p>`;
    }
    case 'heading': {
      const tag = node.tag || 'h2';
      const content = (node.children || []).map(lexicalNodeToHtml).join('');
      const styles = [];
      if (node.format) styles.push(`text-align:${node.format}`);
      if (node.indent) styles.push(`padding-left:${node.indent * 20}px`);
      const styleAttr = styles.length ? ` style="${styles.join(';')}"` : '';
      return `<${tag}${styleAttr}>${content}</${tag}>`;
    }
    case 'quote': {
      const content = (node.children || []).map(lexicalNodeToHtml).join('');
      return `<blockquote>${content}</blockquote>`;
    }
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul';
      const content = (node.children || []).map(lexicalNodeToHtml).join('');
      return `<${tag}>${content}</${tag}>`;
    }
    case 'listitem': {
      const content = (node.children || []).map(lexicalNodeToHtml).join('');
      return `<li>${content}</li>`;
    }
    case 'link':
    case 'autolink': {
      const url = escapeHtml(node.url || node.__url || '#');
      const content = (node.children || []).map(lexicalNodeToHtml).join('') || url;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${content}</a>`;
    }
    case 'code': {
      const content = (node.children || []).map(lexicalNodeToHtml).join('');
      return `<pre><code>${content}</code></pre>`;
    }
    case 'image': {
      const src = escapeHtml(node.src || node.__src || '');
      const alt = escapeHtml(node.alt || node.__alt || '');
      return `<img src="${src}" alt="${alt}" class="img-fluid rounded my-3" />`;
    }
    case 'text': {
      let text = escapeHtml(node.text || '');
      const format = typeof node.format === 'number' ? node.format : 0;
      if (format & 1) text = `<strong>${text}</strong>`;
      if (format & 2) text = `<em>${text}</em>`;
      if (format & 4) text = `<s>${text}</s>`;
      if (format & 8) text = `<u>${text}</u>`;
      if (format & 16) text = `<code>${text}</code>`;
      if (format & 32) text = `<sub>${text}</sub>`;
      if (format & 64) text = `<sup>${text}</sup>`;
      if (node.style) {
        text = `<span style="${escapeHtml(node.style)}">${text}</span>`;
      }
      return text;
    }
    case 'linebreak':
      return '<br>';
    default:
      if (node.children && node.children.length > 0) {
        return (node.children || []).map(lexicalNodeToHtml).join('');
      }
      return node.text ? escapeHtml(node.text) : '';
  }
}

export function parseBlogContent(content) {
  if (!content) return '';
  if (typeof content !== 'string') return '';
  const trimmed = content.trim();
  if ((trimmed.startsWith('{') || trimmed.startsWith('[')) && trimmed.includes('"root"')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && parsed.root) {
        return lexicalNodeToHtml(parsed.root);
      }
    } catch (e) {
      console.warn('Lexical JSON parse error, falling back to raw content:', e);
    }
  }
  // If already contains HTML tags
  if (trimmed.includes('<') && trimmed.includes('>')) {
    return trimmed;
  }
  // Plain text fallback: wrap in paragraphs
  return trimmed
    .split(/\n{2,}/)
    .map(para => `<p>${escapeHtml(para.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

export function getBlogPlainText(content) {
  if (!content) return '';
  const html = parseBlogContent(content);
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

//Deprecated
// This component is deprecated and will be removed in the future.

import MarkdownIt from 'markdown-it';
import parse from 'html-react-parser';

function MarkdownItRenderer({ markdown, className }) {
  const md = new MarkdownIt({
    html: true, 
    linkify: true,
    typographer: true 
  });

  const html = md.render(markdown);
  const reactElements = parse(html);

  return (
    <div className={className}>
      {reactElements}
    </div>
  );
}

export default MarkdownItRenderer;

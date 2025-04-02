
/// DEPRECATED: This component is deprecated and will be removed in the next major release.
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                className="rounded-md"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`${className} px-1 py-0.5 rounded-md bg-gray-100`} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto">
                <table className="table-auto w-full">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return <th className="px-4 py-2 bg-gray-100 font-bold">{children}</th>;
          },
          td({ children }) {
            return <td className="border px-4 py-2">{children}</td>;
          },
          a({ children, href }) {
            return <a href={href} className="text-blue-600 hover:text-blue-800 underline">{children}</a>;
          },
          blockquote({ children }) {
            return <blockquote className="border-l-4 border-gray-300 pl-4 italic">{children}</blockquote>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside">{children}</ol>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

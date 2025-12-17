import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

const CodeBlock = ({ className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const isInline = !match && !String(children).includes('\n');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isInline) {
    return (
      <code className="bg-slate-100 text-brand-600 px-1.5 py-0.5 rounded font-mono text-sm border border-slate-200" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
      <div className="bg-slate-50 px-4 py-2 flex items-center justify-between border-b border-slate-200">
        <span className="text-xs font-mono text-slate-500 font-medium">
            {match ? match[1] : 'code'}
        </span>
        <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors"
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                </>
            ) : (
                <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                </>
            )}
        </button>
      </div>
      
      <div className="relative bg-[#0d1117] overflow-x-auto">
        <pre className="p-4 text-slate-300 text-sm font-mono leading-relaxed">
            <code className={className} {...props}>
            {children}
            </code>
        </pre>
      </div>
    </div>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate prose-sm sm:prose-base max-w-none break-words">
      <ReactMarkdown
        components={{
          code: CodeBlock,
          a({ node, ...props }) {
            return (
              <a 
                className="text-brand-600 hover:text-brand-700 underline decoration-brand-200 underline-offset-2" 
                target="_blank" 
                rel="noopener noreferrer" 
                {...props} 
              />
            );
          },
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-bold text-slate-800 mt-5 mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 my-3 space-y-1 text-slate-700" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-3 space-y-1 text-slate-700" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-brand-200 pl-4 italic text-slate-600 my-4 bg-slate-50 py-2 rounded-r" {...props} />,
          p: ({node, ...props}) => <p className="mb-4 text-slate-700 leading-relaxed last:mb-0" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
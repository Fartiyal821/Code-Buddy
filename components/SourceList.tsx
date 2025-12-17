import React from 'react';
import { Source } from '../types';
import { ExternalLink, Globe } from 'lucide-react';

interface SourceListProps {
  sources: Source[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  // De-duplicate sources based on URI
  const uniqueSources = sources.filter((v, i, a) => a.findIndex(v2 => (v2.uri === v.uri)) === i);

  return (
    <div className="mt-4 pt-4 border-t border-gray-800/50">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Globe className="w-3 h-3" />
        Sources & References
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {uniqueSources.slice(0, 4).map((source, index) => (
          <a
            key={index}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 p-2 rounded-md bg-gray-800/40 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 transition-all group"
          >
            <div className="mt-0.5 min-w-[16px]">
               <img 
                src={`https://www.google.com/s2/favicons?domain=${new URL(source.uri).hostname}&sz=32`} 
                alt="favicon" 
                className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-primary-400 font-medium truncate group-hover:underline">
                {source.title}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {new URL(source.uri).hostname}
              </p>
            </div>
            <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-gray-400" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SourceList;
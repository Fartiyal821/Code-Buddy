import React from 'react';

interface AdPlaceholderProps {
  className?: string;
  format?: 'horizontal' | 'vertical' | 'rectangle';
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ className = '', format = 'horizontal' }) => {
  // In a real scenario, this is where you paste your <ins class="adsbygoogle" ... /> code
  // For now, we show a placeholder that encourages users to imagine the ad space
  
  const heightClass = format === 'horizontal' ? 'h-[90px]' : format === 'vertical' ? 'h-full min-h-[400px]' : 'h-[250px]';
  const widthClass = format === 'vertical' ? 'w-[160px]' : 'w-full';

  return (
    <div className={`bg-slate-100 border border-slate-200 border-dashed rounded-lg flex flex-col items-center justify-center p-4 text-center overflow-hidden ${heightClass} ${widthClass} ${className}`}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Advertisement</span>
      <p className="text-xs text-slate-400">Support DevSolvr to keep it free!</p>
    </div>
  );
};

export default AdPlaceholder;
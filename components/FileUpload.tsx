import React from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { UploadedFile } from '../types';

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, onFilesChange }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(event.target.files).map((val) => {
        const file = val as File;
        return {
          file,
          type: file.type.includes('pdf') ? 'marksheet' : 'project_screenshot', // Simplified inference
          previewUrl: URL.createObjectURL(file)
        };
      });
      onFilesChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:bg-slate-800/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300 cursor-pointer relative group focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 focus-within:border-blue-500">
        <input 
          type="file" 
          multiple 
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <div className="p-3 bg-blue-900/30 rounded-full text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 group-hover:shadow-blue-500/50 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Upload size={24} />
          </div>
          <p className="text-sm font-medium text-slate-300 group-hover:text-blue-300 transition-colors">Click to upload Marksheets, Certificates, or Screenshots</p>
          <p className="text-xs text-slate-500">Supports JPG, PNG, PDF</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-in fade-in zoom-in duration-300">
          {files.map((f, idx) => (
            <div key={idx} className="relative group bg-slate-800 border border-slate-700 p-2 rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md hover:border-slate-600 transition-all duration-200 hover:-translate-y-0.5">
              <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                {f.file.type.includes('image') ? (
                  <img src={f.previewUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <FileText size={20} className="text-slate-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate text-slate-200">{f.file.name}</p>
                <p className="text-[10px] text-slate-500 uppercase">{f.type.replace('_', ' ')}</p>
              </div>
              <button 
                onClick={() => removeFile(idx)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 z-20 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Remove file"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
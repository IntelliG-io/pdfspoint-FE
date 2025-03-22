import { useState } from 'react';
import { mergePdfs, splitPdf, compressPdf, convertPdfToDocx, downloadFile } from '@/services/api';

interface UsePdfOperationsOptions {
  onSuccess?: (data: Blob, filename: string) => void;
  onError?: (error: Error) => void;
}

export const usePdfOperations = (options?: UsePdfOperationsOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const handleMergePdfs = async (files: File[], mergeOptions?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await mergePdfs(files, mergeOptions);
      
      // Create a download if onSuccess not provided
      if (options?.onSuccess) {
        options.onSuccess(result, 'merged.pdf');
      } else {
        // Default download behavior
        downloadFile(result, 'merged.pdf');
      }
      
      setIsLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to merge PDFs');
      setError(error);
      options?.onError?.(error);
      setIsLoading(false);
      throw error;
    }
  };
  
  const handleSplitPdf = async (file: File, splitOptions?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await splitPdf(file, splitOptions);
      
      // Determine if result is a zip file or a single PDF
      const isZip = result.type === 'application/zip' || 
                    (result.filename && result.filename.endsWith('.zip'));
      
      // Use appropriate filename               
      const filename = isZip ? 'split-files.zip' : 'split.pdf';
      
      if (options?.onSuccess) {
        options.onSuccess(result, filename);
      } else {
        // Default download behavior
        downloadFile(result, filename);
      }
      
      setIsLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to split PDF');
      setError(error);
      options?.onError?.(error);
      setIsLoading(false);
      throw error;
    }
  };
  
  // Utility method to get a friendly error message from error object
  const getFriendlyErrorMessage = (error: any): string => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    } else if (error?.message) {
      return error.message;
    } else {
      return 'An unknown error occurred';
    }
  };

  // Reset error state
  const resetError = () => {
    setError(null);
  };

  const handleCompressPdf = async (file: File, compressionOptions?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This now returns {file: Blob, compressionStats: {...}}
      const result = await compressPdf(file, compressionOptions);
      
      console.log('Compression result:', result);
      console.log('Compression stats:', result.compressionStats);
      
      // Generate a filename
      const originalName = file.name;
      const nameParts = originalName.split('.');
      nameParts.pop(); // Remove extension
      const filename = `${nameParts.join('.')}_compressed.pdf`;
      
      // Handle the success callback
      if (options?.onSuccess) {
        options.onSuccess(result, filename);
      } else {
        // Default download behavior
        downloadFile(result.file, filename);
      }
      
      setIsLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to compress PDF');
      setError(error);
      options?.onError?.(error);
      setIsLoading(false);
      throw error;
    }
  };

  const handleConvertPdfToDocx = async (file: File, conversionOptions?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await convertPdfToDocx(file, conversionOptions);
      
      // Generate a filename
      const originalName = file.name;
      const nameParts = originalName.split('.');
      nameParts.pop(); // Remove extension
      const filename = `${nameParts.join('.')}.docx`;
      
      // Handle the success callback
      if (options?.onSuccess) {
        options.onSuccess(result, filename);
      } else {
        // Default download behavior
        downloadFile(result, filename);
      }
      
      setIsLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to convert PDF to DOCX');
      setError(error);
      options?.onError?.(error);
      setIsLoading(false);
      throw error;
    }
  };

  return {
    mergePdfs: handleMergePdfs,
    splitPdf: handleSplitPdf,
    compressPdf: handleCompressPdf,
    convertPdfToDocx: handleConvertPdfToDocx,
    isLoading,
    error,
    resetError,
    getFriendlyErrorMessage,
  };
};

export default usePdfOperations;

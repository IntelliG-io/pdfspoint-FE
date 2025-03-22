import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',  // Empty fallback to use relative URLs with proxy
  timeout: 60000, // Set a longer timeout for file operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// PDF merge operations
export const mergePdfs = async (files: File[], options?: any) => {
  // Validate inputs
  if (!files || files.length < 2) {
    throw new Error('At least two PDF files are required for merging');
  }
  
  // Validate that all files are PDFs
  const nonPdfFiles = files.filter(file => !file.name.toLowerCase().endsWith('.pdf'));
  if (nonPdfFiles.length > 0) {
    throw new Error(`The following files are not PDFs: ${nonPdfFiles.map(f => f.name).join(', ')}`);
  }
  
  const formData = new FormData();
  
  // Add files to formData
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  // Add options if provided
  if (options) {
    formData.append('options', JSON.stringify(options));
  }
  
  try {
    const response = await api.post('/pdf/merge', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob', // Important for file download
    });
    
    // Verify the response is a valid PDF
    if (response.headers['content-type'] !== 'application/pdf' && 
        !response.headers['content-disposition']?.includes('.pdf')) {
      // If response is not a PDF, it might be an error message in JSON format
      // Convert blob to text to see if it contains an error message
      try {
        const errorText = await response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Error merging PDFs');
        } catch (e) {
          // Not valid JSON, might be another format
          throw new Error(errorText || 'Error merging PDFs');
        }
      } catch (e) {
        // If we can't parse as text, just return the blob
        console.warn('Unexpected response type, but continuing anyway');
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw error;
  }
};

// PDF split operations
export const splitPdf = async (file: File, options?: any) => {
  // Validate input
  if (!file) {
    throw new Error('A PDF file is required for splitting');
  }
  
  // Validate file is a PDF
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error(`The file "${file.name}" is not a PDF`);
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  if (options) {
    formData.append('options', JSON.stringify(options));
  }
  
  // Check if we need to use the advanced endpoint
  const useAdvanced = options && (
    options.mode === 'pages' ||
    options.mode === 'everyNPages' ||
    options.mode === 'bookmarks' ||
    options.filenamePrefix ||
    options.preserveBookmarks
  );
  
  // Determine if we want a ZIP download
  const wantZip = options && options.outputFormat === 'zip';
  
  try {
    // Construct URL with any query parameters
    const endpoint = useAdvanced ? '/pdf/split/advanced' : '/pdf/split';
    const queryParams = wantZip ? '?download=zip' : '';
    
    const response = await api.post(`${endpoint}${queryParams}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });
    
    // Check response content type to determine if it's PDF, ZIP, or an error
    const contentType = response.headers['content-type']?.toLowerCase();
    const isZip = contentType === 'application/zip' || 
                  response.headers['content-disposition']?.includes('.zip');
    const isPdf = contentType === 'application/pdf' ||
                  response.headers['content-disposition']?.includes('.pdf');
                  
    if (!isPdf && !isZip) {
      try {
        const errorText = await response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Error splitting PDF');
        } catch (e) {
          throw new Error(errorText || 'Error splitting PDF');
        }
      } catch (e) {
        console.warn('Unexpected response type, but continuing anyway');
      }
    }
    
    // Return the blob data with an appropriate filename
    if (isZip) {
      // For ZIP files, set the correct filename
      const result = response.data;
      result.filename = 'split-files.zip';
      return result;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error splitting PDF:', error);
    throw error;
  }
};

// Helper function to handle file downloads
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  link.remove();
  window.URL.revokeObjectURL(url);
};

// PDF compression operations - completely rewritten
export const compressPdf = async (file: File, options?: any) => {
  // Validate input
  if (!file) {
    throw new Error('A PDF file is required for compression');
  }
  
  // Validate file is a PDF
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error(`The file "${file.name}" is not a PDF`);
  }
  
  // Validate file size (15MB limit)
  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the maximum limit of 15MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
  }
  
  // Create form data and add the file
  const formData = new FormData();
  formData.append('file', file);
  
  // Add compression options if provided
  if (options) {
    console.log('Sending options to backend:', options);
    
    // Make sure we're using imageCompression parameter not compressionLevel
    const correctedOptions = { ...options };
    if (options.compressionLevel && !options.imageCompression) {
      correctedOptions.imageCompression = options.compressionLevel;
      delete correctedOptions.compressionLevel;
    }
    
    // Add each option as a separate field
    Object.entries(correctedOptions).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
  }
  
  try {
    // Get the PDF file and compression stats in one response
    const response = await api.post('/pdf/compress', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob'
    });
    
    // Verify we got a PDF back
    if (response.headers['content-type'] !== 'application/pdf') {
      throw new Error('Invalid response type from server');
    }
    
    // Get compression ratio from header
    const compressionRatio = parseFloat(response.headers['x-compression-ratio'] || '0');
    console.log(`Compression ratio from header: ${compressionRatio}%`);
    
    // Create a wrapper object that includes both the PDF and the stats
    return {
      // The actual PDF file
      file: response.data,
      
      // Stats about the compression
      compressionStats: {
        compressionRatio: compressionRatio,
        originalSize: file.size,
        compressedSize: response.data.size
      }
    };
  } catch (error) {
    console.error('PDF compression error:', error);
    throw error;
  }
};

// PDF rotation operations
export const rotatePdf = async (file: File, rotations: {page: number; degrees: number}[]) => {
  // Validate input
  if (!file) {
    throw new Error('A PDF file is required for rotation');
  }
  
  // Validate file is a PDF
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error(`The file "${file.name}" is not a PDF`);
  }
  
  // Validate rotations array
  if (!rotations || rotations.length === 0) {
    throw new Error('At least one rotation instruction is required');
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  // Try a different approach - use a single rotations field with JSON string
  // This may be how the controller is parsing the input
  formData.append('rotations', JSON.stringify(rotations));
  
  try {
    const response = await api.post('/pdf/rotate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });
    
    // Verify the response is a valid PDF
    if (response.headers['content-type'] !== 'application/pdf') {
      try {
        const errorText = await response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Error rotating PDF pages');
        } catch (e) {
          throw new Error(errorText || 'Error rotating PDF pages');
        }
      } catch (e) {
        console.warn('Unexpected response type, but continuing anyway');
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error rotating PDF:', error);
    throw error;
  }
};

// PDF protection operations
export const protectPdf = async (file: File, options: any) => {
  // Validate input
  if (!file) {
    throw new Error('A PDF file is required for protection');
  }
  
  // Validate file is a PDF
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error(`The file "${file.name}" is not a PDF`);
  }
  
  // Validate password exists
  if (!options.userPassword) {
    throw new Error('A user password is required to protect the PDF');
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  // Add protection options
  Object.entries(options).forEach(([key, value]) => {
    // Convert boolean values properly
    if (typeof value === 'boolean') {
      formData.append(key, value ? 'true' : 'false');
    } else {
      formData.append(key, String(value));
    }
  });
  
  try {
    const response = await api.post('/pdf/protect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });
    
    // Verify the response is a valid PDF
    if (response.headers['content-type'] !== 'application/pdf') {
      try {
        const errorText = await response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Error protecting PDF');
        } catch (e) {
          throw new Error(errorText || 'Error protecting PDF');
        }
      } catch (e) {
        console.warn('Unexpected response type, but continuing anyway');
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error protecting PDF:', error);
    throw error;
  }
};

export const removeProtection = async (file: File, password: string) => {
  // Validate input
  if (!file) {
    throw new Error('A PDF file is required');
  }
  
  // Validate file is a PDF
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error(`The file "${file.name}" is not a PDF`);
  }
  
  // Validate password exists
  if (!password) {
    throw new Error('A password is required to remove protection');
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('password', password);
  
  try {
    const response = await api.post('/pdf/protect/remove', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });
    
    // Verify the response is a valid PDF
    if (response.headers['content-type'] !== 'application/pdf') {
      try {
        const errorText = await response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Error removing PDF protection');
        } catch (e) {
          throw new Error(errorText || 'Error removing PDF protection');
        }
      } catch (e) {
        console.warn('Unexpected response type, but continuing anyway');
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error removing PDF protection:', error);
    throw error;
  }
};

export const checkPdfProtection = async (file: File) => {
  // Validate input
  if (!file) {
    throw new Error('A PDF file is required');
  }
  
  // Validate file is a PDF
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error(`The file "${file.name}" is not a PDF`);
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post('/pdf/protect/check', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error checking PDF protection:', error);
    throw error;
  }
};

// PDF to DOCX conversion operations
export const convertPdfToDocx = async (file: File, options?: any) => {
  // Validate input
  if (!file) {
    throw new Error('A PDF file is required for conversion');
  }
  
  // Validate file is a PDF
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error(`The file "${file.name}" is not a PDF`);
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  // Add options if provided
  if (options) {
    formData.append('options', JSON.stringify(options));
  }
  
  try {
    // Use the basic or advanced endpoint based on options
    const isAdvanced = options && Object.keys(options).length > 0;
    const endpoint = isAdvanced ? '/pdf/convert/to-word/advanced' : '/pdf/convert/to-word/basic';
    
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });
    
    // Log information about the response
    console.log('PDF to DOCX conversion response:', {
      status: response.status,
      contentType: response.headers['content-type'],
      contentDisposition: response.headers['content-disposition'],
      dataSize: response.data.size
    });
    
    // Verify the response content type
    if (response.headers['content-type'] !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        !response.headers['content-disposition']?.includes('.docx')) {
      // Try to parse error message if response is not a DOCX
      try {
        const errorText = await response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Error converting PDF to DOCX');
        } catch (e) {
          throw new Error(errorText || 'Error converting PDF to DOCX');
        }
      } catch (e) {
        console.warn('Unexpected response type, but continuing anyway');
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error converting PDF to DOCX:', error);
    throw error;
  }
};

export default api;

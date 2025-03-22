import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import FileUpload from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";
import usePdfOperations from "@/hooks/use-pdf-operations";
import { getToolById } from "@/constants/toolData";
import ToolHeader from "@/components/pdf-tools/ToolHeader";
import StepProgress from "@/components/pdf-tools/StepProgress";
import ProcessingButton from "@/components/pdf-tools/ProcessingButton";
import OperationComplete from "@/components/pdf-tools/OperationComplete";
import { downloadFile } from "@/services/api";

// Temporary icon for the PDF to DOCX tool
const PdfToDocxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <path d="M14 2v6h6"></path>
    <path d="M16 13H8"></path>
    <path d="M16 17H8"></path>
    <path d="M10 9H8"></path>
  </svg>
);

const PdfToDocx: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(1);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [conversionQuality, setConversionQuality] = useState<string>("standard");
  
  // Since this tool might not be in the toolData yet, we'll create a manual definition
  const tool = {
    id: "pdf-to-docx",
    title: "PDF to Word (DOCX)",
    description: "Convert your PDF files to editable Word documents",
    icon: <PdfToDocxIcon />,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    steps: [
      "Upload your PDF file",
      "Choose conversion options",
      "Convert and download your Word document"
    ],
    accepts: ".pdf",
    path: "/tools/pdf-to-docx"
  };
  
  const { toast } = useToast();
  
  // Initialize PDF operations
  const { convertPdfToDocx, isLoading, error, getFriendlyErrorMessage } = usePdfOperations({
    onSuccess: (data: Blob, filename: string) => {
      // Check if the data is actually a DOCX file
      if (data.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          data.size > 1000) { // Basic size check to filter out error responses
        // Create URL for the blob data
        const url = window.URL.createObjectURL(new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }));
        setConvertedFileUrl(url);
        setProcessingComplete(true);
        
        toast({
          title: "Success!",
          description: "Your PDF has been converted to Word (DOCX).",
          duration: 5000,
        });
      } else {
        // Likely received an error response
        toast({
          title: "Conversion Error",
          description: "The server returned an invalid document. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
      setProcessing(false);
      setStep(3);
    },
    onError: (error: Error) => {
      setProcessing(false);
      toast({
        title: "Error",
        description: error.message || "An error occurred while converting your PDF file.",
        variant: "destructive",
        duration: 5000,
      });
    }
  });
  
  // Clean up URL objects when component unmounts
  useEffect(() => {
    return () => {
      if (convertedFileUrl) {
        URL.revokeObjectURL(convertedFileUrl);
      }
    };
  }, [convertedFileUrl]);
  
  // Handle file uploads
  const handleFilesSelected = (selectedFiles: File[]) => {
    // Only take the first file for conversion
    if (selectedFiles.length > 0) {
      setFiles([selectedFiles[0]]);
      setStep(2);
    }
  };
  
  // Handle conversion
  const handleConvert = async () => {
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please upload a PDF file first.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setProcessing(true);
    
    try {
      // Create conversion options based on selected quality
      const options = {
        quality: conversionQuality,
        formatting: {
          preserveImages: true,
          preserveLinks: true,
          preserveTables: true,
        },
        advanced: {
          detectHeadings: true,
          detectLists: true,
          optimizeForAccessibility: conversionQuality === "precise",
        }
      };
      
      await convertPdfToDocx(files[0], options);
      
    } catch (error) {
      console.error("Conversion error:", error);
      // Error is already handled by usePdfOperations
    }
  };
  
  // Reset the form to start over
  const handleReset = () => {
    // Clean up the URL object to avoid memory leaks
    if (convertedFileUrl) {
      URL.revokeObjectURL(convertedFileUrl);
    }
    
    setFiles([]);
    setConversionQuality("standard");
    setStep(1);
    setConvertedFileUrl(null);
    setProcessingComplete(false);
    setProcessing(false);
  };
  
  // Get file name with DOCX extension
  const getConvertedFileName = () => {
    if (!files.length) return "document.docx";
    
    const originalName = files[0].name.split('.')[0] || "document";
    return `${originalName}.docx`;
  };
  
  // Render different content based on the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-xl mx-auto w-full">
            <FileUpload 
              onFilesSelected={handleFilesSelected}
              accept=".pdf"
              multiple={false}
            />
          </div>
        );
      case 2:
        return (
          <div className="max-w-xl mx-auto w-full bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Conversion Options</h3>
            
            {files.length > 0 && (
              <div className="mb-6 p-3 bg-gray-50 rounded flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <path d="M14 2v6h6"></path>
                </svg>
                <span className="text-sm">{files[0].name}</span>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conversion Quality
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    conversionQuality === "basic" 
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-500" 
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => setConversionQuality("basic")}
                >
                  Basic
                  <span className="block text-xs mt-1 font-normal">
                    Faster conversion, simpler formatting
                  </span>
                </button>
                
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    conversionQuality === "standard" 
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-500" 
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => setConversionQuality("standard")}
                >
                  Standard
                  <span className="block text-xs mt-1 font-normal">
                    Good balance of speed and quality
                  </span>
                </button>
                
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    conversionQuality === "precise" 
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-500" 
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => setConversionQuality("precise")}
                >
                  Precise
                  <span className="block text-xs mt-1 font-normal">
                    Best formatting quality, slower
                  </span>
                </button>
              </div>
            </div>
            
            <div className="mt-8">
              <ProcessingButton
                onClick={handleConvert}
                processing={processing}
                text="Convert to Word"
                processingText="Converting..."
              />
            </div>
          </div>
        );
      case 3:
        return (
          <OperationComplete 
            fileName={getConvertedFileName()}
            fileType="Word Document"
            fileUrl={convertedFileUrl}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <div className="py-16 container mx-auto px-4 sm:px-6">
        <ToolHeader 
          title={tool.title}
          description={tool.description}
          icon={tool.icon}
          color={tool.color}
          bgColor={tool.bgColor}
        />
        
        <StepProgress
          steps={tool.steps}
          currentStep={step}
        />
        
        <div className="max-w-4xl mx-auto">
          {renderStep()}
        </div>
      </div>
    </Layout>
  );
};

export default PdfToDocx;

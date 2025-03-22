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
import { cn } from "@/lib/utils";
import { RotateCw, RotateCcw, HelpCircle, Plus, Trash } from "lucide-react";

interface PageRotation {
  page: number;
  degrees: number;
}

const RotatePDF: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(1);
  const [rotatedPdfUrl, setRotatedPdfUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [rotations, setRotations] = useState<PageRotation[]>([{ page: 1, degrees: 90 }]);
  const [totalPages, setTotalPages] = useState<number>(0);
  
  // Get the tool data
  const tool = getToolById("rotate-pdf");
  const { toast } = useToast();
  
  // Initialize PDF operations
  const { rotatePdf, isLoading, error, getFriendlyErrorMessage } = usePdfOperations({
    onSuccess: (data: Blob, filename: string) => {
      // Create URL for the blob data
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      
      setRotatedPdfUrl(url);
      setProcessing(false);
      setProcessingComplete(true);
      setStep(3);
      
      toast({
        title: "Success!",
        description: "Your rotated PDF is ready for download.",
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      setProcessing(false);
      toast({
        title: "Error",
        description: error.message || "An error occurred while rotating your PDF file.",
        variant: "destructive",
        duration: 5000,
      });
    }
  });
  
  // Clean up URL objects when component unmounts
  useEffect(() => {
    return () => {
      if (rotatedPdfUrl) {
        URL.revokeObjectURL(rotatedPdfUrl);
      }
    };
  }, [rotatedPdfUrl]);
  
  // Handle file uploads
  const handleFilesSelected = (selectedFiles: File[]) => {
    // Only take the first file for rotation
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      
      // Validate file is a PDF
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a PDF file for rotation.",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }
      
      setFiles([file]);
      
      // Simple estimate of page count based on file size
      // In a real application, you'd use the pdf-lib library to get the exact page count
      const estimatedPages = Math.max(1, Math.floor(file.size / 50000));
      setTotalPages(estimatedPages);
      
      if (step === 1) {
        setStep(2);
      }
    }
  };
  
  // Add a new rotation
  const addRotation = () => {
    setRotations([...rotations, { page: 1, degrees: 90 }]);
  };
  
  // Remove a rotation
  const removeRotation = (index: number) => {
    const updatedRotations = [...rotations];
    updatedRotations.splice(index, 1);
    setRotations(updatedRotations);
  };
  
  // Update a rotation
  const updateRotation = (index: number, field: 'page' | 'degrees', value: number) => {
    const updatedRotations = [...rotations];
    updatedRotations[index] = { ...updatedRotations[index], [field]: value };
    setRotations(updatedRotations);
  };
  
  // Handle the rotation process
  const handleRotatePdf = async () => {
    setProcessing(true);
    
    // Reset any previous URL
    setRotatedPdfUrl(null);
    
    try {
      if (files.length !== 1) {
        toast({
          title: "Error",
          description: "Please select exactly one PDF file to rotate.",
          variant: "destructive",
          duration: 5000,
        });
        setProcessing(false);
        return;
      }
      
      // Validate rotations
      if (rotations.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one rotation instruction.",
          variant: "destructive",
          duration: 5000,
        });
        setProcessing(false);
        return;
      }
      
      // Validate page numbers
      const invalidPageRotations = rotations.filter(r => r.page < 1 || r.page > totalPages);
      if (invalidPageRotations.length > 0) {
        toast({
          title: "Error",
          description: `Invalid page number(s): ${invalidPageRotations.map(r => r.page).join(', ')}. PDF has approximately ${totalPages} pages.`,
          variant: "destructive",
          duration: 5000,
        });
        setProcessing(false);
        return;
      }
      
      await rotatePdf(files[0], rotations);
    } catch (err) {
      // Show error toast
      toast({
        title: "Error",
        description: error ? getFriendlyErrorMessage(error) : "An error occurred while rotating your PDF file.",
        variant: "destructive",
        duration: 5000,
      });
      console.error("Error rotating PDF:", err);
      setProcessing(false);
    }
  };
  
  // Reset the form to start over
  const handleReset = () => {
    // Clean up the URL object to avoid memory leaks
    if (rotatedPdfUrl) {
      URL.revokeObjectURL(rotatedPdfUrl);
    }
    
    setFiles([]);
    setRotations([{ page: 1, degrees: 90 }]);
    setStep(1);
    setRotatedPdfUrl(null);
    setProcessingComplete(false);
    setProcessing(false);
    setTotalPages(0);
  };
  
  // Render different content based on the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-xl mx-auto w-full animate-fade-in animate-once">
            <FileUpload 
              onFilesSelected={handleFilesSelected}
              accept={tool?.accepts || ".pdf"}
              multiple={false}
            />
          </div>
        );
      case 2:
        return (
          <div className="max-w-xl mx-auto w-full animate-fade-in animate-once">
            <h3 className="text-lg font-medium mb-4">Rotate PDF Pages</h3>
            <div className="border rounded-lg p-6 bg-secondary/30">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Specify which pages to rotate and the rotation angle for each page.
                </p>
                
                {rotations.map((rotation, index) => (
                  <div key={index} className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Page</label>
                      <input
                        type="number"
                        min="1"
                        max={totalPages || 999}
                        className={cn(
                          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                          "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          "disabled:cursor-not-allowed disabled:opacity-50"
                        )}
                        value={rotation.page}
                        onChange={(e) => updateRotation(index, 'page', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Angle</label>
                      <select
                        className={cn(
                          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          "disabled:cursor-not-allowed disabled:opacity-50"
                        )}
                        value={rotation.degrees}
                        onChange={(e) => updateRotation(index, 'degrees', parseInt(e.target.value))}
                      >
                        <option value={90}>90° Clockwise</option>
                        <option value={180}>180° Upside Down</option>
                        <option value={270}>90° Counter-Clockwise</option>
                      </select>
                    </div>
                    
                    <div className="flex-none pt-6">
                      <button 
                        type="button" 
                        className="p-2 rounded-full hover:bg-background"
                        onClick={() => removeRotation(index)}
                        disabled={rotations.length <= 1}
                      >
                        <Trash className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addRotation}
                  className="flex items-center justify-center w-full p-2 mt-2 border border-dashed border-primary/50 rounded-md text-sm text-primary hover:bg-primary/5"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Another Page to Rotate
                </button>
              </div>
              
              <div className="bg-background p-4 rounded-lg mt-4 text-sm">
                <div className="flex items-start">
                  <HelpCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Rotation Tips</h4>
                    <ul className="text-muted-foreground mt-1 space-y-1">
                      <li className="flex items-center">
                        <RotateCw className="w-4 h-4 mr-1" /> 90° Clockwise: Rotates the page to the right
                      </li>
                      <li className="flex items-center">
                        <RotateCcw className="w-4 h-4 mr-1" /> 90° Counter-Clockwise: Rotates the page to the left
                      </li>
                      <li className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2"></path>
                          <rect width="8" height="8" x="2" y="14" rx="2"></rect>
                        </svg>
                        180° Upside Down: Flips the page upside down
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <ProcessingButton 
              onClick={handleRotatePdf}
              isProcessing={processing}
              disabled={rotations.length === 0}
              text="Rotate PDF"
            />
          </div>
        );
      case 3:
        return (
          <OperationComplete 
            fileName={`${files[0]?.name.replace('.pdf', '')}_rotated.pdf`}
            fileType="PDF Document"
            fileUrl={rotatedPdfUrl}
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
        {tool && (
          <>
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
          </>
        )}
        
        <div className="max-w-4xl mx-auto">
          {renderStep()}
        </div>
      </div>
    </Layout>
  );
};

export default RotatePDF;

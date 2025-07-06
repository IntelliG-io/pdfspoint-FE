import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import FileUpload from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";
import ToolHeader from "@/components/pdf-tools/ToolHeader";
import StepProgress from "@/components/pdf-tools/StepProgress";
import ProcessingButton from "@/components/pdf-tools/ProcessingButton";
import OperationComplete from "@/components/pdf-tools/OperationComplete";
import { convertDocxToPdf } from "@/services/api"; 

const DocxToPdfIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <path d="M14 2v6h6"></path>
    <path d="M16 13H8"></path>
    <path d="M16 17H8"></path>
    <path d="M10 9H8"></path>
  </svg>
);

const DocxToPdf: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(1);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);

  const tool = {
    id: "docx-to-pdf",
    title: "Word to PDF (DOCX)",
    description: "Convert DOCX Word documents to PDF format",
    icon: <DocxToPdfIcon />,
    color: "text-blue-600",
    bgColor: "bg-blue-200",
    steps: [
      "Upload your DOCX file",
      "Convert to PDF",
      "Download your PDF document"
    ],
    accepts: ".docx",
    path: "/tools/docx-to-pdf"
  };

  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (convertedFileUrl) {
        URL.revokeObjectURL(convertedFileUrl);
      }
    };
  }, [convertedFileUrl]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFiles([selectedFiles[0]]);
      setStep(2);
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast({ title: "Error", description: "Please select a DOCX file to convert.", variant: "destructive" });
      return;
    }

    setProcessing(true);

    try {
      const result = await convertDocxToPdf(files[0]);
      if (result instanceof Blob && result.type === "application/pdf") {
        const url = URL.createObjectURL(result);
        setConvertedFileUrl(url);
        setProcessingComplete(true);
        setStep(3);

        toast({ title: "Success!", description: "Your file has been converted to PDF." });
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (err: any) {
      toast({
        title: "Conversion Error",
        description: err.message || "Something went wrong during conversion.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    if (convertedFileUrl) {
      URL.revokeObjectURL(convertedFileUrl);
    }
    setFiles([]);
    setConvertedFileUrl(null);
    setStep(1);
    setProcessingComplete(false);
  };

  const getConvertedFileName = () => {
    if (!files.length) return "document.pdf";
    const originalName = files[0].name.split('.')[0];
    return `${originalName}.pdf`;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-xl mx-auto w-full">
            <FileUpload 
              onFilesSelected={handleFilesSelected}
              accept=".docx"
              multiple={false}
            />
          </div>
        );
      case 2:
        return (
          <div className="text-center mt-6">
            <ProcessingButton 
              onClick={handleConvert}
              isProcessing={processing}
              text="Convert to PDF"
            />
          </div>
        );
      case 3:
        return (
          <OperationComplete 
            fileName={getConvertedFileName()}
            fileType="PDF Document"
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

export default DocxToPdf;


import React from "react";
import { cn } from "@/lib/utils";
import Tool from "./Tool";
import { 
  FileOutput, 
  Combine, 
  Scissors, 
  Lock, 
  Signature, 
  FileImage, 
  FileText, 
  Crop, 
  RotateCcw,
  Download,
  Stamp,
  FileCheck,
  PenLine,
  FileHeart,
  Layers,
  FileDigit
} from "lucide-react";

interface ToolGridProps {
  className?: string;
}

const ToolGrid: React.FC<ToolGridProps> = ({ className }) => {
  const tools = [
    {
      title: "Convert PDF",
      description: "Convert PDFs to Word, PowerPoint, Excel, and more",
      icon: FileOutput,
      bgClass: "bg-blue-100",
      route: "/tool/convert-pdf"
    },
    {
      title: "Merge PDF",
      description: "Combine multiple PDFs into one document",
      icon: Combine,
      bgClass: "bg-green-100",
      route: "/tool/merge-pdf"
    },
    {
      title: "Split PDF",
      description: "Extract pages from your PDF into a new file",
      icon: Scissors,
      bgClass: "bg-amber-100",
      route: "/tool/split-pdf"
    },
    {
      title: "Compress PDF",
      description: "Reduce file size while maintaining quality",
      icon: FileHeart,
      bgClass: "bg-red-100",
      route: "/tool/compress-pdf"
    },
    {
      title: "PDF to Image",
      description: "Convert each PDF page to an image",
      icon: FileImage,
      bgClass: "bg-indigo-100",
      route: "/tool/pdf-to-image"
    },
    {
      title: "Image to PDF",
      description: "Create a PDF from multiple images",
      icon: Crop,
      bgClass: "bg-purple-100",
      route: "/tool/image-to-pdf"
    },
    {
      title: "Protect PDF",
      description: "Add password protection and permissions",
      icon: Lock,
      bgClass: "bg-slate-100",
      route: "/tool/protect-pdf"
    },
    {
      title: "Sign PDF",
      description: "Electronically sign documents",
      icon: Signature,
      bgClass: "bg-pink-100",
      route: "/tool/sign-pdf"
    },
    {
      title: "OCR PDF",
      description: "Make scanned documents searchable",
      icon: FileText,
      bgClass: "bg-emerald-100",
      route: "/tool/ocr-pdf"
    },
    {
      title: "Rotate PDF",
      description: "Change page orientation as needed",
      icon: RotateCcw,
      bgClass: "bg-cyan-100", 
      route: "/tool/rotate-pdf"
    },
    {
      title: "Number Pages",
      description: "Add page numbers to your documents",
      icon: FileDigit,
      bgClass: "bg-violet-100",
      route: "/tool/number-pdf"
    },
    {
      title: "Edit PDF",
      description: "Modify text and images in your PDF",
      icon: PenLine,
      bgClass: "bg-orange-100",
      route: "/tool/edit-pdf"
    }
  ];

  return (
    <div className={cn("container mx-auto px-4 sm:px-6 py-16", className)}>
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">All PDF Tools</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to work with PDFs in one place. Simple, powerful, beautifully designed.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <Tool
            key={index}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            bgClass={tool.bgClass}
            route={tool.route}
            className="animate-fade-in animate-once"
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ToolGrid;

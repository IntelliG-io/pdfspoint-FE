import React from "react";
import Layout from "@/components/Layout";

const HelpCenter: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Help Center</h1>
        <p className="text-muted-foreground text-center mb-10">
          Find answers to common questions and learn how to get the most out of PaperFlow.
        </p>

        <div className="space-y-6">
          {[
            {
              question: "How do I merge multiple PDFs?",
              answer: "Go to the Merge PDF tool, upload your files, arrange them in the desired order, and click 'Merge'."
            },
            {
              question: "What file formats can I convert?",
              answer: "We support PDF to DOCX, XLSX, PPTX, JPG, and vice versa. More formats are coming soon!"
            },
            {
              question: "Is my uploaded file stored permanently?",
              answer: "No. All files are automatically deleted within 2 hours of processing for your privacy."
            },
            {
              question: "Can I use PaperFlow on mobile?",
              answer: "Yes! PaperFlow is fully responsive and available on Android & iOS."
            }
          ].map((item, idx) => (
            <div key={idx}>
              <h2 className="text-lg font-semibold mb-1">{item.question}</h2>
              <p className="text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;

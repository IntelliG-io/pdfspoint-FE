import React from "react";
import Layout from "@/components/Layout";

const Blog: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">PaperFlow Blog</h1>
        <p className="text-muted-foreground text-center mb-10">
          Insights, updates, and guides to help you get the most out of your document workflow.
        </p>

        <div className="grid gap-10">
          {[
            {
              title: "5 Ways to Speed Up Your PDF Workflow",
              date: "June 15, 2025",
              excerpt: "Explore the top tips and tricks for working faster and more efficiently with your PDF files.",
            },
            {
              title: "Behind the Scenes: How PaperFlow Converts Files Securely",
              date: "May 30, 2025",
              excerpt: "A look into our secure file processing infrastructure and encryption practices.",
            },
            {
              title: "Feature Spotlight: OCR for Scanned PDFs",
              date: "May 10, 2025",
              excerpt: "Learn how our OCR tool helps you extract text from scanned documents with ease.",
            },
          ].map((post, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-card border">
              <h2 className="text-2xl font-semibold mb-1">{post.title}</h2>
              <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
              <p className="text-muted-foreground">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;

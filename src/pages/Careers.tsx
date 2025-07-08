import React from "react";
import Layout from "@/components/Layout";

const Careers: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Careers at PaperFlow</h1>
        <p className="text-muted-foreground text-center mb-10">
          Join our mission to simplify document workflows for everyone. Explore current openings below.
        </p>

        <div className="space-y-8">
          {[
            {
              title: "Frontend Developer",
              location: "Remote",
              description: "Build beautiful and performant UI for our tools using React and Tailwind.",
            },
            {
              title: "Backend Engineer",
              location: "Remote",
              description: "Work on APIs, file conversion engines, and cloud infrastructure.",
            },
            {
              title: "Marketing Specialist",
              location: "Lahore / Remote",
              description: "Drive growth through content, SEO, and strategic partnerships.",
            }
          ].map((job, idx) => (
            <div key={idx} className="border p-6 rounded-xl bg-card">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-sm text-muted-foreground mb-2">{job.location}</p>
              <p className="mb-4">{job.description}</p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Careers;

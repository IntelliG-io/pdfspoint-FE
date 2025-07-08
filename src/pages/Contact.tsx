import React from "react";
import Layout from "@/components/Layout";

const Contact: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="text-muted-foreground text-center mb-10">
          Have a question, concern, or feedback? Reach out and our team will respond shortly.
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-border bg-card" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input type="email" className="w-full px-4 py-2 rounded-lg border border-border bg-card" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea rows={5} className="w-full px-4 py-2 rounded-lg border border-border bg-card" placeholder="Your message..." />
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 font-medium"
          >
            Send Message
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Contact;

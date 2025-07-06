import React from "react";
import Layout from "@/components/Layout";

const SignUp: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
            <button
              type="submit"
              className="w-full py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Sign Up
            </button>
          </form>
          <p className="text-sm text-center">
            Already have an account? <a href="/signin" className="text-primary hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;

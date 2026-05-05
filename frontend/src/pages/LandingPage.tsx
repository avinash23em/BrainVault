import { useNavigate } from "react-router-dom";
import { Logo } from "../icons/Logo";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { Button } from "../components/Button";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-purple-600"><Logo /></div>
              <span className="ml-2 text-lg font-bold text-gray-900">BrainVaultAI</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" text="Sign In" onClick={() => navigate("/signin")} />
              <Button variant="primary" size="sm" text="Get Started" onClick={() => navigate("/signup")} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span>Powered by Pinecone + Gemini AI</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Save anything.<br />
            <span className="text-purple-600">Ask anything.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            BrainVaultAI stores your digital content and lets you query it with AI. Save documents, videos, and links — then ask questions and get intelligent answers from your own memory.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" size="lg" text="Start for free" onClick={() => navigate("/signup")} />
            <Button variant="secondary" size="lg" text="Sign in" onClick={() => navigate("/signin")} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Save your content</h3>
              <p className="text-gray-500 text-sm">Add documents, YouTube videos, tweets, or any links. Write notes and descriptions for each item.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI indexes it</h3>
              <p className="text-gray-500 text-sm">Your content is converted to vector embeddings and stored in Pinecone for semantic search.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ask questions</h3>
              <p className="text-gray-500 text-sm">Query your saved memory in plain English. Gemini AI reads the relevant content and answers you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo UI */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your memory, organized</h2>
              <p className="text-gray-500 mb-6 text-sm">Everything saved in one place — documents, videos, links, and notes.</p>
              <div className="space-y-3">
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                  <div className="text-red-500"><YoutubeIcon /></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">React Hooks Deep Dive</p>
                    <p className="text-xs text-gray-400">YouTube · saved 2 days ago</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                  <div className="text-purple-500"><DocumentIcon /></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">MongoDB indexing strategies</p>
                    <p className="text-xs text-gray-400">Document · saved 5 days ago</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                  <div className="text-blue-500"><TwitterIcon /></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Thread on vector databases</p>
                    <p className="text-xs text-gray-400">Twitter · saved 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ask your memory</h2>
              <p className="text-gray-500 mb-6 text-sm">Natural language queries. AI finds what's relevant and explains it.</p>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700 mb-4 border border-gray-100">
                  "How do I use React hooks with MongoDB?"
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">AI</span>
                    </div>
                    <span className="text-xs font-medium text-purple-700">BrainVaultAI</span>
                  </div>
                  <p className="text-sm text-gray-700">Based on your saved content, here's how to combine React hooks with MongoDB. The useEffect hook works well for data fetching...</p>
                  <p className="text-xs text-purple-500 mt-2">Referenced 2 items from your memory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Everything you need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🔍", title: "Semantic search", desc: "Finds meaning, not just keywords. Ask naturally." },
              { icon: "📄", title: "Multi-type content", desc: "Documents, YouTube, Twitter, LinkedIn, Instagram, links." },
              { icon: "🔒", title: "Private by default", desc: "JWT auth. Your data stays yours." },
              { icon: "🌐", title: "Share your brain", desc: "Generate a public link to share your collection." },
              { icon: "✏️", title: "Edit anytime", desc: "Update or delete any saved content instantly." },
              { icon: "⚡", title: "Fast retrieval", desc: "Pinecone vector DB returns results in milliseconds." },
            ].map((f) => (
              <div key={f.title} className="p-5 rounded-xl border border-gray-200 bg-gray-50">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to build your AI memory?</h2>
          <p className="text-gray-500 mb-8">Free to use. No credit card required.</p>
          <Button variant="primary" size="lg" text="Create your vault" onClick={() => navigate("/signup")} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="text-purple-600"><Logo /></div>
            <span className="font-bold text-gray-900">BrainVaultAI</span>
          </div>
          <p className="text-sm text-gray-400">
            Built by{" "}
            <a href="https://github.com/avinash23em" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
              Avinash
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

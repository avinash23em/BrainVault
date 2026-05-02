import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CreateContentModel } from "../components/CreateContentModel";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { ShareMemoryModal } from "../components/ShareMemoryModal";
import { QueryModal } from "../components/QueryModal";
import { EditContentModal } from "../components/EditContentModal";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { SidebarIcon } from "../icons/SidebarIcon";
import { QueryIcon } from "../icons/QueryIcon";
import { Sidebar } from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { UserProfile } from "../components/UserProfile";
import { useNavigate } from "react-router-dom";
import { Logo } from "../icons/Logo";

export function Dashboard() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [contentToDelete, setContentToDelete] = useState<{ id: string; title: string } | null>(null);
  const [contentToEdit, setContentToEdit] = useState<{
    _id: string; title: string; link: string; type: string; description?: string;
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareModalLoading, setShareModalLoading] = useState(false);
  const { content, fetchContent } = useContent(selectedContentType);

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => { checkSharingStatus(); }, []);

  const checkSharingStatus = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/brain/share`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShareUrl(response.data.hash ? `${window.location.origin}/brain/${response.data.hash}` : null);
    } catch { setShareUrl(null); }
  };

  const handleEnableSharing = async () => {
    setShareLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, { share: true }, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const hash = response.data.hash || response.data.shareLink;
      setShareUrl(`${window.location.origin}/brain/${hash}`);
    } catch { alert("Failed to enable sharing."); }
    finally { setShareLoading(false); }
  };

  const handleDisableSharing = async () => {
    setShareLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/v1/brain/share`, { share: false }, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShareUrl(null);
    } catch { alert("Failed to disable sharing."); }
    finally { setShareLoading(false); }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setContentToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contentToDelete) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { contentId: contentToDelete.id },
      });
      fetchContent();
      setDeleteModalOpen(false);
      setContentToDelete(null);
    } catch { alert("Failed to delete content."); }
  };

  const handleEditClick = (content: { _id: string; title: string; link: string; type: string; description?: string }) => {
    setContentToEdit(content);
    setEditModalOpen(true);
  };

  const handleShareModalOpen = async () => {
    setShareModalOpen(true);
    setShareModalLoading(true);
    await checkSharingStatus();
    setShareModalLoading(false);
  };

  const getEmptyLabel = () => {
    const map: Record<string, { title: string; desc: string }> = {
      home:      { title: "Your vault is empty", desc: "Add documents, videos, links — anything worth remembering." },
      document:  { title: "No documents yet", desc: "Save notes and text content here." },
      youtube:   { title: "No YouTube videos yet", desc: "Save videos you want to come back to." },
      twitter:   { title: "No tweets yet", desc: "Save Twitter threads and posts here." },
      pinterest: { title: "No Pinterest content yet", desc: "Save pins and boards here." },
      linkedin:  { title: "No LinkedIn posts yet", desc: "Save professional content here." },
      instagram: { title: "No Instagram posts yet", desc: "Save posts and reels here." },
      link:      { title: "No links yet", desc: "Save useful websites and articles here." },
    };
    return map[selectedContentType] || map.home;
  };

  const emptyLabel = getEmptyLabel();
  const contentTypes = ["youtube", "document", "twitter", "linkedin", "instagram", "pinterest", "link"];

  return (
    <div className="relative">
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <div className={`${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 fixed z-50 md:z-auto`}>
        <Sidebar onContentTypeChange={(t) => { setSelectedContentType(t); setMobileMenuOpen(false); setSearchQuery(""); }} selectedType={selectedContentType} onClose={() => setMobileMenuOpen(false)} />
      </div>

      <div className={`min-h-screen bg-gray-50 ${mobileMenuOpen ? "blur-sm md:blur-none" : ""} ml-0 md:ml-72 flex flex-col`}>

        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-600">
              <SidebarIcon />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div className="text-purple-600"><Logo /></div>
              <span className="font-bold text-gray-900">BrainVaultAI</span>
            </div>
            <h1 className="md:hidden text-base font-semibold text-gray-800">BrainVaultAI</h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm hidden sm:block">
            <input
              type="text"
              placeholder="Search your vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQueryModalOpen(true)}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <QueryIcon />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <PlusIcon />
              <span className="hidden sm:inline">Add</span>
            </button>
            <button
              onClick={handleShareModalOpen}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ShareIcon />
            </button>
            <UserProfile onSignout={() => navigate("/signin", { replace: true })} />
          </div>
        </div>

        {/* Modals */}
        <CreateContentModel open={modalOpen} onClose={() => { setModalOpen(false); fetchContent(); }} />
        <EditContentModal open={editModalOpen} onClose={() => { setEditModalOpen(false); setContentToEdit(null); fetchContent(); }} content={contentToEdit} />
        <DeleteConfirmationModal open={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setContentToDelete(null); }} onConfirm={handleDeleteConfirm} title={contentToDelete?.title || ""} />
        <ShareMemoryModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} shareUrl={shareUrl} onEnableSharing={handleEnableSharing} onDisableSharing={handleDisableSharing} isLoading={shareLoading} isModalLoading={shareModalLoading} />
        <QueryModal open={queryModalOpen} onClose={() => setQueryModalOpen(false)} />

        {/* Main */}
        <div className="flex-1 p-4 md:p-6">

          {/* Mobile search */}
          <div className="sm:hidden mb-4">
            <input
              type="text"
              placeholder="Search your vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            />
          </div>

          {/* Stats bar */}
          {content.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full">
                {content.length} total
              </span>
              {contentTypes
                .filter(t => content.some(c => c.type === t))
                .map(t => (
                  <span key={t} className="text-xs bg-purple-50 border border-purple-100 text-purple-600 px-3 py-1 rounded-full capitalize">
                    {content.filter(c => c.type === t).length} {t}
                  </span>
                ))}
            </div>
          )}

          {/* Content grid */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 min-h-96">
            {filteredContent.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredContent.map(({ _id, type, link, title, description }) => (
                  <Card
                    key={_id} _id={_id} title={title} link={link}
                    type={type as "link" | "youtube" | "twitter" | "pinterest" | "linkedin" | "instagram" | "document"}
                    description={description} onDelete={handleDeleteClick} onEdit={handleEditClick}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  {searchQuery ? `No results for "${searchQuery}"` : emptyLabel.title}
                </h3>
                <p className="text-sm text-gray-400 mb-5 max-w-xs">
                  {searchQuery ? "Try a different search term." : emptyLabel.desc}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <PlusIcon /> Add content
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 text-center text-xs text-gray-400">
          BrainVaultAI — your AI-powered digital memory
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Package,
  Layers,
  Receipt,
  FolderPlus,
  Tag,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  X,
  UserCheck,
  Calendar,
  Mail,
  Phone,
  Shield,
  ExternalLink,
  DollarSign,
  ShieldCheck,
  Box,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminDashboard({
  users = [],
  gearItems = [],
  rentalOrders = [],
  categories = [],
  onUpdateUserStatus,
  onCreateCategory,
}: {
  users: any;
  gearItems: any;
  rentalOrders: any;
  categories: any;
  onUpdateUserStatus?: (userId: string, activeStatus: string) => Promise<any>;
  onCreateCategory?: (categoryData: { name: string; description: string; image?: string }) => Promise<any>;
}) {
  const [activeTab, setActiveTab] = useState<"users" | "gear" | "rentals" | "categories">("users");
  
  // Safe array normalization
  const userList = Array.isArray(users) ? users : users?.users || [];
  const gearList = Array.isArray(gearItems) ? gearItems : gearItems?.gearItems || [];
  const rentalList = Array.isArray(rentalOrders) ? rentalOrders : rentalOrders?.rentalOrders || [];
  const categoryList = Array.isArray(categories) ? categories : categories?.categories || [];

  // Modal States & URL Synchronization
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedRental, setSelectedRental] = useState<any | null>(null);
  const [selectedGear, setSelectedGear] = useState<any | null>(null);

  // Sync URL query parameters on mount & updates
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const rentalId = params.get("rentalId");
    const gearId = params.get("gearId");

    if (userId && userList.length > 0) {
      const match = userList.find((u: any) => u.id === userId);
      if (match) {
        setSelectedUser(match);
        setActiveTab("users");
      }
    } else if (rentalId && rentalList.length > 0) {
      const match = rentalList.find((r: any) => r.id === rentalId);
      if (match) {
        setSelectedRental(match);
        setActiveTab("rentals");
      }
    } else if (gearId && gearList.length > 0) {
      const match = gearList.find((g: any) => g.id === gearId);
      if (match) {
        setSelectedGear(match);
        setActiveTab("gear");
      }
    }
  }, [users, gearItems, rentalOrders]);

  // URL State Handlers
  const openUserModal = (user: any) => {
    setSelectedUser(user);
    const url = new URL(window.location.href);
    url.searchParams.set("userId", user.id);
    url.searchParams.delete("rentalId");
    url.searchParams.delete("gearId");
    window.history.pushState({}, "", url.toString());
  };

  const openRentalModal = (rental: any) => {
    setSelectedRental(rental);
    const url = new URL(window.location.href);
    url.searchParams.set("rentalId", rental.id);
    url.searchParams.delete("userId");
    url.searchParams.delete("gearId");
    window.history.pushState({}, "", url.toString());
  };

  const openGearModal = (gear: any) => {
    setSelectedGear(gear);
    const url = new URL(window.location.href);
    url.searchParams.set("gearId", gear.id);
    url.searchParams.delete("userId");
    url.searchParams.delete("rentalId");
    window.history.pushState({}, "", url.toString());
  };

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedRental(null);
    setSelectedGear(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("userId");
    url.searchParams.delete("rentalId");
    url.searchParams.delete("gearId");
    window.history.pushState({}, "", url.toString());
  };

  // Interactive Category Accordion State
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // New Category Form State
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [newCategoryImg, setNewCategoryImg] = useState("");
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);

  const handleCreateCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return alert("Category name is required.");
    
    setIsSubmittingCat(true);
    try {
      if (onCreateCategory) {
        const payload = {
          name: newCategoryName,
          description: newCategoryDesc,
          image: newCategoryImg || "default-category.png",
        };

        const res = await onCreateCategory(payload);
        if (res?.success) {
          alert("Category created successfully!");
          setNewCategoryName("");
          setNewCategoryDesc("");
          setNewCategoryImg("");
          window.location.reload();
        } else {
          alert(res?.message || "Failed to create category.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating the category.");
    } finally {
      setIsSubmittingCat(false);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetStatus = currentStatus === "SUSPEND" ? "ACTIVE" : "SUSPEND";
    if (!confirm(`Are you sure you want to change user status to ${targetStatus}?`)) return;

    try {
      if (onUpdateUserStatus) {
        const res = await onUpdateUserStatus(userId, targetStatus);
        if (res?.success) {
          window.location.reload();
        } else {
          alert(res?.message || "Failed to update user status.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating status.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 text-zinc-900 font-mono text-xs w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Navigation Tabs */}
        <div className="border-b border-zinc-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">
              [ Administrator Control Panel ]
            </span>
            <h1 className="text-3xl font-light tracking-tight text-zinc-900 mt-1 font-serif">
              Platform Command Center
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-white border border-zinc-200 p-1">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-3 py-2 uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === "users" ? "bg-zinc-900 text-white font-semibold" : "text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <Users className="h-3.5 w-3.5" /> Users ({userList.length})
            </button>
            <button
              onClick={() => setActiveTab("gear")}
              className={`px-3 py-2 uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === "gear" ? "bg-zinc-900 text-white font-semibold" : "text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <Package className="h-3.5 w-3.5" /> Gear Directory ({gearList.length})
            </button>
            <button
              onClick={() => setActiveTab("rentals")}
              className={`px-3 py-2 uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === "rentals" ? "bg-zinc-900 text-white font-semibold" : "text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <Receipt className="h-3.5 w-3.5" /> Rentals ({rentalList.length})
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-3 py-2 uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === "categories" ? "bg-zinc-900 text-white font-semibold" : "text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Categories ({categoryList.length})
            </button>
          </div>
        </div>

        {/* TAB 1: USERS */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
              <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
                Registered Platform Users ({userList.length})
              </h2>
              <span className="text-[10px] text-zinc-400">Click any user card for inspection modal</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {userList.map((u: any) => {
                const userStatus = u.activeStatus || "ACTIVE";
                const isSuspended = userStatus === "SUSPEND";

                return (
                  <div
                    key={u.id}
                    onClick={() => openUserModal(u)}
                    className="bg-white border border-zinc-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-900 cursor-pointer transition-all shadow-xs group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 flex items-center justify-center border font-bold text-sm uppercase shrink-0 ${
                        isSuspended ? "bg-red-50 border-red-200 text-red-600" : "bg-zinc-900 border-zinc-900 text-white"
                      }`}>
                        {u.name ? u.name.slice(0, 2).toUpperCase() : "US"}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-900 text-sm group-hover:underline flex items-center gap-1">
                            {u.name || "Unnamed User"}
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 text-zinc-400 transition-opacity" />
                          </span>
                          <Badge variant="outline" className="rounded-none text-[9px] uppercase tracking-wider">
                            {u.role || "CUSTOMER"}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-mono">{u.email} • ID: #{u.id.slice(0, 8)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        {isSuspended ? (
                          <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        )}
                        <span className={`text-[10px] uppercase font-semibold ${isSuspended ? "text-red-600" : "text-emerald-700"}`}>
                          {userStatus}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        variant={isSuspended ? "default" : "outline"}
                        onClick={(e) => handleStatusToggle(u.id, userStatus, e)}
                        className={`rounded-none text-[10px] uppercase h-8 px-4 ${
                          isSuspended ? "bg-zinc-900 text-white hover:bg-zinc-800" : "text-red-600 border-red-200 hover:bg-red-50"
                        }`}
                      >
                        {isSuspended ? "Activate Account" : "Suspend Account"}
                      </Button>
                    </div>
                  </div>
                );
              })}
              {userList.length === 0 && (
                <div className="bg-white border border-zinc-200 p-12 text-center text-zinc-400">
                  No users found in the system.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GEAR DIRECTORY */}
        {activeTab === "gear" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
              <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
                Global Gear Directory ({gearList.length} items)
              </h2>
              <span className="text-[10px] text-zinc-400">Click any gear card for specification inspection</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gearList.map((gear: any) => (
                <div
                  key={gear.id}
                  onClick={() => openGearModal(gear)}
                  className="border border-zinc-200 p-4 bg-white flex flex-col justify-between shadow-xs hover:border-zinc-900 cursor-pointer transition-all group"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-14 h-14 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                      <img
                        src={gear.images?.[0] || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80"}
                        alt={gear.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{gear.brand || "Brand"}</span>
                      <h4 className="text-sm font-medium text-zinc-900 truncate group-hover:underline flex items-center gap-1">
                        {gear.name}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 text-zinc-400 transition-opacity" />
                      </h4>
                      <p className="text-xs font-bold text-zinc-900 mt-0.5">৳{gear.pricePerDay} / day</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-3 border-t border-zinc-100">
                    <span>Stock: {gear.quantity} | Dep: ৳{gear.securityDeposit}</span>
                    <Badge variant="outline" className="rounded-none text-[9px] uppercase">
                      {gear.status || "AVAILABLE"}
                    </Badge>
                  </div>
                </div>
              ))}
              {gearList.length === 0 && (
                <div className="col-span-full bg-white border border-zinc-200 p-12 text-center text-zinc-400">
                  No gear items found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: RENTAL ORDERS */}
        {activeTab === "rentals" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
              <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
                Platform Rental Orders Manifest ({rentalList.length})
              </h2>
              <span className="text-[10px] text-zinc-400">Click any rental order to inspect itemized manifest</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {rentalList.map((ord: any) => (
                <div
                  key={ord.id}
                  onClick={() => openRentalModal(ord)}
                  className="bg-white border border-zinc-200 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs hover:border-zinc-900 cursor-pointer transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-zinc-900 text-sm group-hover:underline flex items-center gap-1">
                        #{ord.id.slice(0, 8).toUpperCase()}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 text-zinc-400 transition-opacity" />
                      </span>
                      <Badge variant="outline" className="rounded-none text-[10px] uppercase">
                        {ord.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Customer: <strong className="text-zinc-900">{ord.customer?.name || "N/A"}</strong> ({ord.customer?.email})
                    </p>
                  </div>

                  <div className="flex items-center gap-6 bg-[#FDFBF7] p-3 border border-zinc-200 w-full md:w-auto justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase">Rental Window</span>
                      <span className="text-zinc-900 font-medium">
                        {new Date(ord.startDate).toLocaleDateString()} — {new Date(ord.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 block uppercase">Total Amount</span>
                      <span className="text-base font-bold text-zinc-900">৳{Number(ord.totalAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {rentalList.length === 0 && (
                <div className="bg-white border border-zinc-200 p-12 text-center text-zinc-400">
                  No rental orders logged.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Create Category Form */}
            <div className="lg:col-span-4">
              <Card className="rounded-none border-zinc-200 bg-white p-6 shadow-xs space-y-4">
                <h2 className="text-xs uppercase tracking-widest text-zinc-500 pb-2 border-b border-zinc-100 flex items-center gap-1.5">
                  <FolderPlus className="h-4 w-4" /> Create New Category
                </h2>

                <form onSubmit={handleCreateCategorySubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-zinc-500">Category Name</label>
                    <Input
                      type="text"
                      placeholder="e.g., GYM, Camping"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="rounded-none border-zinc-200 h-9 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-zinc-500">Description</label>
                    <Input
                      type="text"
                      placeholder="Tents, sleeping bags and camp gear"
                      value={newCategoryDesc}
                      onChange={(e) => setNewCategoryDesc(e.target.value)}
                      className="rounded-none border-zinc-200 h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-zinc-500">Image filename/URL</label>
                    <Input
                      type="text"
                      placeholder="ssgsgsfgs.jpg"
                      value={newCategoryImg}
                      onChange={(e) => setNewCategoryImg(e.target.value)}
                      className="rounded-none border-zinc-200 h-9 text-xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmittingCat}
                    className="w-full rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs uppercase h-9 tracking-wider"
                  >
                    {isSubmittingCat ? "Creating..." : "Save Category"}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Interactive Accordion Categories */}
            <div className="lg:col-span-8">
              <div className="space-y-3">
                <div className="border-b border-zinc-200 pb-3 flex justify-between items-center">
                  <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-1.5">
                    <Tag className="h-4 w-4" /> Interactive Category Directory ({categoryList.length})
                  </h2>
                </div>

                {categoryList.map((cat: any) => {
                  const catId = cat.id || cat._id;
                  const isExpanded = !!expandedCategories[catId];
                  const items = cat.gearItems || gearList.filter((g: any) => g.categoryId === catId);

                  return (
                    <div
                      key={catId}
                      className="bg-white border border-zinc-200 transition-all shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleCategoryExpand(catId)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-zinc-900 text-sm">{cat.name}</span>
                            <Badge className="rounded-none text-[9px] uppercase bg-zinc-100 text-zinc-800 border border-zinc-200">
                              {items.length} Gear Item(s)
                            </Badge>
                          </div>
                          <p className="text-[11px] text-zinc-500">{cat.description || "No description provided."}</p>
                        </div>

                        <div className="flex items-center gap-2 text-zinc-400">
                          <span className="text-[10px] uppercase font-mono">{isExpanded ? "Collapse" : "Expand"}</span>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 border-t border-zinc-100 bg-[#FDFBF7] space-y-2">
                          {items.length > 0 ? (
                            items.map((g: any) => (
                              <div
                                key={g.id}
                                onClick={() => openGearModal(g)}
                                className="bg-white border border-zinc-200 p-3 flex items-center justify-between gap-4 shadow-2xs hover:border-zinc-900 cursor-pointer transition-all"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 bg-zinc-100 border border-zinc-200 shrink-0 overflow-hidden">
                                    <img
                                      src={g.images?.[0] || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=100&q=80"}
                                      alt={g.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[9px] uppercase tracking-widest text-zinc-400">{g.brand || "Brand"}</p>
                                    <h4 className="text-xs font-medium text-zinc-900 truncate">{g.name}</h4>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                  <span className="font-mono font-bold text-zinc-900 text-xs">৳{g.pricePerDay}/day</span>
                                  <Badge variant="outline" className="rounded-none text-[9px] uppercase">
                                    Stock: {g.quantity}
                                  </Badge>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-6 text-center text-zinc-400 text-xs">
                              No gear items currently assigned to this category.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {categoryList.length === 0 && (
                  <div className="bg-white border border-zinc-200 p-12 text-center text-zinc-400">
                    No categories found.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* 1. USER INSPECTION DETAIL MODAL */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg border border-zinc-300 bg-[#FDFBF7] p-8 rounded-none shadow-2xl space-y-6 relative font-mono text-xs">
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="border-b border-zinc-300 pb-4 space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">
                  [ Account Record File ]
                </span>
                <h2 className="text-2xl font-normal text-zinc-900 font-serif">
                  {selectedUser.name || "Unnamed Account"}
                </h2>
                <span className="text-[10px] text-zinc-400 block font-mono">
                  ID: {selectedUser.id}
                </span>
              </div>

              <div className="space-y-3 bg-white p-4 border border-zinc-200">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                  <span className="text-zinc-400 uppercase text-[10px] flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-zinc-600" /> Email Address
                  </span>
                  <span className="font-semibold text-zinc-900">{selectedUser.email}</span>
                </div>

                <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                  <span className="text-zinc-400 uppercase text-[10px] flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-zinc-600" /> Account Role
                  </span>
                  <Badge variant="outline" className="rounded-none text-[10px] uppercase">
                    {selectedUser.role || "CUSTOMER"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                  <span className="text-zinc-400 uppercase text-[10px] flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-zinc-600" /> Active Status
                  </span>
                  <Badge
                    variant={selectedUser.activeStatus === "SUSPEND" ? "destructive" : "default"}
                    className="rounded-none text-[10px] uppercase"
                  >
                    {selectedUser.activeStatus || "ACTIVE"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                  <span className="text-zinc-400 uppercase text-[10px] flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-zinc-600" /> Phone Contact
                  </span>
                  <span className="text-zinc-900">{selectedUser.profile?.phone || "Not provided"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 uppercase text-[10px] flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-zinc-600" /> Member Since
                  </span>
                  <span className="text-zinc-900">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>

              {selectedUser.profile?.bio && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 block">User Bio</span>
                  <p className="p-3 bg-white border border-zinc-200 text-zinc-700 italic text-[11px]">
                    "{selectedUser.profile.bio}"
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-zinc-300 flex justify-between items-center">
                <Button
                  size="sm"
                  variant={selectedUser.activeStatus === "SUSPEND" ? "default" : "outline"}
                  onClick={(e) => {
                    handleStatusToggle(selectedUser.id, selectedUser.activeStatus || "ACTIVE", e);
                    closeModal();
                  }}
                  className={`rounded-none text-[10px] uppercase h-9 px-4 ${
                    selectedUser.activeStatus === "SUSPEND"
                      ? "bg-zinc-900 text-white hover:bg-zinc-800"
                      : "text-red-600 border-red-200 hover:bg-red-50"
                  }`}
                >
                  {selectedUser.activeStatus === "SUSPEND" ? "Activate Account" : "Suspend Account"}
                </Button>

                <Button
                  onClick={closeModal}
                  className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs uppercase px-6 h-9"
                >
                  Close Record
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 2. RENTAL ORDER INSPECTION MODAL */}
        {selectedRental && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-xl border border-zinc-300 bg-[#FDFBF7] p-8 rounded-none shadow-2xl space-y-6 relative font-mono text-xs">
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center border-b border-zinc-300 pb-6 space-y-1 font-serif">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                  GearUp Administrator — Audit Statement
                </span>
                <h2 className="text-2xl font-normal tracking-tight text-zinc-900">
                  Rental Order #{selectedRental.id.slice(0, 8).toUpperCase()}
                </h2>
                <p className="text-xs font-mono text-zinc-500">
                  Customer: {selectedRental.customer?.name} ({selectedRental.customer?.email})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-zinc-200 pb-6">
                <div>
                  <span className="text-zinc-400 block uppercase text-[10px]">Rental Window:</span>
                  <span className="font-semibold text-zinc-900 block mt-0.5">
                    {new Date(selectedRental.startDate).toLocaleDateString()} —{" "}
                    {new Date(selectedRental.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 block uppercase text-[10px]">Fulfillment Status:</span>
                  <Badge
                    variant="outline"
                    className="rounded-none text-xs font-mono uppercase px-2 py-0.5 mt-1"
                  >
                    {selectedRental.status}
                  </Badge>
                </div>
              </div>

              {/* Itemized Manifest */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 block">
                  Itemized Manifest Ledger
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedRental.items?.map((item: any) => (
                    <div key={item.id} className="bg-white border border-zinc-200 p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-zinc-900">{item.gearItem?.name || "Equipment Item"}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">Qty: {item.quantity} unit(s)</p>
                      </div>
                      <span className="font-bold text-zinc-900">৳{Number(item.pricePerDay).toLocaleString()} / day</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-300 pt-4 flex justify-between items-center">
                <div className="text-zinc-500 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-zinc-700" />
                  <span>Admin Verified Audit Log</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 text-[10px] block uppercase">Total Valuation</span>
                  <span className="text-lg font-bold text-zinc-900">
                    ৳{Number(selectedRental.totalAmount).toLocaleString()} BDT
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200 flex justify-end">
                <Button
                  onClick={closeModal}
                  className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono uppercase px-6 h-9"
                >
                  Close Statement
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 3. GEAR ASSET INSPECTION MODAL */}
        {selectedGear && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-xl border border-zinc-300 bg-[#FDFBF7] p-8 rounded-none shadow-2xl space-y-6 relative font-mono text-xs">
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="border-b border-zinc-300 pb-4 space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">
                  [ Equipment Spec Sheet ]
                </span>
                <h2 className="text-2xl font-normal text-zinc-900 font-serif">
                  {selectedGear.name}
                </h2>
                <span className="text-[10px] text-zinc-400 block font-mono">
                  Asset ID: {selectedGear.id} • Brand: {selectedGear.brand}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-40 border border-zinc-200 bg-white overflow-hidden">
                  <img
                    src={selectedGear.images?.[0] || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"}
                    alt={selectedGear.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3 bg-white p-4 border border-zinc-200 flex flex-col justify-center">
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-400 uppercase text-[10px]">Daily Rate</span>
                    <span className="font-bold text-zinc-900">৳{selectedGear.pricePerDay}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-400 uppercase text-[10px]">Security Deposit</span>
                    <span className="font-bold text-zinc-900">৳{selectedGear.securityDeposit}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-400 uppercase text-[10px]">Stock Quantity</span>
                    <span className="font-bold text-zinc-900">{selectedGear.quantity} unit(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400 uppercase text-[10px]">Asset Status</span>
                    <Badge variant="outline" className="rounded-none text-[9px] uppercase">
                      {selectedGear.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 block">Description</span>
                <p className="p-3 bg-white border border-zinc-200 text-zinc-700 text-[11px] leading-relaxed">
                  {selectedGear.description || "No description provided."}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-300 flex justify-end">
                <Button
                  onClick={closeModal}
                  className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono uppercase px-6 h-9"
                >
                  Close Spec Sheet
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
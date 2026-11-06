"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useActionState,
} from "react";
import {
  Plus,
  Trash2,
  RefreshCw,
  X,
  ArrowUpRight,
  Upload,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Category } from "./page";
import {
  addGearItem,
  updateGearItem,
  AddGearState,
  deleteGearItem,
  restockGearItem,
} from "@/services/gear-item.service";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { RentalOrder } from "@/services/provider.service";

// Backend enums
const GearCondition = {
  NEW: "NEW",
  LIKE_NEW: "LIKE_NEW",
  GOOD: "GOOD",
  FAIR: "FAIR",
} as const;

type GearConditionType = (typeof GearCondition)[keyof typeof GearCondition];

const GearStatus = {
  AVAILABLE: "AVAILABLE",
  NOT_AVAILABLE: "NOT_AVAILABLE",
} as const;

type GearStatusType = (typeof GearStatus)[keyof typeof GearStatus];

// Full gear item shape returned by the backend. Prisma Decimal values may
// arrive as strings depending on the API serializer.
interface GearItem {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  category: Pick<Category, "id" | "name">;
  categoryId?: string;
  pricePerDay: number | string;
  securityDeposit?: number | string | null;
  quantity: number;
  condition?: GearConditionType;
  status?: GearStatusType;
  images?: string[];
  specifications?: Record<string, string>;
  providerId: string;
}

interface ProviderDashboardProps {
  categories: Category[];
  gearItems: GearItem[];
  currentUserId: string;
  rentalOrders: RentalOrder[];
}



interface Specification {
  key: string;
  value: string;
}

export default function ProviderDashboard(props: ProviderDashboardProps) {
  const { categories, gearItems, currentUserId, rentalOrders } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("orderId");
  const [activeTab, setActiveTab] = useState<"gear" | "orders">("gear");

  useEffect(() => {
    if (orderIdFromUrl && rentalOrders) {
      const order = rentalOrders.find((o) => o.id === orderIdFromUrl);
      if (order) {
        setSelectedInvoice(order);
        setActiveTab("orders");
      }
    }
  }, [orderIdFromUrl, rentalOrders]);

  const handleCloseInvoice = () => {
    setSelectedInvoice(null);
    router.push("/dashboard/provider", { scroll: false });
  };

  const initialActionState: AddGearState = {
    success: false,
    message: "",
  };

  const [actionState, formAction, isPending] = (useActionState as any)(
    addGearItem,
    initialActionState,
  );

  // Show a toast when a gear item is added successfully.
  useEffect(() => {
    if (actionState.success && actionState.message) {
      toast.success("Listing Published", {
        description: actionState.message,
      });
    } else if (!actionState.success && actionState.message) {
      toast.error("Add Gear Failed", {
        description: actionState.message,
      });
    }
  }, [actionState]);

  // Add Gear Form State
  const [gearName, setGearName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [condition, setCondition] = useState<GearConditionType>(
    GearCondition.GOOD,
  );
  const [pricePerDay, setPricePerDay] = useState<number | "">(2500);
  const [securityDeposit, setSecurityDeposit] = useState<number | "">(10000);
  const [quantity, setQuantity] = useState<number | "">(2);
  const [status, setStatus] = useState<GearStatusType>(GearStatus.AVAILABLE);

  // Image files
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Append selected files to FormData before dispatching Server Action.
  const handleGearFormAction = (formData: FormData) => {
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    return formAction(formData);
  };

  // Image previews
  const previews = useMemo(
    () => imageFiles.map((file) => URL.createObjectURL(file)),
    [imageFiles],
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Technical Specifications
  const [specifications, setSpecifications] = useState<Specification[]>([
    { key: "sensor", value: "Full Frame CMOS" },
    { key: "resolution", value: "24.5 MP" },
    { key: "videoResolution", value: "4K UHD 60p" },
    { key: "mountType", value: "Nikon Z" },
    { key: "weight", value: "705g" },
    { key: "batteryType", value: "EN-EL15c" },
    { key: "storage", value: "Dual Slots (CFexpress/XQD + SD)" },
  ]);

  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  // Restock and Invoice States
  const [restockItem, setRestockItem] = useState<GearItem | null>(null);
  const [restockQuantity, setRestockQuantity] = useState<number>(1);
  const [isRestocking, setIsRestocking] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState<RentalOrder | null>(
    null,
  );

  // Edit Gear Modal State
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    brand: "",
    categoryId: "",
    condition: GearCondition.GOOD as GearConditionType,
    pricePerDay: "",
    securityDeposit: "",
    quantity: "",
    status: GearStatus.AVAILABLE as GearStatusType,
  });
  const [editExistingImages, setEditExistingImages] = useState<string[]>([]);
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editSpecifications, setEditSpecifications] = useState<Specification[]>(
    [],
  );
  const [editSpecKey, setEditSpecKey] = useState("");
  const [editSpecValue, setEditSpecValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  // Filter gear items belonging to the current provider
  const myGearItems = useMemo(() => {
    return gearItems.filter((item) => item.providerId === currentUserId);
  }, [gearItems, currentUserId]);

  // Initialize inventory
  const [inventory, setInventory] = useState<GearItem[]>([]);

  useEffect(() => {
    setInventory(myGearItems);
  }, [myGearItems]);

  // Mock Rental Orders
// Mock Rental Orders

  // Specification Handlers
  const handleAddSpec = () => {
    if (!specKey.trim() || !specValue.trim()) return;

    setSpecifications([
      ...specifications,
      {
        key: specKey.trim(),
        value: specValue.trim(),
      },
    ]);

    setSpecKey("");
    setSpecValue("");
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // Image Handlers
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);

    setImageFiles((prev) => [...prev, ...selected]);

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  // Open the edit modal and populate it with the selected gear item.
  const handleOpenEdit = (item: GearItem) => {
    setEditingItem(item);
    setEditForm({
      name: item.name ?? "",
      description: item.description ?? "",
      brand: item.brand ?? "",
      categoryId: item.category?.id ?? item.categoryId ?? "",
      condition: item.condition ?? GearCondition.GOOD,
      pricePerDay: String(item.pricePerDay ?? ""),
      securityDeposit:
        item.securityDeposit == null ? "" : String(item.securityDeposit),
      quantity: String(item.quantity ?? 0),
      status: item.status ?? GearStatus.AVAILABLE,
    });
    setEditExistingImages(Array.isArray(item.images) ? [...item.images] : []);
    setEditImageFiles([]);
    setEditSpecifications(
      Object.entries(item.specifications ?? {}).map(([key, value]) => ({
        key,
        value,
      })),
    );
    setEditSpecKey("");
    setEditSpecValue("");
    setEditMessage("");
    setEditSuccess(false);
  };

  const handleEditFieldChange = (
    field: keyof typeof editForm,
    value: string,
  ) => {
    setEditForm((prev) => ({ ...prev, [field]: value }) as typeof editForm);
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setEditImageFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const handleAddEditSpec = () => {
    const key = editSpecKey.trim();
    const value = editSpecValue.trim();
    if (!key || !value) return;
    if (
      editSpecifications.some(
        (spec) => spec.key.toLowerCase() === key.toLowerCase(),
      )
    ) {
      setEditMessage("A specification with this key already exists.");
      setEditSuccess(false);
      return;
    }
    setEditSpecifications((prev) => [...prev, { key, value }]);
    setEditSpecKey("");
    setEditSpecValue("");
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const price = Number(editForm.pricePerDay);
    const deposit =
      editForm.securityDeposit.trim() === ""
        ? null
        : Number(editForm.securityDeposit);
    const stock = Number(editForm.quantity);

    if (
      !editForm.name.trim() ||
      !editForm.description.trim() ||
      !editForm.brand.trim() ||
      !editForm.categoryId
    ) {
      setEditMessage("Please complete all required fields.");
      setEditSuccess(false);
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setEditMessage("Price per day must be greater than 0.");
      setEditSuccess(false);
      return;
    }
    if (deposit !== null && (!Number.isFinite(deposit) || deposit < 0)) {
      setEditMessage("Security deposit must be 0 or greater.");
      setEditSuccess(false);
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setEditMessage("Quantity must be a non-negative whole number.");
      setEditSuccess(false);
      return;
    }

    const specificationsObject = Object.fromEntries(
      editSpecifications.map(({ key, value }) => [key, value]),
    ) as Record<string, string>;

    const formData = new FormData();
    formData.set("gearId", editingItem.id);
    formData.set("name", editForm.name.trim());
    formData.set("description", editForm.description.trim());
    formData.set("brand", editForm.brand.trim());
    formData.set("categoryId", editForm.categoryId);
    formData.set("condition", editForm.condition);
    formData.set("pricePerDay", String(price));
    formData.set("securityDeposit", deposit === null ? "" : String(deposit));
    formData.set("quantity", String(stock));
    formData.set("status", editForm.status);
    formData.set("existingImages", JSON.stringify(editExistingImages));
    formData.set("specifications", JSON.stringify(specificationsObject));
    editImageFiles.forEach((file) => formData.append("images", file));

    setIsUpdating(true);
    setEditMessage("");
    try {
      const result = await updateGearItem(
        { success: false, message: "" },
        formData,
      );
      setEditMessage(result.message);
      setEditSuccess(result.success);
      if (result.success) {
        toast.success("Gear Updated", {
          description: result.message || "Gear item updated successfully!",
        });
        setInventory((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  ...editForm,
                  pricePerDay: price,
                  securityDeposit: deposit,
                  quantity: stock,
                  category:
                    categories.find(
                      (category) => category.id === editForm.categoryId,
                    ) ?? item.category,
                  images: [...editExistingImages],
                  specifications: specificationsObject,
                }
              : item,
          ),
        );
        setEditingItem(null);
        router.refresh();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update gear item.";
      setEditMessage(errorMessage);
      setEditSuccess(false);
      toast.error("Update Failed", {
        description: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteGear = async (gearId: string) => {
    if (!confirm("Are you sure you want to delete this gear item?")) return;

    try {
      const result = await deleteGearItem(gearId);
      if (result.success) {
        toast.success("Gear Deleted", {
          description: result.message || "Gear item deleted successfully!",
        });
        
        // Immediately filter out the deleted item from local inventory state
        setInventory((prev) => prev.filter((item) => item.id !== gearId));
        
        // Refresh server components and re-fetch page data
        router.refresh();
      } else {
        toast.error("Delete Failed", {
          description: result.message || "Failed to delete gear item.",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting the gear item.");
    }
  };

  // Rental Order Status Handler
  const handleStatusUpdate = (
    orderId: string,
    newStatus: string,
  ) => {
    // Assuming local state update for now as per previous implementation
    console.log(`Updating status for ${orderId} to ${newStatus}`);
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!restockItem) return;

  setIsRestocking(true);
  try {
    const result = await restockGearItem(restockItem.id, restockQuantity);
    
    if (result.success) {
      toast.success("Restock Successful", {
        description: result.message || "Stock updated successfully!",
      });
      // Update local state to reflect new quantity immediately
      setInventory((prev) =>
        prev.map((item) =>
          item.id === restockItem.id
            ? { ...item, quantity: item.quantity + Number(restockQuantity) }
            : item
        )
      );
      setRestockItem(null);
      setRestockQuantity(1);
      router.refresh();
    } else {
      toast.error("Restock Failed", {
        description: result.message || "Failed to update stock.",
      });
    }
  } catch (error) {
    toast.error("Failed to update stock.");
  } finally {
    setIsRestocking(false);
  }
};



  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-6 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            [ Management Console ]
          </span>

          <h1 className="text-3xl font-light tracking-tight text-zinc-900 mt-1">
            Provider Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("gear")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-none border transition-colors ${
              activeTab === "gear"
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            Gear Inventory
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-none border transition-colors ${
              activeTab === "orders"
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            Rental Invoices & Orders
          </button>

          {/* Hidden link for direct URL navigation */}
          <a href={`/dashboard/provider?id=${currentUserId}`} className="sr-only">
            Provider ID
          </a>
        </div>
      </div>

      {/* TAB 1: GEAR MANAGEMENT */}
      {activeTab === "gear" && (
        <div className="w-full max-w-[1340px] mx-auto space-y-6">
          {/* Add New Gear Form */}
          <div className="min-w-0 border border-zinc-200 bg-white p-5 sm:p-6 lg:p-8 rounded-none shadow-sm">
            <div className="mb-6 border-b border-zinc-100 pb-4">
              <h2 className="text-sm font-mono uppercase tracking-tight text-zinc-900 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Equipment Listing
              </h2>

              <p className="text-xs text-zinc-500 mt-1">
                Register professional equipment with technical specs, deposits,
                and gallery media.
              </p>
            </div>

            <form action={handleGearFormAction} className="space-y-6">
              {/* Core Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-5">
                <div className="md:col-span-2 space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-xs font-mono uppercase text-zinc-700"
                  >
                    Gear Name
                  </Label>

                  <Input
                    id="name"
                    name="name"
                    value={gearName}
                    onChange={(e) => setGearName(e.target.value)}
                    placeholder="e.g., Nikon Z6 II Mirrorless Camera"
                    className="rounded-none border-zinc-200 bg-background text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="brand"
                    className="text-xs font-mono uppercase text-zinc-700"
                  >
                    Brand
                  </Label>

                  <Input
                    id="brand"
                    name="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g., Nikon"
                    className="rounded-none border-zinc-200 bg-background text-xs"
                    required
                  />
                </div>
              </div>

              {/* Category, Condition, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="categoryId"
                    className="text-xs font-mono uppercase text-zinc-700"
                  >
                    Category
                  </Label>

                  <Select
                    name="categoryId"
                    value={categoryId}
                    onValueChange={setCategoryId}
                  >
                    <SelectTrigger
                      id="categoryId"
                      className="rounded-none border-zinc-200 text-xs"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent className="rounded-none border-zinc-200 text-xs">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                          className="rounded-none text-xs"
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="condition"
                    className="text-xs font-mono uppercase text-zinc-700"
                  >
                    Gear Condition
                  </Label>

                  <Select
                    name="condition"
                    value={condition}
                    onValueChange={(value) =>
                      setCondition(value as GearConditionType)
                    }
                  >
                    <SelectTrigger
                      id="condition"
                      className="rounded-none border-zinc-200 text-xs"
                    >
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>

                    <SelectContent className="rounded-none border-zinc-200 text-xs">
                      {Object.values(GearCondition).map((value) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="rounded-none text-xs"
                        >
                          {value.replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="status"
                    className="text-xs font-mono uppercase text-zinc-700"
                  >
                    Listing Status
                  </Label>

                  <Select
                    name="status"
                    value={status}
                    onValueChange={(value) =>
                      setStatus(value as GearStatusType)
                    }
                  >
                    <SelectTrigger
                      id="status"
                      className="rounded-none border-zinc-200 text-xs"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>

                    <SelectContent className="rounded-none border-zinc-200 text-xs">
                      {Object.values(GearStatus).map((value) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="rounded-none text-xs"
                        >
                          {value.replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="pricePerDay"
                    className="text-xs font-mono uppercase text-zinc-700"
                  >
                    Price Per Day (৳)
                  </Label>

                  <Input
                    id="pricePerDay"
                    name="pricePerDay"
                    type="number"
                    value={pricePerDay}
                    onChange={(e) =>
                      setPricePerDay(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    placeholder="2500"
                    className="rounded-none border-zinc-200 bg-background text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="securityDeposit"
                    className="text-xs font-mono uppercase text-zinc-700"
                  >
                    Security Deposit (৳)
                  </Label>

                  <Input
                    id="securityDeposit"
                    name="securityDeposit"
                    type="number"
                    value={securityDeposit}
                    onChange={(e) =>
                      setSecurityDeposit(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    placeholder="10000"
                    className="rounded-none border-zinc-200 bg-background text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="quantity"
                    className="text-xs font-mono uppercase text-zinc-700"
                  >
                    Quantity Stock
                  </Label>

                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    placeholder="2"
                    className="rounded-none border-zinc-200 bg-background text-xs font-mono"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="description"
                  className="text-xs font-mono uppercase text-zinc-700"
                >
                  Description
                </Label>

                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Full-frame 24.5 MP mirrorless camera ideal for 4K video and low-light photography..."
                  className="rounded-none border-zinc-200 bg-background text-xs resize-none"
                  required
                />
              </div>

              {/* Hidden values submitted with Server Action */}
              <input type="hidden" name="condition" value={condition} />

              <input type="hidden" name="status" value={status} />

              <input
                type="hidden"
                name="specifications"
                value={JSON.stringify(
                  specifications.reduce(
                    (acc, curr) => {
                      acc[curr.key] = curr.value;
                      return acc;
                    },
                    {} as Record<string, string>,
                  ),
                )}
              />

              {/* Image Upload */}
              <div className="space-y-3 border-t border-zinc-100 pt-4">
                <Label className="text-xs font-mono uppercase text-zinc-700 flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Gear Images
                </Label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesSelected}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-none text-xs border-zinc-200 h-9 px-4 font-mono gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Choose Images
                </Button>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                  {previews.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative border border-zinc-200 bg-zinc-50"
                    >
                      <img
                        src={src}
                        alt={imageFiles[idx].name}
                        className="h-28 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-white border border-zinc-200 p-0.5 text-zinc-500 hover:text-red-600 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>

                      <p className="truncate px-2 py-1 text-[10px] font-mono text-zinc-600">
                        {imageFiles[idx].name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Specifications */}
              <div className="space-y-3 border-t border-zinc-100 pt-4">
                <Label className="text-xs font-mono uppercase text-zinc-700 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  Technical Specifications
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <Input
                    placeholder="Key (e.g., sensor)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="rounded-none border-zinc-200 text-xs font-mono md:col-span-2"
                  />

                  <Input
                    placeholder="Value (e.g., Full Frame CMOS)"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="rounded-none border-zinc-200 text-xs font-mono md:col-span-2"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSpec}
                    className="rounded-none text-xs border-zinc-200 h-9 font-mono"
                  >
                    Add Specification
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                  {specifications.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border border-zinc-200 px-3 py-1.5 bg-zinc-50 text-xs font-mono"
                    >
                      <div className="truncate">
                        <span className="text-zinc-400 uppercase text-[10px]">
                          {spec.key}:{" "}
                        </span>

                        <span className="text-zinc-900 font-medium">
                          {spec.value}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="text-zinc-400 hover:text-red-600 transition-colors ml-2"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action State Message */}
              {actionState.message && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`text-xs font-mono ${
                    actionState.success ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {actionState.message}
                </p>
              )}

              {/* Form Action */}
              <div className="flex justify-end pt-4 border-t border-zinc-100">
                <button
                  type="submit"
                  disabled={isPending || !categoryId}
                  className="rounded-none bg-zinc-900 px-8 py-3 text-xs font-mono uppercase tracking-wider text-white hover:bg-zinc-800 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Uploading & Publishing..." : "Publish Listing"}
                </button>
              </div>
            </form>
          </div>

          {/* Inventory Table */}
          <div className="w-full min-w-0 border border-zinc-200 bg-white p-5 sm:p-6 lg:p-6 2xl:p-8 rounded-none shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-sm font-mono uppercase tracking-tight text-zinc-900">
                  Active Inventory
                </h2>

                <p className="text-xs text-zinc-500 mt-1">
                  Manage stock allocations and equipment state.
                </p>
              </div>

              <span className="text-xs font-mono text-zinc-400">
                {inventory.length} ITEMS LISTED
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <Table className="min-w-[620px]">
                <TableHeader>
                  <TableRow className="border-zinc-200 hover:bg-transparent">
                    <TableHead className="text-xs font-mono uppercase text-zinc-500">
                      Name
                    </TableHead>

                    <TableHead className="text-xs font-mono uppercase text-zinc-500">
                      Category
                    </TableHead>

                    <TableHead className="text-xs font-mono uppercase text-zinc-500">
                      Rate/Day
                    </TableHead>

                    <TableHead className="text-xs font-mono uppercase text-zinc-500">
                      Stock
                    </TableHead>

                    <TableHead className="text-xs font-mono uppercase text-zinc-500 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id} className="border-zinc-100 text-xs">
                      <TableCell className="font-medium text-zinc-900">
                        {item.name}
                      </TableCell>

                      <TableCell className="text-zinc-600">
                        {item.category?.name}
                      </TableCell>

                      <TableCell className="font-mono text-zinc-900">
                        ৳{item.pricePerDay}
                      </TableCell>

                      <TableCell className="font-mono text-zinc-600">
                        {item.quantity}
                      </TableCell>

                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRestockItem(item)}
                          className="h-7 text-xs rounded-none border-zinc-200 text-zinc-800 hover:bg-zinc-100 gap-1.5 font-mono"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Restock
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(item)}
                          className="h-7 text-xs rounded-none hover:bg-zinc-100 font-mono"
                        >
                          Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGear(item.id)}
                          className="h-7 text-xs rounded-none text-red-600 hover:text-red-700 hover:bg-red-50 font-mono"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {inventory.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-xs text-zinc-500 py-8"
                      >
                        No equipment listed yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVOICES & RENTAL ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="border border-zinc-200 bg-white p-8 rounded-none shadow-xs">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-sm font-mono uppercase tracking-tight text-zinc-900">
                  Rental Invoices & Manifests
                </h2>

                <p className="text-xs text-zinc-500 mt-1">
                  Select any transaction to inspect the official paper invoice
                  receipt.
                </p>
              </div>

              <span className="text-xs font-mono text-zinc-400">
                {rentalOrders.length} TOTAL INVOICES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rentalOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => {
                    setSelectedInvoice(ord);
                    window.history.pushState({}, "", `/dashboard/provider?orderId=${ord.id}`);
                  }}
                  className="group border border-zinc-200 bg-[#FDFBF7] p-6 rounded-none hover:border-zinc-900 cursor-pointer transition-all relative flex flex-col justify-between space-y-4 shadow-2xs"
                >
                  <div className="flex items-start justify-between border-b border-zinc-200/80 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                        [ RENTAL INVOICE ]
                      </span>

                      <h3 className="text-sm font-mono font-semibold text-zinc-900 mt-0.5">
                        INV-{ord.id.slice(0, 8).toUpperCase()}
                      </h3>
                    </div>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono border ${
                        ord.status === "PLACED"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : ord.status === "PICKED_UP"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-zinc-100 text-zinc-800 border-zinc-200"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-700 font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Client:</span>

                      <span className="font-medium text-zinc-900">
                        {ord.customer.name}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-400">Asset:</span>

                      <span className="text-zinc-900 truncate max-w-[150px]">
                        {ord.items?.[0]?.gearItem?.name} 
                        {ord.items?.length > 1 && ` (+${ord.items.length - 1} more)`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-400">Duration:</span>
                      <span>
                        {new Date(ord.startDate).toLocaleDateString()} - {new Date(ord.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">
                      Total: ৳{Number(ord.totalAmount).toLocaleString()}
                    </span>

                    <span className="text-zinc-900 group-hover:underline flex items-center gap-1 font-medium">
                      Inspect Paper Receipt
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAPER INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl border border-zinc-300 bg-[#FDFBF7] p-8 rounded-none shadow-2xl space-y-6 relative font-serif">
            <button
              onClick={() => {
                setSelectedInvoice(null);
                window.history.pushState({}, "", "/dashboard/provider");
              }}
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center border-b border-zinc-300 pb-6 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                GearUp Rental Corp — Official Statement
              </span>

              <h2 className="text-2xl font-normal tracking-tight text-zinc-900">
                Equipment Rental Invoice
              </h2>

              <p className="text-xs font-mono text-zinc-500">
                INV-{selectedInvoice.id.slice(0, 8).toUpperCase()} • Issued:{" "}
                {new Date(selectedInvoice.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b border-zinc-200 pb-6">
              <div>
                <span className="text-zinc-400 block uppercase text-[10px]">
                  Billed To:
                </span>

                <span className="font-semibold text-zinc-900 text-sm block mt-0.5">
                  {selectedInvoice.customer.name}
                </span>

                <span className="text-zinc-600">
                  {selectedInvoice.customer.email}
                </span>
              </div>

              <div className="text-right">
                <span className="text-zinc-400 block uppercase text-[10px]">
                  Rental Period:
                </span>

                <span className="font-medium text-zinc-900 block mt-0.5">
                   {new Date(selectedInvoice.startDate).toLocaleDateString()} - {new Date(selectedInvoice.endDate).toLocaleDateString()}
                </span>

                <span className="text-zinc-600">
                  {Math.ceil((new Date(selectedInvoice.endDate).getTime() - new Date(selectedInvoice.startDate).getTime()) / (1000 * 3600 * 24)) + 1} Billing Days
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                Itemized Manifest
              </span>

              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-zinc-300 text-left text-zinc-500">
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium text-center">Qty</th>
                    <th className="pb-2 font-medium text-right">Rate/Day</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-200">
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 text-zinc-900 font-sans font-medium">
                        {item.gearItem.name}
                      </td>

                      <td className="py-3 text-center text-zinc-600">
                        {item.quantity}
                      </td>

                      <td className="py-3 text-right text-zinc-600">
                        ৳{Number(item.pricePerDay).toLocaleString()}
                      </td>

                      <td className="py-3 text-right font-semibold text-zinc-900">
                        ৳{(Number(item.pricePerDay) * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-zinc-300 pt-4 flex justify-between items-center font-mono text-xs">
              <div className="space-y-0.5">
                <span className="text-zinc-500 block text-[10px]">
                  Fulfillment Status:
                </span>

                <span className="font-semibold text-zinc-900 uppercase">
                  {selectedInvoice.status}
                </span>
              </div>

              <div className="text-right space-y-1">
                <div className="text-zinc-500">
                  Subtotal: ৳
                  {Number(selectedInvoice.totalAmount).toLocaleString()}
                </div>

                <div className="text-sm font-semibold text-zinc-900">
                  Total Due: ৳
                  {Number(selectedInvoice.totalAmount).toLocaleString()}{" "}
                  BDT
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-300">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-500">
                  Update Status:
                </span>

                <Select
                  value={selectedInvoice.status}
                  onValueChange={(val) =>
                    handleStatusUpdate(
                      selectedInvoice.id,
                      val as any,
                    )
                  }
                >
                  <SelectTrigger className="h-7 w-[130px] text-xs rounded-none border-zinc-300 bg-white font-mono">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>

                  <SelectContent className="rounded-none border-zinc-300 text-xs font-mono">
                    <SelectItem value="PLACED" className="rounded-none text-xs">
                      PLACED
                    </SelectItem>

                    <SelectItem
                      value="CONFIRMED"
                      className="rounded-none text-xs"
                    >
                      CONFIRMED
                    </SelectItem>

                    <SelectItem
                      value="PICKED_UP"
                      className="rounded-none text-xs"
                    >
                      PICKED UP
                    </SelectItem>

                    <SelectItem
                      value="RETURNED"
                      className="rounded-none text-xs"
                    >
                      RETURNED
                    </SelectItem>

                    <SelectItem
                      value="CANCELLED"
                      className="rounded-none text-xs text-red-600"
                    >
                      CANCELLED
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => {
                  setSelectedInvoice(null);
                  window.history.pushState({}, "", "/dashboard/provider");
                }}
                className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs h-8 px-5 font-mono"
              >
                Close Receipt
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT GEAR MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-zinc-200 bg-white p-5 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  [ Inventory Management ]
                </span>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Edit Gear Item
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Update listing details, images, stock, and specifications.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-zinc-400 hover:text-zinc-900"
                aria-label="Close edit modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-name">Gear Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) =>
                      handleEditFieldChange("name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-brand">Brand</Label>
                  <Input
                    id="edit-brand"
                    value={editForm.brand}
                    onChange={(e) =>
                      handleEditFieldChange("brand", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono uppercase text-zinc-700">
                    Category
                  </Label>
                  <Select
                    value={editForm.categoryId}
                    onValueChange={(value) =>
                      handleEditFieldChange("categoryId", value)
                    }
                  >
                    <SelectTrigger className="rounded-none border-zinc-200 text-xs font-mono">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="z-[70] rounded-none border-zinc-200 text-xs font-mono"
                    >
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="rounded-none text-xs font-mono cursor-pointer"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono uppercase text-zinc-700">
                    Condition
                  </Label>
                  <Select
                    value={editForm.condition}
                    onValueChange={(value) =>
                      handleEditFieldChange("condition", value)
                    }
                  >
                    <SelectTrigger className="rounded-none border-zinc-200 text-xs font-mono">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="z-[70] rounded-none border-zinc-200 text-xs font-mono"
                    >
                      {Object.values(GearCondition).map((value) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="rounded-none text-xs font-mono cursor-pointer"
                        >
                          {value.replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-price">Price Per Day (৳)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0.01"
                    step="any"
                    value={editForm.pricePerDay}
                    onChange={(e) =>
                      handleEditFieldChange("pricePerDay", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-deposit">Security Deposit (৳)</Label>
                  <Input
                    id="edit-deposit"
                    type="number"
                    min="0"
                    step="any"
                    value={editForm.securityDeposit}
                    onChange={(e) =>
                      handleEditFieldChange("securityDeposit", e.target.value)
                    }
                    placeholder="Leave empty for no deposit"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={editForm.quantity}
                    onChange={(e) =>
                      handleEditFieldChange("quantity", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono uppercase text-zinc-700">
                    Status
                  </Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value) =>
                      handleEditFieldChange("status", value)
                    }
                  >
                    <SelectTrigger className="rounded-none border-zinc-200 text-xs font-mono">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="z-[70] rounded-none border-zinc-200 text-xs font-mono"
                    >
                      {Object.values(GearStatus).map((value) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="rounded-none text-xs font-mono cursor-pointer"
                        >
                          {value.replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  rows={4}
                  value={editForm.description}
                  onChange={(e) =>
                    handleEditFieldChange("description", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-3 border-t border-zinc-100 pt-4">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Existing Images
                </Label>
                {editExistingImages.length === 0 ? (
                  <p className="text-xs text-zinc-500">
                    No existing images. Add new images below if needed.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {editExistingImages.map((src, index) => (
                      <div
                        key={`${src}-${index}`}
                        className="relative border border-zinc-200"
                      >
                        <img
                          src={src}
                          alt={`Gear image ${index + 1}`}
                          className="h-28 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditExistingImages((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          className="absolute top-1 right-1 bg-white border p-1 text-red-600"
                          aria-label="Remove existing image"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <Label htmlFor="edit-images">Add New Images</Label>
                <Input
                  id="edit-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditImageSelect}
                />
                {editImageFiles.length > 0 && (
                  <ul className="space-y-1">
                    {editImageFiles.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between text-xs border px-2 py-1"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditImageFiles((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          className="text-red-600 ml-3"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-3 border-t border-zinc-100 pt-4">
                <Label className="flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Technical Specifications
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                  <Input
                    placeholder="Specification key"
                    value={editSpecKey}
                    onChange={(e) => setEditSpecKey(e.target.value)}
                  />
                  <Input
                    placeholder="Specification value"
                    value={editSpecValue}
                    onChange={(e) => setEditSpecValue(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddEditSpec}
                  >
                    Add
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {editSpecifications.map((spec, index) => (
                    <div
                      key={`${spec.key}-${index}`}
                      className="flex items-center justify-between gap-2 border bg-zinc-50 px-3 py-2 text-xs"
                    >
                      <span className="min-w-0 truncate">
                        <strong>{spec.key}:</strong> {spec.value}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditSpecifications((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="text-red-600"
                        aria-label={`Remove ${spec.key}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {editMessage && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`text-xs ${editSuccess ? "text-emerald-700" : "text-red-600"}`}
                >
                  {editMessage}
                </p>
              )}

              <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESTOCK MODAL */}
      {restockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md border border-zinc-200 bg-white p-6 rounded-none shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  [ Inventory Increment ]
                </span>

                <h3 className="text-base font-semibold text-zinc-900">
                  Restock Equipment
                </h3>
              </div>

              <button
                onClick={() => setRestockItem(null)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-zinc-500 font-mono">Target Item:</p>

                <p className="text-xs font-semibold text-zinc-900">
                  {restockItem.name}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="addQuantity"
                  className="text-xs font-mono uppercase text-zinc-700"
                >
                  Additional Quantity to Add
                </Label>

                <Input
                  id="addQuantity"
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Number(e.target.value))}
                  className="rounded-none border-zinc-200 text-xs font-mono focus:ring-1 focus:ring-zinc-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 font-mono">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRestockItem(null)}
                  className="rounded-none text-xs h-9 border-zinc-200"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isRestocking}
                  className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs h-9 px-4"
                >
                  {isRestocking ? "Updating..." : "Confirm Restock"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

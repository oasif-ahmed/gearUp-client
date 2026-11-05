
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
import { addGearItem, AddGearState } from "@/services/gear-item.service";

// Backend enums
const GearCondition = {
  NEW: "NEW",
  LIKE_NEW: "LIKE_NEW",
  GOOD: "GOOD",
  FAIR: "FAIR",
} as const;

type GearConditionType =
  (typeof GearCondition)[keyof typeof GearCondition];

const GearStatus = {
  AVAILABLE: "AVAILABLE",
  NOT_AVAILABLE: "NOT_AVAILABLE",
} as const;

type GearStatusType =
  (typeof GearStatus)[keyof typeof GearStatus];

// Category is returned as a relation object from the backend.
interface GearItem {
  id: string;
  name: string;
  category: Pick<Category, "id" | "name">;
  pricePerDay: number;
  quantity: number;
  providerId: string;
}

interface ProviderDashboardProps {
  categories: Category[];
  gearItems: GearItem[];
  currentUserId: string;
}

interface RentalOrder {
  id: string;
  invoiceNo: string;
  clientName: string;
  clientEmail: string;
  gearName: string;
  quantity: number;
  rentalWindow: string;
  dailyRate: number;
  totalDays: number;
  status:
    | "PLACED"
    | "CONFIRMED"
    | "PICKED_UP"
    | "RETURNED"
    | "CANCELLED";
  createdAt: string;
}

interface Specification {
  key: string;
  value: string;
}

export default function ProviderDashboard({
  categories,
  gearItems,
  currentUserId,
}: ProviderDashboardProps) {
  const [activeTab, setActiveTab] = useState<"gear" | "orders">("gear");

  const initialActionState: AddGearState = {
    success: false,
    message: "",
  };

  const [actionState, formAction, isPending] = useActionState(
    addGearItem,
    initialActionState,
  );

  // Add Gear Form State
  const [gearName, setGearName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [condition, setCondition] =
    useState<GearConditionType>(GearCondition.GOOD);
  const [pricePerDay, setPricePerDay] = useState<number | "">(2500);
  const [securityDeposit, setSecurityDeposit] =
    useState<number | "">(10000);
  const [quantity, setQuantity] = useState<number | "">(2);
  const [status, setStatus] =
    useState<GearStatusType>(GearStatus.AVAILABLE);

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

  const [selectedInvoice, setSelectedInvoice] =
    useState<RentalOrder | null>(null);

  // Filter gear items belonging to the current provider
  const myGearItems = useMemo(() => {
    return gearItems.filter(
      (item) => item.providerId === currentUserId,
    );
  }, [gearItems, currentUserId]);

  // Initialize inventory
  const [inventory, setInventory] = useState<GearItem[]>([]);

  useEffect(() => {
    setInventory(myGearItems);
  }, [myGearItems]);

  // Mock Rental Orders
  const [orders, setOrders] = useState<RentalOrder[]>([
    {
      id: "ord-7042",
      invoiceNo: "INV-2026-094",
      clientName: "Marcus Sterling",
      clientEmail: "marcus.s@cinematics.io",
      gearName: "Nikon Z6 II Mirrorless Camera",
      quantity: 1,
      rentalWindow: "2026-11-10 to 2026-11-14",
      dailyRate: 2500,
      totalDays: 4,
      status: "PLACED",
      createdAt: "2026-11-05",
    },
  ]);

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
    setSpecifications(
      specifications.filter((_, i) => i !== index),
    );
  };

  // Image Handlers
  const handleFilesSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = Array.from(e.target.files ?? []);

    setImageFiles((prev) => [...prev, ...selected]);

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(
      imageFiles.filter((_, i) => i !== index),
    );
  };

  // Restock Submit Handler
  const handleRestockSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!restockItem) return;

    setIsRestocking(true);

    try {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === restockItem.id
            ? {
                ...item,
                quantity:
                  item.quantity + Number(restockQuantity),
              }
            : item,
        ),
      );

      setRestockItem(null);
      setRestockQuantity(1);
    } finally {
      setIsRestocking(false);
    }
  };

  // Rental Order Status Handler
  const handleStatusUpdate = (
    orderId: string,
    newStatus: RentalOrder["status"],
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status: newStatus }
          : ord,
      ),
    );
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
        </div>
      </div>

      {/* TAB 1: GEAR MANAGEMENT */}
      {activeTab === "gear" && (
        <div className="space-y-12">
          {/* Add New Gear Form */}
          <div className="border border-zinc-200 bg-white p-8 rounded-none shadow-xs">
            <div className="mb-6 border-b border-zinc-100 pb-4">
              <h2 className="text-sm font-mono uppercase tracking-tight text-zinc-900 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Equipment Listing
              </h2>

              <p className="text-xs text-zinc-500 mt-1">
                Register professional equipment with technical specs,
                deposits, and gallery media.
              </p>
            </div>

            <form
              action={handleGearFormAction}
              className="space-y-6"
            >
              {/* Core Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        e.target.value === ""
                          ? ""
                          : Number(e.target.value),
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
                        e.target.value === ""
                          ? ""
                          : Number(e.target.value),
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
                        e.target.value === ""
                          ? ""
                          : Number(e.target.value),
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
              <input
                type="hidden"
                name="condition"
                value={condition}
              />

              <input
                type="hidden"
                name="status"
                value={status}
              />

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
                    actionState.success
                      ? "text-emerald-700"
                      : "text-red-600"
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
                  {isPending
                    ? "Uploading & Publishing..."
                    : "Publish Listing"}
                </button>
              </div>
            </form>
          </div>

          {/* Inventory Table */}
          <div className="border border-zinc-200 bg-white p-8 rounded-none shadow-xs">
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

            <div className="overflow-x-auto">
              <Table>
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
                    <TableRow
                      key={item.id}
                      className="border-zinc-100 text-xs"
                    >
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
                          className="h-7 text-xs rounded-none hover:bg-zinc-100 font-mono"
                        >
                          Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
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
                {orders.length} TOTAL INVOICES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedInvoice(ord)}
                  className="group border border-zinc-200 bg-[#FDFBF7] p-6 rounded-none hover:border-zinc-900 cursor-pointer transition-all relative flex flex-col justify-between space-y-4 shadow-2xs"
                >
                  <div className="flex items-start justify-between border-b border-zinc-200/80 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                        [ RENTAL INVOICE ]
                      </span>

                      <h3 className="text-sm font-mono font-semibold text-zinc-900 mt-0.5">
                        {ord.invoiceNo}
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
                        {ord.clientName}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-400">Asset:</span>

                      <span className="text-zinc-900">
                        {ord.gearName} (Qty: {ord.quantity})
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-400">Duration:</span>
                      <span>{ord.rentalWindow}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">
                      Total: ৳
                      {(ord.dailyRate * ord.totalDays).toLocaleString()}
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
              onClick={() => setSelectedInvoice(null)}
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
                {selectedInvoice.invoiceNo} • Issued:{" "}
                {selectedInvoice.createdAt}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b border-zinc-200 pb-6">
              <div>
                <span className="text-zinc-400 block uppercase text-[10px]">
                  Billed To:
                </span>

                <span className="font-semibold text-zinc-900 text-sm block mt-0.5">
                  {selectedInvoice.clientName}
                </span>

                <span className="text-zinc-600">
                  {selectedInvoice.clientEmail}
                </span>
              </div>

              <div className="text-right">
                <span className="text-zinc-400 block uppercase text-[10px]">
                  Rental Period:
                </span>

                <span className="font-medium text-zinc-900 block mt-0.5">
                  {selectedInvoice.rentalWindow}
                </span>

                <span className="text-zinc-600">
                  {selectedInvoice.totalDays} Billing Days
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
                    <th className="pb-2 font-medium text-right">
                      Rate/Day
                    </th>
                    <th className="pb-2 font-medium text-right">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="py-3 text-zinc-900 font-sans font-medium">
                      {selectedInvoice.gearName}
                    </td>

                    <td className="py-3 text-center text-zinc-600">
                      {selectedInvoice.quantity}
                    </td>

                    <td className="py-3 text-right text-zinc-600">
                      ৳{selectedInvoice.dailyRate}
                    </td>

                    <td className="py-3 text-right font-semibold text-zinc-900">
                      ৳
                      {selectedInvoice.dailyRate *
                        selectedInvoice.totalDays}
                    </td>
                  </tr>
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
                  {selectedInvoice.dailyRate *
                    selectedInvoice.totalDays}
                </div>

                <div className="text-sm font-semibold text-zinc-900">
                  Total Due: ৳
                  {(
                    selectedInvoice.dailyRate *
                    selectedInvoice.totalDays
                  ).toLocaleString()}{" "}
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
                      val as RentalOrder["status"],
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
                onClick={() => setSelectedInvoice(null)}
                className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs h-8 px-5 font-mono"
              >
                Close Receipt
              </Button>
            </div>
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

            <form
              onSubmit={handleRestockSubmit}
              className="space-y-4"
            >
              <div className="space-y-1">
                <p className="text-xs text-zinc-500 font-mono">
                  Target Item:
                </p>

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
                  onChange={(e) =>
                    setRestockQuantity(Number(e.target.value))
                  }
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

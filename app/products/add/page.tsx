"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { showError, showSuccess } from "@/lib/swal";

export default function AddProductPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [proName, setProName] = useState("");
  const [proPrice, setProPrice] = useState("");
  const [proQuantity, setProQuantity] = useState("");
  const [proDescription, setProDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setProName("");
    setProPrice("");
    setProQuantity("");
    setProDescription("");
    setSaving(false);
  };

  // เคลียร์ฟอร์มทุกครั้งที่เข้าหน้าเพิ่มสินค้า (กันค้างค่าจากรอบก่อน)
  useEffect(() => {
    resetForm();
  }, [pathname]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proName,
          proPrice: Number(proPrice),
          proQuantity: Number(proQuantity),
          proDescription,
        }),
      });

      if (!res.ok) {
        await showError("เพิ่มไม่สำเร็จ", "ลองใหม่อีกครั้ง");
        return;
      }

      resetForm();
      await showSuccess("เพิ่มสำเร็จ", `บันทึกสินค้า "${proName}" แล้ว`);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed for: ", error);
      await showError("เพิ่มไม่สำเร็จ", "ลองใหม่อีกครั้ง");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-[75%] mx-auto mt-8 mb-8">
      <div className="flex justify-center mb-8">
        <p className="text-2xl font-bold">Add Product</p>
      </div>

      <form
        key="add-product-form"
        onSubmit={handleSubmit}
        autoComplete="off"
        className="max-w-xl mx-auto space-y-4"
      >
        <div>
          <label className="block mb-1 font-medium">ชื่อสินค้า</label>
          <input
            type="text"
            value={proName}
            onChange={(e) => setProName(e.target.value)}
            required
            autoComplete="off"
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">ราคา</label>
          <input
            type="number"
            step="any"
            value={proPrice}
            onChange={(e) => setProPrice(e.target.value)}
            required
            autoComplete="off"
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">จำนวน</label>
          <input
            type="number"
            value={proQuantity}
            onChange={(e) => setProQuantity(e.target.value)}
            required
            autoComplete="off"
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">รายละเอียด</label>
          <input
            type="text"
            value={proDescription}
            onChange={(e) => setProDescription(e.target.value)}
            required
            autoComplete="off"
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
          >
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          <Link
            href="/"
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
          >
            ยกเลิก
          </Link>
        </div>
      </form>
    </div>
  );
}

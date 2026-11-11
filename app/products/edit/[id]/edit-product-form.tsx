"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function EditProductForm({ id }: { id: string }) {
  const router = useRouter();

  const [proName, setProName] = useState("");
  const [proPrice, setProPrice] = useState("");
  const [proQuantity, setProQuantity] = useState("");
  const [proDescription, setProDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          alert("ไม่พบข้อมูลสินค้า");
          router.push("/");
          return;
        }

        const data = await res.json();
        setProName(data.proName ?? "");
        setProPrice(String(data.proPrice ?? ""));
        setProQuantity(String(data.proQuantity ?? ""));
        setProDescription(data.proDescription ?? "");
      } catch (error) {
        console.error("Failed for: ", error);
        alert("โหลดข้อมูลไม่สำเร็จ");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proName,
          proPrice: Number(proPrice),
          proQuantity: Number(proQuantity),
          proDescription,
        }),
      });

      if (!res.ok) {
        alert("แก้ไขสินค้าไม่สำเร็จ");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed for: ", error);
      alert("แก้ไขสินค้าไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-8">กำลังโหลดข้อมูล...</p>;
  }

  return (
    <div className="w-[75%] mx-auto mt-8 mb-8">
      <div className="flex justify-center mb-8">
        <p className="text-2xl font-bold">Edit Product</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <div>
          <label className="block mb-1 font-medium">ชื่อสินค้า</label>
          <input
            type="text"
            value={proName}
            onChange={(e) => setProName(e.target.value)}
            required
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

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { confirmDelete, showError, showSuccess } from "@/lib/swal";

type Product = {
  id: number;
  proName: string;
  proPrice: number;
  proQuantity: number;
  proDescription: string;
};

/** สถานะจากข้อความรายละเอียด — ไม่พร้อมมาก่อน พร้อมรองลงมา นอกนั้นปกติ */
function getDescriptionStatus(description: string) {
  const text = description.trim();
  const notReadyKeywords = ["ยังไม่", "ไม่พร้อม", "ปิดขาย", "หมด"];
  const readyKeywords = ["พร้อมขาย", "พร้อมจำหน่าย", "เปิดขาย"];

  if (notReadyKeywords.some((word) => text.includes(word))) {
    return "not-ready" as const;
  }
  if (readyKeywords.some((word) => text.includes(word))) {
    return "ready" as const;
  }
  return "neutral" as const;
}

const descriptionToneClass = {
  ready: "text-green-700 font-medium",
  "not-ready": "text-red-600 font-medium",
  neutral: "text-black",
} as const;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed for: ", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (product: Product) => {
    const result = await confirmDelete(product.proName);
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        await showError("ลบไม่สำเร็จ", "ลองใหม่อีกครั้ง");
        return;
      }
      await showSuccess("ลบสำเร็จ", `ลบสินค้า "${product.proName}" แล้ว`);
      await fetchProducts();
    } catch (error) {
      console.error("Failed for: ", error);
      await showError("ลบไม่สำเร็จ", "ลองใหม่อีกครั้ง");
    }
  };

  return (
    <>
      {/* แสดงชื่อหน้าเพจ */}
      <div className="flex justify-center mt-8 mb-8">
        <p className="text-2xl font-bold">Show All Product</p>
      </div>

      {/* แสดงปุ่มเปิดไปหน้าเพิ่มสินค้า */}
      <div className="flex justify-end w-[75%] mx-auto mb-8">
        <Link
          href="/products/add"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          เพิ่มสินค้า
        </Link>
      </div>

      {/* แสดงรายการสินค้าในรูปแบบตาราง โดยแต่ละรายการจะมีลิงค์ไปหน้าแก้ไขสินค้า และปุ่มลบสินค้า */}
      {/* ก่อนแสดงตารางตรวจสอบว่าได้โหลดข้อมูลมาครบแล้วหรือยัง */}
      {loading ? (
        <p className="text-center">กำลังโหลดข้อมูล...</p>
      ) : (
        <div className="flex justify-center w-[75%] mx-auto">
          <table className="w-full border border-gray-300 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">
                  ชื่อสินค้า
                </th>
                <th className="border border-gray-300 px-3 py-2">ราคา</th>
                <th className="border border-gray-300 px-3 py-2">จำนวน</th>
                <th className="border border-gray-300 px-3 py-2 text-left min-w-[140px]">
                  รายละเอียด
                </th>
                <th className="border border-gray-300 px-3 py-2">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = getDescriptionStatus(product.proDescription);

                return (
                  <tr key={product.id}>
                    <td className="border border-gray-300 px-3 py-2">
                      {product.proName}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {product.proPrice}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {product.proQuantity}
                    </td>
                    <td
                      className={`border border-gray-300 px-3 py-2 whitespace-nowrap ${descriptionToneClass[status]}`}
                    >
                      {product.proDescription}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Link
                        href={`/products/edit/${product.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        แก้ไข
                      </Link>
                      {" | "}
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Product = {
  id: number;
  proName: string;
  proPrice: number;
  proQuantity: number;
  proDescription: string;
};

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

  const handleDelete = async (id: number) => {
    const ok = confirm("ต้องการลบสินค้านี้หรือไม่?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("ลบสินค้าไม่สำเร็จ");
        return;
      }
      await fetchProducts();
    } catch (error) {
      console.error("Failed for: ", error);
      alert("ลบสินค้าไม่สำเร็จ");
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
                <th className="border border-gray-300 px-3 py-2 text-left">
                  รายละเอียด
                </th>
                <th className="border border-gray-300 px-3 py-2">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const isReady =
                  product.proDescription.includes("พร้อมขาย") &&
                  !product.proDescription.includes("ยังไม่");

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
                      className={`border border-gray-300 px-3 py-2 ${
                        isReady ? "text-black" : "text-orange-700"
                      }`}
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
                        onClick={() => handleDelete(product.id)}
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

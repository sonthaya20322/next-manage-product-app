import { Suspense } from "react";
import EditProductForm from "./edit-product-form";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="mt-8 text-center">กำลังโหลด...</p>}>
      <EditProductPageContent params={params} />
    </Suspense>
  );
}

async function EditProductPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditProductForm id={id} />;
}

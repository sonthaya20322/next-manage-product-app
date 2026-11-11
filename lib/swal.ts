import Swal from "sweetalert2";

export async function showSuccess(title: string, text?: string) {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#2563eb",
  });
}

export async function showError(title: string, text?: string) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#2563eb",
  });
}

export async function showWarning(title: string, text?: string) {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#2563eb",
  });
}

export async function confirmDelete(productName: string) {
  return Swal.fire({
    icon: "warning",
    title: "ยืนยันการลบ",
    text: `ต้องการลบสินค้า "${productName}" หรือไม่?`,
    showCancelButton: true,
    confirmButtonText: "ลบ",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#9ca3af",
    reverseButtons: true,
    focusCancel: true,
  });
}

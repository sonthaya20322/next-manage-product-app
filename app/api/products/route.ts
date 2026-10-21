import prisma from "@/lib/prisma";

// Handle การเพิ่มข้อมูลลงตาราง (POST -> Create)
export async function POST(request: Request) {
  // แยกข้อมูลที่ส่งมาจาก client ซึ่งเป็น JSON มาเป็น Object เพื่อใช้งานต่อไป
  const body = await request.json();

  // handle ข้อผิดพลาดที่อาจจะเกิดขึ้นในการทำงาน
  try {
    //เพิ่มข้อมูลลงตารางในฐานข้อมูล
    const result = await prisma.product.create({
      // เอาข้อมูลใน body กำหนดให้กับแต่ละ column ในตาราง
      data: {
        proName: body.proName,
        proPrice: body.proPrice,
        proQuantity: body.proQuantity,
        proDescription: body.proDescription,
      },
    });

    //เพิ่มข้อมูลเรียบร้อยแล้วส่งผลการทำงานกลับไปยัง client/user
    return Response.json(result, { status: 201 });
  } catch (error) {
    //เกิดข้อผิดพลาดในการเพิ่มข้อมูล
    console.error("Failed for: ", error);
    return Response.json(
      { message: "พบข้อผิดพลาดในการเพิ่มข้อมูล" },
      { status: 500 },
    );
  }
}

// Handle การดึงข้อมูลทั้งหมดจากตาราง (GET -> Read)
// Handle การดึงข้อมูลทั้งหมดจากตาราง (GET -> Read) แต่มีเงื่อนไขด้วย
export async function GET(request: Request) {
  //สร้างตัวแปรเก็บข้อมูล query string ที่ส่งมา
  const url = new URL(request.url);
  const proPrice = url.searchParams.get("proPrice");
  const proDescription = url.searchParams.get("proDescription");

  // handle ข้อผิดพลาดที่อาจจะเกิดขึ้นในการทำงาน
  try {
    //เพิ่มเงื่อนไขในการตรวจสอบเพื่อ ดึงข้อมูล
    //โดยตรวจสอบว่า proPrice กับ proDescription มีค่าหรือไม่
    if (proPrice && proDescription) {
      //ดึงข้อมูลแบบมีเงื่อนไข ที่ไม่ใช่ PK-id
      const result = await prisma.product.findMany({
        where: {
          AND: [
            { proPrice: { gte: Number(proPrice) } },
            { proDescription: proDescription },
          ],
        },
      });

      //ตรวจสอบผลลัพธ์ว่ามีข้อมูลหรือไม่
      if (result.length === 0) {
        return Response.json({ message: "ไม่พบข้อมูล" }, { status: 404 });
      }

      //ดึงข้อมูลเรียบร้อยแล้วส่งผลการทำงานกลับไปยัง client/user
      return Response.json(result, { status: 200 });
    }

    //ดึงข้อมูลทั้งหมดจากตาราง (ไม่มีเงื่อนไขในการดึง)
    // const result = await prisma.product.findMany();
    const result = await prisma.product.findMany({
      orderBy: { proName: "asc" },
    });

    //ตรวจสอบผลลัพธ์ว่ามีข้อมูลหรือไม่
    if (result.length === 0) {
      return Response.json({ message: "ไม่พบข้อมูล" }, { status: 200 });
    }

    //ดึงข้อมูลเรียบร้อยแล้วส่งผลการทำงานกลับไปยัง client/user
    return Response.json(result, { status: 200 });
  } catch (error) {
    //เกิดข้อผิดพลาดในการเพิ่มข้อมูล
    console.error("Failed for: ", error);
    return Response.json(
      { message: "พบข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 },
    );
  }
}

// Handle การแก้ไขข้อมูลในตาราง (PUT -> Update) แต่มีเงื่อนไขที่ไม่ใช่ PK-id
export async function PUT(request: Request) {
  //สร้างตัวแปรเก็บข้อมูล query string ที่ส่งมา
  const url = new URL(request.url);
  const proQuantity = Number(url.searchParams.get("proQuantity"));

  try {
    // แก้ไข เงื่อนไขคือ proQuantity มากกว่า 20 แล้วแก้ proDescription เป็น เปิดขาย
    const result = await prisma.product.updateMany({
      where: {
        proQuantity: {
          gt: proQuantity,
        },
      },
      data: {
        proDescription: "เปิดขาย",
      },
    });

    return Response.json(result, { status: 200 });
  } catch (error) {
    //เกิดข้อผิดพลาดในการเพิ่มข้อมูล
    console.error("Failed for: ", error);
    return Response.json(
      { message: "พบข้อผิดพลาดในการแก้ไขข้อมูล" },
      { status: 500 },
    );
  }
}

// Handle การลบข้อมูลในตาราง (DELETE -> Delete ) แต่มีเงื่อนไขที่ไม่ใช่ PK-id
export async function DELETE(request: Request) {
  //สร้างตัวแปรเก็บข้อมูล query string ที่ส่งมา
  const url = new URL(request.url);
  const proQuantity = Number(url.searchParams.get("proQuantity"));

  try {
    // แก้ไข เงื่อนไขคือ proQuantity มากกว่า 20 แล้วแก้ proDescription เป็น เปิดขาย
    const result = await prisma.product.deleteMany({
      where: {
        proQuantity: { gte: proQuantity },
      },
    });

    return Response.json(result, { status: 200 });
  } catch (error) {
    //เกิดข้อผิดพลาดในการเพิ่มข้อมูล
    console.error("Failed for: ", error);
    return Response.json(
      { message: "พบข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 },
    );
  }
}

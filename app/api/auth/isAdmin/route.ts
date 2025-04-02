import { authOptions } from "@/shared/constants/auth-options";
import { getUserSession } from "@/shared/lib/get-user-session";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: any, res: any) {
  try {
    

    const currentUser = await getUserSession();
    if (currentUser?.role == UserRole.ADMIN) {
      return NextResponse.json({ isAdmin: true });
    }

    return NextResponse.json({ isAdmin: false });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: '[CHECK_ADMIN] Server error' }, { status: 500 });
  }
}
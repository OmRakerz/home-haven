import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextResponse } from "next/server";

export const DELETE = async (request, { params }) => {
  const { id } = params; // ID объекта, который удаляем из закладок

  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    const userId = sessionUser?.user?.id;

    if (!userId) {
      return new NextResponse("Пользователь не авторизован", { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse("Пользователь не найден", { status: 404 });
    }

    // Удаление из массива bookmarks
    user.bookmarks = user.bookmarks.filter(
      (bookmark) => bookmark.toString() !== id
    );

    await user.save();

    return new NextResponse("Объект удален из закладок", { status: 200 });
  } catch (error) {
    console.error("Ошибка при удалении из закладок:", error);
    return new NextResponse("Что-то пошло не так", { status: 500 });
  }
};

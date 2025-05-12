import connectDB from "@/config/database";
import User from "@/models/User";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// GET /api/bookmarks
export const GET = async () => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;

    // Найдем пользователя в БД
    const user = await User.findOne({ _id: userId });

    // Получить закладки пользователей
    const bookmarks = await Property.find({ _id: { $in: user.bookmarks } });

    return new Response(JSON.stringify(bookmarks), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Что-то пошло не так", { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connectDB();

    const { propertyId } = await request.json();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;

    // Найдем пользователя в БД
    const user = await User.findOne({ _id: userId });

    // Проверим добавлена ли недвижимость в закладки
    let isBookmarked = user.bookmarks.includes(propertyId);

    let message;

    if (isBookmarked) {
      // Если закладка уже была сделана, то удалим ее из закладок
      user.bookmarks.pull(propertyId);
      message = "Закладка успешно удалена";
      isBookmarked = false;
    } else {
      // Если нет закладок, то добавьте его в закладки
      user.bookmarks.push(propertyId);
      message = "Закладка успешно добавлена";
      isBookmarked = true;

      // Проверяем, достигло ли свойство 3+ закладок от разных пользователей
      const bookmarkCount = await User.countDocuments({
        bookmarks: propertyId,
      });

      if (bookmarkCount >= 3) {
        await Property.updateOne(
          { _id: propertyId },
          { $set: { is_featured: true } }
        );
      }
    }

    await user.save();

    return new Response(JSON.stringify({ message, isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Что-то пошло не так", { status: 500 });
  }
};

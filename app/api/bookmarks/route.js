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

    // Получить закладки пользователя
    const bookmarks = await Property.find({ _id: { $in: user.bookmarks } });

    return new Response(JSON.stringify(bookmarks), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Что-то пошло не так", { status: 500 });
  }
};

// POST /api/bookmarks
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

    // Получаем объект недвижимости
    const property = await Property.findById(propertyId);

    // Проверим, есть ли уже эта недвижимость в закладках
    let isBookmarked = user.bookmarks.includes(propertyId);

    let message;

    if (isBookmarked) {
      // Удаляем закладку
      user.bookmarks.pull(propertyId);
      message = "Закладка удалена";
      isBookmarked = false;
    } else {
      // Добавляем закладку
      user.bookmarks.push(propertyId);
      message = "Закладка добавлена";
      isBookmarked = true;
    }

    await user.save();

    // После сохранения обновляем статус is_featured
    if (isBookmarked === false) {
      // Только что удалили закладку — проверяем общее число
      const bookmarkCount = await User.countDocuments({
        bookmarks: propertyId,
      });

      if (bookmarkCount < 3) {
        await Property.updateOne(
          { _id: propertyId },
          { $set: { is_featured: false } }
        );
      }
    } else if (isBookmarked) {
      // Проверяем, достигло ли свойство 3+ закладок от разных пользователей (установлен ли is_featured у недвижимости)
      const bookmarkCount = await User.countDocuments({
        bookmarks: propertyId,
      });

      if (bookmarkCount >= 3) {
        // Если количество закладок ≥ 3, делаем is_featured = true
        if (!property.is_featured) {
          await Property.updateOne(
            { _id: propertyId },
            { $set: { is_featured: true } }
          );
        }
      } else {
        // Если меньше 3 — убираем фичер, если он был
        if (property.is_featured) {
          await Property.updateOne(
            { _id: propertyId },
            { $set: { is_featured: false } }
          );
        }
      }
    }

    return new Response(JSON.stringify({ message, isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.error("Ошибка при работе с закладками:", error);
    return new Response("Что-то пошло не так", { status: 500 });
  }
};

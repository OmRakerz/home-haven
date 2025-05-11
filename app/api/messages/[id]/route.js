import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// PUT /api/messages/:id
export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    const { id } = params;

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response("Требуется авторизация", {
        status: 401,
      });
    }

    const { userId } = sessionUser;

    // Найти сообщение по id
    const message = await Message.findById(id);

    // Проверяем, существует ли сообщение
    if (!message) return new Response("Сообщение не найдено", { status: 404 });

    // Проверьте право собственности (ownership)
    if (message.recipient.toString() !== userId) {
      return new Response("Неавторизованный", { status: 401 });
    }

    // Обновление сообщения на прочитано/непрочитанное в зависимости от текущего статуса
    message.read = !message.read;

    // Сохранить сообщение
    await message.save();

    return new Response(JSON.stringify(message), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Что-то полшло не так", { status: 500 });
  }
};

// DELETE /api/messages/:id
export const DELETE = async (request, { params }) => {
  try {
    await connectDB();

    const { id } = params;

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response("Требуется авторизация", {
        status: 401,
      });
    }

    const { userId } = sessionUser;

    // Найти сообщение по id
    const message = await Message.findById(id);

    // Проверяем, существует ли сообщение
    if (!message) return new Response("Сообщение не найдено", { status: 404 });

    // Проверяем право собственности (ownership)
    if (message.recipient.toString() !== userId) {
      return new Response("Неавторизованный", { status: 401 });
    }

    // Удалить сообщение
    await message.deleteOne();

    return new Response("Сообщение удалено", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Что-то полшло не так", { status: 500 });
  }
};

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// GET /api/messages
export const GET = async () => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response(JSON.stringify("Требуется авторизация"), {
        status: 401,
      });
    }

    const { userId } = sessionUser;

    const readMessages = await Message.find({ recipient: userId, read: true })
      .sort({ createdAt: -1 }) // Сортировка прочитанных сообщений по дате в порядке убывания
      .populate("sender", "username")
      .populate("property", ["name", "images"]);

    const unreadMessages = await Message.find({
      recipient: userId,
      read: false,
    })
      .sort({ createdAt: -1 }) // Сортировка непрочитанных сообщений по дате в порядке убывания
      .populate("sender", "username")
      .populate("property", ["name", "images"]);

    const messages = [...unreadMessages, ...readMessages]; // Объединяем непрочитанные и прочитанные сообщения

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Что-то пошло не так", { status: 500 });
  }
};

// POST /api/messages
export const POST = async (request) => {
  try {
    await connectDB();

    const { name, email, phone, message, property, recipient } =
      await request.json();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response(
        JSON.stringify({
          message: "Для отправки сообщения необходимо авторизоваться",
        }),
        { status: 401 }
      );
    }

    const { user } = sessionUser;

    // Невозможно отправить сообщение самому себе
    if (user.id === recipient) {
      return new Response(
        JSON.stringify({
          message: "Невозможно отправить сообщение самому себе",
        }),
        { status: 400 }
      );
    }

    // Создание нового сообщения
    const newMessage = new Message({
      sender: user.id,
      recipient,
      property,
      name,
      email,
      phone,
      body: message,
    });

    // Сохранение сообщения
    await newMessage.save();

    return new Response(JSON.stringify({ message: "Сообщение отправлено" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Что-то пошло не так", { status: 500 });
  }
};

import connectDB from "@/config/database";
import User from "@/models/User";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Guest",
      id: "guest",
      async authorize() {
        // Создаем уникальный email для каждого гостя
        const guestEmail = `guest-${Date.now()}@homehaven.com`;

        const user = {
          name: "Гость",
          email: guestEmail,
          image: null,
          isGuest: true,
        };

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    // Вызывается при успешном авторизации (входе в аккаунт)
    async signIn({ user }) {
      // 1. Подключение к БД
      await connectDB();

      // Для гостя создаем запись в БД
      if (user.isGuest) {
        await User.findOneAndUpdate(
          { email: user.email },
          {
            username: user.name,
            email: user.email,
            image: user.image,
            isGuest: true,
          },
          { upsert: true }
        );
        return true;
      }

      // Остальная логика для обычных пользователей
      // 2. Проверяем, существует ли пользователь
      const userExists = await User.findOne({ email: user.email });
      // 3. Если нет, то добавляем пользователя в БД
      if (!userExists) {
        await User.create({
          email: user.email,
          // Обрежем имя пользователя если оно слишком длинное
          username: user.name?.slice(0, 20),
          image: user.image,
        });
      }
      // 4. Возвращает true, чтобы разрешить вход в систему
      return true;
    },

    // Модифицируем объект сеанса
    async session({ session }) {
      // 1. Получить пользователя из базы данных
      const user = await User.findOne({ email: session.user.email });
      // 2. Присвоить ID пользователя к сеансу (session)
      session.user.id = user._id.toString();
      session.user.isGuest = user.isGuest || false;
      // 3. Возврат сеанса (session)
      return session;
    },
  },
};

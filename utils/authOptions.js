import connectDB from "@/config/database";
import User from "@/models/User";

import GoogleProvider from "next-auth/providers/google";

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
  ],
  callbacks: {
    // Вызывается при успешном авторизации (входе в аккаунт)
    async signIn({ profile }) {
      // 1. Подключение к БД
      await connectDB();
      // 2. Проверяем, существует ли пользователь
      const userExists = await User.findOne({ email: profile.email });
      // 3. Если нет, то добавляем пользователя в БД
      if (!userExists) {
        // Обрежем имя пользователя если оно слишком длинное
        const username = profile.name.slice(0, 20);

        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
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
      // 3. Возврат сеанса (session)
      return session;
    },
  },
};

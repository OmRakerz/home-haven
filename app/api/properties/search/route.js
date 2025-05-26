import connectDB from "@/config/database";
import Property from "@/models/Property";

// GET /api/properties/search
export const GET = async (request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const propertyType = searchParams.get("propertyType");
    const rooms = searchParams.get("rooms");
    const priceFrom = searchParams.get("priceFrom");
    const priceTo = searchParams.get("priceTo");
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = 6;

    // Создаем объект запроса
    let query = {};

    // Фильтр по местоположению
    if (location) {
      const locationPattern = new RegExp(location, "i");
      query.$or = [
        { name: locationPattern },
        { description: locationPattern },
        { "location.street": locationPattern },
        { "location.city": locationPattern },
        { "location.state": locationPattern },
        { "location.zipcode": locationPattern },
      ];
    }

    // Фильтр по типу недвижимости
    if (propertyType) {
      const typeArray = propertyType.split(",");
      query.type = { $in: typeArray };
    }

    // Фильтр по количеству комнат
    if (rooms) {
      const roomsArray = rooms.split(",");
      const roomQuery = {}; // ✅ Здесь мы определяем roomQuery

      if (roomsArray.includes("5+")) {
        roomQuery.$or = [
          { beds: { $in: roomsArray.filter((r) => r !== "5+").map(Number) } },
          { beds: { $gte: 5 } },
        ];
      } else {
        roomQuery.beds = { $in: roomsArray.map(Number) };
      }

      query = { ...query, ...roomQuery };
    }

    // Фильтр по цене
    if (priceFrom || priceTo) {
      query["rates.monthly"] = {};
      if (priceFrom) query["rates.monthly"].$gte = Number(priceFrom);
      if (priceTo) query["rates.monthly"].$lte = Number(priceTo);
    }

    // Подсчёт общего числа объявлений
    const total = await Property.countDocuments(query);

    // Получение данных с пагинацией
    const properties = await Property.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return new Response(JSON.stringify({ properties, total }), { status: 200 });
  } catch (error) {
    console.error("Ошибка при поиске недвижимости:", error);
    return new Response("Что-то пошло не так", { status: 500 });
  }
};

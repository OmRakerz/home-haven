import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/properties/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const property = await Property.findById(params.id);

    if (!property)
      return new Response("Недвижимость не найдена", { status: 404 });

    return new Response(JSON.stringify(property), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Ошибка сервера", { status: 500 });
  }
};

// DELETE /api/properties/:id
export const DELETE = async (request, { params }) => {
  try {
    const propertyId = params.id;

    const sessionUser = await getSessionUser();

    // Проверяем сессию (sesion)
    if (!sessionUser || !sessionUser.userId) {
      return new Response("Требуется авторизация", { status: 401 });
    }

    const { userId } = sessionUser;

    await connectDB();

    const property = await Property.findById(propertyId);

    if (!property)
      return new Response("Недвижимость не найдена", { status: 404 });

    // Проверяем (Verify) право собственности (ownership)
    if (property.owner.toString() !== userId) {
      return new Response("Доступ запрещен", { status: 401 });
    }

    await property.deleteOne();

    return new Response("Недвижимость удалена", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Ошибка сервера", { status: 500 });
  }
};

// PUT /api/properties/:id
export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("Требуется авторизация", { status: 401 });
    }

    const { id } = params;
    const { userId } = sessionUser;

    const formData = await request.formData();

    // Доступ ко всем значениям удобств (amenities)
    const amenities = formData.getAll("amenities");

    // Получим недвижимость (property) для обновления
    const existingProperty = await Property.findById(id);

    // Проверьте, является ли пользователь владельцем недвижимости
    if (!existingProperty) {
      return new Response("Недвижимость не существует", { status: 404 });
    }

    // Проверим право собственности (ownership)
    if (existingProperty.owner.toString() !== userId) {
      return new Response("Доступ запрещен", { status: 401 });
    }

    // Создаем объект propertyData для БД
    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_meters: formData.get("square_meters"),
      amenities,
      rates: {
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
        nightly: formData.get("rates.nightly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
    };

    // Обновление недвижимости в БД
    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData);

    return new Response(JSON.stringify(updatedProperty), {
      status: 200,
    });
  } catch (error) {
    return new Response("Не удалось добавить недвижимость", { status: 500 });
  }
};

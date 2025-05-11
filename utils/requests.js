const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Получить все недвижимости (properties)
async function fetchProperties({ showFeatured = false } = {}) {
  try {
    // Обработка случая, когда домен еще не доступен
    if (!apiDomain) {
      return [];
    }

    // const res = await fetch(`${apiDomain}/properties`, {
    //   next: { revalidate: 30 }, // Обновлять данные каждые 30 секунд
    // });

    const res = await fetch(
      `${apiDomain}/properties${showFeatured ? "/featured" : ""}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Получить одну недвижимость (property)
async function fetchProperty(id) {
  try {
    // Обработка случая, когда домен еще не доступен
    if (!apiDomain) {
      return null;
    }

    const res = await fetch(`${apiDomain}/properties/${id}`, {
      next: { revalidate: 30 }, // Обновлять данные каждые 30 секунд
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { fetchProperties, fetchProperty };

import InfoBox from "./InfoBox";

const InfoBoxes = () => {
  return (
    <section>
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <InfoBox
            heading="Арендаторам"
            backgroundColor="bg-gray-100"
            buttonInfo={{
              text: "Смотреть варианты",
              link: "/properties",
              backgroundColor: "bg-black",
            }}
          >
            Найдите жильё своей мечты. Сохраняйте понравившиеся варианты и
            связывайтесь с владельцами.
          </InfoBox>
          <InfoBox
            heading="Владельцам"
            backgroundColor="bg-blue-100"
            buttonInfo={{
              text: "Разместить объявление",
              link: "/properties/add",
              backgroundColor: "bg-blue-500",
            }}
          >
            Сдавайте недвижимость быстро и выгодно. Подходит для посуточной и
            долгосрочной аренды.
          </InfoBox>
        </div>
      </div>
    </section>
  );
};
export default InfoBoxes;

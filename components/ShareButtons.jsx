import {
  VKShareButton,
  TelegramShareButton,
  RedditShareButton,
  VKIcon,
  TelegramIcon,
  RedditIcon,
  EmailIcon,
} from "react-share";

const ShareButtons = ({ property }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`;
  const title = `${property.name} - ${property.type} в ${property.location.city}`;
  const description = `${
    property.description || "Отличный вариант недвижимости"
  }`;

  // Функция для открытия Gmail
  const handleGmailShare = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(`${description}\n\n${shareUrl}`)}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <h3 className="text-xl font-bold text-center pt-2">
        Поделиться недвижимостью:
      </h3>
      <div className="flex gap-3 justify-center pb-5">
        {/* VK */}
        <VKShareButton
          url={shareUrl}
          title={title}
          description={description}
          image={property.images[0]?.url || ""}
        >
          <VKIcon size={40} round={true} />
        </VKShareButton>

        {/* Telegram */}
        <TelegramShareButton url={shareUrl} title={title}>
          <TelegramIcon size={40} round={true} />
        </TelegramShareButton>

        {/* Reddit */}
        <RedditShareButton url={shareUrl} title={title}>
          <RedditIcon size={40} round={true} />
        </RedditShareButton>

        {/* Gmail */}
        <button
          onClick={handleGmailShare}
          className="react-share__share-button"
          aria-label="Поделиться через Gmail"
        >
          <EmailIcon size={40} round={true} />
        </button>
      </div>
    </>
  );
};

export default ShareButtons;

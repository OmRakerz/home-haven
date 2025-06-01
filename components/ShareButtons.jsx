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

  const handleRedditShare = () => {
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
      shareUrl
    )}&title=${encodeURIComponent(title)}`;

    // Параметры окна (аналогично react-share)
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      redditUrl,
      "Поделиться в Reddit",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

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
        <button onClick={handleRedditShare}>
          <RedditIcon size={40} round={true} />
        </button>

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

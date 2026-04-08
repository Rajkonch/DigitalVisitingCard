import "../../styles/UserProfile.css"; // Reuse styling logic or create new one

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/${slug}`);
    const card = await res.json();
    return {
      title: `${card.name} | Digital Visiting Card`,
      description: card.bio || `Connect with ${card.name} via their digital visiting card.`,
    };
  } catch (error) {
    return {
      title: "Prism QR Profile",
    };
  }
}

export default async function PublicProfilePage({ params }) {
  const { slug } = await params;
  
  // This is a Server Component, but we'll probably want a client component for the fancy animations
  // So I'll just pass the data to a client component
  let cardData = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/${slug}`, { cache: 'no-store' });
    cardData = await res.json();
  } catch (err) {
    return <div>Profile not found</div>;
  }

  if (!cardData) return <div>Loading...</div>;

  return (
    <div className="public-profile-viewer" style={{ background: cardData.bgColor }}>
      {/* Porting the visual logic from UserEditPublishProfile preview */}
      <div className="card-artifact" style={{ background: cardData.bgColor, color: cardData.textColor }}>
          <div className="avatar-section">
             <img src={cardData.avatar} alt={cardData.name} style={{ borderColor: cardData.themeColor }} />
          </div>
          <h1>{cardData.name}</h1>
          <p className="designation" style={{ color: cardData.themeColor }}>{cardData.designation}</p>
          <p className="bio" style={{ color: cardData.subTextColor }}>{cardData.bio}</p>
          
          <div className="social-links">
             {cardData.links?.filter(l => l.isActive).map(link => (
                <a key={link._id} href={link.content} target="_blank" style={{ background: `${cardData.themeColor}15`, color: cardData.themeColor }}>
                   {link.title}
                </a>
             ))}
          </div>

          <div className="contact-footer">
             {cardData.showMobile && <p>📞 {cardData.mobile}</p>}
             {cardData.showEmail && <p>📧 {cardData.email}</p>}
          </div>
      </div>
    </div>
  );
}

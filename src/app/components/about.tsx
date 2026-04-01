import { client } from "@/sanity/client";

const ABOUT_QUERY = `{
  "about": *[_type == "about"][0] {
    title,
    description,
    listening[] {
      label,
      url
    },
    clients,
    contactLinks[] {
      label,
      url
    }
  },
  "latestUpdate": *[!(_id in path("drafts.**")) && !(_type match "system.*") && !(_type match "sanity.*")] | order(_updatedAt desc)[0]._updatedAt
}`;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export default async function About() {
  const data = await client.fetch(ABOUT_QUERY);
  const about = data?.about;
  const latestUpdate = data?.latestUpdate;

  if (!about) return null;

  return (
    <div id="about-container">
      <div>
        {latestUpdate && (
          <h6 id="updated">Last update: {formatDate(latestUpdate)}</h6> // latestUpdate es la fecha del último publish de sanity
        )}
        <h1>
          <span>Javi Dardo </span>
          {about.description}
        </h1>
      </div>

      <div id="about-footer">
        <div className="about-item" id="legal">
          {about.contactLinks && about.contactLinks.length > 0 && (
            <>
              <h6>Contact</h6>
              {about.contactLinks.map((link: any, i: number) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ))}
            </>
          )}
        </div>

        <div className="about-item" id="listening">
          {about.listening && about.listening.length > 0 && (
            <>
              <h6>Listening</h6>
              {about.listening.map((item: any, i: number) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              ))}
            </>
          )}
        </div>

        <div className="about-item" id="clients">
          {about.clients && about.clients.length > 0 && (
            <>
              <h6>Clients</h6>
              <div>
                {about.clients.map((client: string, i: number) => (
                  <span key={i}>{client}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
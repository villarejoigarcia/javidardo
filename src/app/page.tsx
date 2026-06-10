import { client } from '@/sanity/client';
import { loaderProjectsQuery, projectsQuery } from "./queries/projects-query";
import HomeClient from './components/home-client';
import About from './components/about';

interface HomeProps {
  searchParams: Promise<{ from?: string }>;
}

const options = { next: { revalidate: 30 } };

const CATEGORIES_QUERY = `
*[_type == "category" && count(*[_type == "project" && defined(code) && code != "" && references(^._id)]) > 0] {
  _id,
  title,
  "slug": slug.current
}
`;

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;
  const skipIntroOnLoad = searchParams.from === 'close';

  const [projects, loaderProjects, categories] = await Promise.all([
    client.fetch(projectsQuery, {}, options),
    client.fetch(loaderProjectsQuery, {}, options),
    client.fetch(CATEGORIES_QUERY),
  ]);

  return (
    <>
      <About />
      <HomeClient
        projects={projects}
        loaderProjects={loaderProjects}
        categories={categories}
        skipIntroOnLoad={skipIntroOnLoad}
      />
    </>
  );
}
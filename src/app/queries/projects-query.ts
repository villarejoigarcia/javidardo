export const projectsQuery = `*[_type == "project"] | order(publishedAt desc){
  title,
  slug,
  code,
  images[]{asset->{_id,url}},
  categories[]-> { title }
}`;
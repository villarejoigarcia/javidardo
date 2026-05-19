export const projectsQuery = `*[_type == "project" && count(images) > 1] | order(publishedAt desc){
  title,
  slug,
  code,
  images[]{asset->{_id,url}},
  categories[]-> {
    title,
    "slug": slug.current
  }
}`;
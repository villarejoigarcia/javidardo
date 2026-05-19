export const projectsQuery = `*[_type == "project" && count(images) > 1] | order(coalesce(length(code), 9999) desc, code desc){
  title,
  slug,
  code,
  images[]{asset->{_id,url}},
  categories[]-> {
    title,
    "slug": slug.current
  }
}`;
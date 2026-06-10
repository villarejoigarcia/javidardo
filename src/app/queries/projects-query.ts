export const loaderProjectsQuery = `*[_type == "project"] | order(coalesce(length(code), 9999) desc, code desc){
  title,
  slug,
  code,
  images[]{asset->{_id,url}},
  categories[]-> {
    title,
    "slug": slug.current
  }
}`;

export const projectsQuery = `*[_type == "project" && defined(code) && code != ""] | order(coalesce(length(code), 9999) desc, code desc){
  title,
  slug,
  code,
  images[]{asset->{_id,url}},
  categories[]-> {
    title,
    "slug": slug.current
  }
}`;
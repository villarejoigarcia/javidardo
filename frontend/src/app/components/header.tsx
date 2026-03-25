import { client } from "@/sanity/client";

const CATEGORIES_QUERY = `
*[_type == "category"] {
  _id,
  title,
  "slug": slug.current
}
`;

export default async function Header() {
  const categories = await client.fetch(CATEGORIES_QUERY);

  return (
    <header className="flex gap-x-(--kv) fixed w-full z-10 bottom-0 left-0 items-end justify-between p-(--kv)">
     
      <div className="lg:flex-1">
        <h1>Javi Dardo</h1>
      </div>

      <div className="flex-1 lg:text-center lg:pb-0 pb-[5px]">
        <p>New website soon</p>
      </div>

      <div className="lg:flex-1 text-right lg:pb-0 pb-[5px]">
        <p>Apr. 2026</p>
      </div>
      
      {/* <div>
        <h6>View</h6>
        <div id="front-links">
          <a id="gallery-button" className="active" data-index="0">Gallery</a>
          <a id="archive-button" data-index="1">Archive</a>
          <a id="selected-button" data-index="2">Selected</a>
        </div>
        <div id="single-links">
          <a id="all-button" className="active" data-index="0">All</a>
          <a id="single-button" data-index="1">Gallery</a>
        </div>
      </div>
      
      <div className="menus" id="categories">
        <h6>Category</h6>
        {categories.map((category: any) => (
          <a
            key={category._id}
            data-category={category.slug}
          >
            {category.title}
          </a>
        ))}
      </div>
      
      <div id="about">
        <a>About</a>
        <div id="switcher">
          <div id="bright-mode"></div>
          <div id="dark-mode"></div>
        </div>
      </div> */}

    </header>
  );
}
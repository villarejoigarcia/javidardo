import { client } from "@/sanity/client";
import { Logo } from "./logo";

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
    // <header className="flex gap-x-(--kv) fixed w-full z-10 bottom-0 left-0 items-end justify-between p-(--kv)">
    <header className="flex gap-x-(--kv) fixed w-full z-10 bottom-0 left-0 items-end justify-between p-[5px]">
     
      <div className="lg:flex-1">
        <Logo />
      </div>

      <div className="flex-1 flex flex-col items-center">
        <a href="https://www.instagram.com/javidardo" target="_blank">@javidardo</a>
        <a href="tel:+34 669 34 23 05" target="_blank">+34 669 34 23 05</a>
        <a href="mailto:contact@javidardo.com" target="_blank">contact@javidardo.com</a>
      </div>

      <div className="lg:flex-1 text-right flex-0">
        <h6>New website soon</h6>
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
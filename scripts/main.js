function slugs() {

	if (!window.content || !window.content.projects) return;

	const c = window.content;

	c.projects.forEach(project => {

		const title = project.fields?.title || '';

		const slug = title
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^\w\s-]/g, '')
			.trim()
			.replace(/\s+/g, '-');

		project.slug = slug;

	});
}

$(document).ready(function () {

	if (!window.content || !window.content.projects) return;

	const c = window.content;

	// slugs
	c.projects.forEach(project => {

		const title = project.fields?.title || '';

		const slug = title
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^\w\s-]/g, '')
			.trim()
			.replace(/\s+/g, '-');

		project.slug = slug;

	});

	// load
	function responsive() {

		// categories
		const categoriesWrapper = $('#categories');
		categoriesWrapper.find('a').remove();

		const categories = [
			...new Set(
				window.content.projects
					.map(project => project.category)
					.filter(Boolean)
			)
		].sort((a, b) => a.localeCompare(b));

		categories.forEach(category => {

			const categoryFormat = category
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/[^\w\s-]/g, '')
				.trim()
				.replace(/\s+/g, '-');

			const link = $('<a>')
				.text(category)
				.attr('data-category', categoryFormat);

			categoriesWrapper.append(link);
		});

		//gallery
		const galleryContainer = $('#gallery');

		c.projects.forEach((project, index) => {

			const categoryFormat = project.category
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/[^\w\s-]/g, '')
				.trim()
				.replace(/\s+/g, '-');

			const galleryItem = $('<a>')
				.addClass('gallery-item')
				.attr('data-index', index + 1)
				.attr('href', `#${project.slug}`)
				.attr('data-category', categoryFormat);

			const isMobile = window.innerWidth <= 768;

			if (isMobile && index === 0) {
				galleryItem.addClass('active');
			}

			// heading
			if (project.fields) {

				const itemCaption = $('<div>').addClass('caption');
				const values = Object.values(project.fields);
				const title = $('<p>').text(values.join('.'));
				const div = $('<div>');
				div.append(title);
				itemCaption.append(div);

				if (project.media?.length > 0) {

					const indexContainer = $('<div>').addClass('media-index');

					project.media.slice(0, 5).forEach((m, i) => {
						const number = $('<span>')
							.text(i + 1)
							.attr('data-index', i + 1)
							.toggleClass('active', i === 0);

						indexContainer.append(number);
					});

					itemCaption.append(indexContainer);
				}

				galleryItem.append(itemCaption);
			}

			// media
			if (project.media && project.media.length > 0) {

				const itemMedia = $('<div>').addClass('media');

				project.media.slice(0, 5).forEach((m, i) => {

					const cover = $('<img>')
						.attr('src', m.src)
						.attr('alt', project.fields.client)
						.attr('data-index', i + 1)
						.toggleClass('active', i === 0);

					itemMedia.append(cover);
				});

				galleryItem.append(itemMedia);

				galleryContainer.append(galleryItem);
			}
		});

		// archive

		const archiveContainer = $('#archive');

		c.projects.forEach((project, index) => {

			const categoryFormat = project.category
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/[^\w\s-]/g, '')
				.trim()
				.replace(/\s+/g, '-');

			const archiveItem = $('<div>').addClass('archive-item')
				.attr('data-index', index + 1)
				// .toggleClass('active', index > 0)
				// .toggleClass('active')
				.attr('data-category', categoryFormat);

			// heading
			if (project.fields) {

				const itemCaption = $('<a>')
				.addClass('caption')
				.attr('href', `#${project.slug}`);

				Object.entries(project.fields).forEach(([key, value]) => {
					const div = $('<div>');
					const title = $('<p>').text(value).addClass(key);
					div.append(title);
					itemCaption.append(div);
				});

				if (project.media?.length > 0) {

					const indexContainer = $('<div>').addClass('media-index');

					const mediaTotal = $('<span>')
						.addClass('media-count')
						.text(`${project.media.length} images`);

					indexContainer.append(mediaTotal);

					itemCaption.append(indexContainer);

					archiveItem.append(itemCaption);
				}
			}

			// media
			if (project.media && project.media.length > 0) {

				project.media.slice(0, 5).forEach((m, i) => {

					const itemMedia = $('<div>');

					const postSlug = $('<a>')
						.attr('href', `#${project.slug}`);

					const cover = $('<img>')
						.attr('src', m.src)
						.attr('alt', project.fields.client)
						.attr('data-index', i + 1);
						// .toggleClass('active', i === 0);

					postSlug.append(cover);
					
					itemMedia.append(postSlug);

					archiveItem.append(itemMedia);

				});

				archiveContainer.append(archiveItem);

			}
		});

		// selected
		const selectedContainer = $('#selected');
		const selectedList = $('<div>').attr('id', 'selected-list');

		const selectedProjects = c.projects.filter(project =>
			project.fields && project.hierarchy === 'selected'
		);

		// list
		selectedProjects.forEach((project, index) => {

			const itemCaption = $('<a>')
				.addClass('caption')
				.attr('data-index', index + 1)
				.attr('href', `#${project.slug}`);
				// .toggleClass('active', index === 0);

			const values = Object.values(project.fields);
			const title = $('<p>').text(values.join('.'));
			const div = $('<div>');
			div.append(title);
			itemCaption.append(div);

			selectedList.append(itemCaption);
		});

		selectedContainer.append(selectedList);
		
		// media
		const selectedMedia = $('<div>').attr('id', 'selected-media');
		
		selectedProjects.forEach((project, index) => {

			if (project.media && project.media.length > 0) {

				const categoryFormat = project.category
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^\w\s-]/g, '')
					.trim()
					.replace(/\s+/g, '-');

				const selectedItem = $('<div>').addClass('selected-item')
					.attr('data-index', index + 1)
					.toggleClass('active', index === 0)
					.attr('data-category', categoryFormat);

				const indexContainer = $('<div>').addClass('media-index');

				project.media.slice(0, 5).forEach((m, i) => {
					const number = $('<span>')
						.text(i + 1)
						.attr('data-index', i + 1)
						.toggleClass('active', i === 0);

					indexContainer.append(number);
				});

				selectedItem.append(indexContainer);

				// media
				const itemMedia = $('<a>')
				.addClass('media')
				.attr('href', `#${project.slug}`);

				project.media.slice(0, 5).forEach((m, i) => {

					const cover = $('<img>')
						.attr('src', m.src)
						.attr('alt', project.fields.client)
						.attr('data-index', i + 1)
						.toggleClass('active', i === 0);

					itemMedia.append(cover);

					selectedItem.append(itemMedia);

				});

				selectedMedia.append(selectedItem);

				selectedContainer.append(selectedMedia);

			}
		});

		// close

		$(document).on('click', '#single-close', function () {

			$('#front-page').children().addClass('hide');
			$('#front-page').removeAttr('data-template');

			$('#single-links').removeClass('active');

			$('#front-page').css('pointer-events', 'none');

			setTimeout(() => {

				$('#front-page').empty();
		
				setTimeout(() => {

					$('#front-page').append(galleryContainer);
					$('#front-page').append(archiveContainer);
					$('#front-page').append(selectedContainer);

					$('#front-links').removeClass('hide');

					setTimeout(() => {

						$('#front-page').children().removeClass('hide');
						history.pushState({}, '', window.location.pathname);
						story();
						
					});

					$('.gallery-item, .archive-item').removeClass('active filter');

					$('.archive-item').addClass('delay');

					if (!$('#selected').hasClass('active')) {
						$('#categories a').removeClass('selected');
					}

					setTimeout(() => {
						$('#front-page').css('pointer-events', 'auto');
						$('.archive-item').removeClass('delay');
					}, 666);

				});

			}, 1000);

		});

	}

	responsive();

	let lastIsMobile = window.innerWidth <= 768;

	$(window).on('resize', function () {
		const isMobile = window.innerWidth <= 768;
		if (isMobile !== lastIsMobile) {
			responsive();
			lastIsMobile = isMobile;
		}
	});

	// functions
	horizontalScroll();
	story();

});

function horizontalScroll() {

	if (window.innerWidth <= 768) return;

	const gallery = document.querySelector("#gallery");

	if (!gallery) return;

	gallery.addEventListener("wheel", (event) => {

		event.preventDefault();
		gallery.scrollLeft += (event.deltaY + event.deltaX);

	});

}

function story() {

	let interval;

	$('.gallery-item, .selected-item, #single-gallery').each(function () {

		let captionActive = false;

		const item = $(this);

		// const media = item.find('.media');

		const images = item.find('img[data-index]');
		const mediaIndex = item.find('.media-index [data-index]');
		const caption = item.find('.media-index');

		let current = 1;
		const total = images.length;

		const activate = (i) => {
			current = i;
			images.removeClass('active');
			mediaIndex.removeClass('active');

			images.filter(`[data-index="${i}"]`).addClass('active');
			mediaIndex.filter(`[data-index="${i}"]`).addClass('active');
		};

		caption.on('mouseenter', function() {
			captionActive = true;
		});

		caption.on('mouseleave', function() {
			captionActive = false;
		});

		// index control
		caption.on('mouseenter', '[data-index]', function () {
			const i = parseInt($(this).attr('data-index'), 10);
			activate(i);
		});

		const startAutoplay = () => {
			clearInterval(interval);
			interval = setInterval(() => {
				if (captionActive) return;
				current = (current % total) + 1;
				activate(current);
			}, 500);
		};

		item.on('mouseenter', function () {

			// get last index
			const activeImage = images.filter('.active');
			if (activeImage.length > 0) {
				current = parseInt(activeImage.attr('data-index'));
			} else {
				current = 1;
			}

			startAutoplay();
		});

		item.on('mouseleave click', function () {
			clearInterval(interval);

			// last active
			const activeImage = images.filter('.active');
			if (activeImage.length > 0) {
				current = parseInt(activeImage.attr('data-index'));
			}
		});
		
	});
}

// view

$(document).on('click', '#view>div a', function () {

	const index = $(this).data('index');

	$(this).siblings().removeClass('active');
	$(this).addClass('active');

	$('#front-page>*').removeClass('active');
	$(`#front-page>*[data-index="${index}"]`).addClass('active');

	$('#gallery').addClass('unactive');

	// if (!$(this).is('#gallery-button')) {
	// 	$('#gallery').animate(
	// 		{ scrollLeft: 0 },
	// 		1000
	// 	);
	// }

	if ($(this).is('#gallery-button')) {

		$('#categories a').removeClass('active filter');

		$('#gallery').removeClass('unactive');
	}

	if ($(this).is('#archive-button')) {

		$('#categories a').removeClass('active filter');
		$('#archive').scrollTop(0);

	}
	

	if ($(this).is('#selected-button')) {

		const $activeSelected = $('.selected-item.active');

		const category = $activeSelected.data('category');

		$('#categories a').removeClass('active filter');
		$('#categories a[data-category="' + category + '"]').addClass('active');

		$('#categories a').addClass('selected');
	
	} else {

		if ($('#front-page').attr('data-template') === 'single') return;

		$('#categories a').removeClass('selected');
	}

	if (!$(this).is('#archive-button')) {
		setTimeout(() => {
			$('.archive-item').removeClass('active filter');
		}, 500);
	}

	$('.gallery-item').removeClass('active filter');

});

$(document).on('click', '#front-page > * > * > *, #front-page > * > *', function (e) {
	
	const container = this;

	const clickTarget = e.target !== container &&
		container.contains(e.target);

	if (clickTarget) return;

	$('#view a').removeClass('active');
	$('#view a[data-index="0"]').addClass('active');

	$('#front-page > *').removeClass('active');
	$('#front-page > *[data-index="0"]').addClass('active');

	setTimeout(() => {
		$('#archive').scrollTop(0);
	}, 500);

	$('#gallery').removeClass('unactive');
	$('#categories a').removeClass('active filter selected');
	setTimeout(() => {
			$('.archive-item').removeClass('active filter');
		}, 500);
});

// archive
$(document).on('mouseenter', '.archive-item', function () {

	if ($('#categories a').hasClass('filter')) return;

	
		$('.archive-item').not(this).removeClass('active');
		$(this).addClass('active');

});

// $(document).on('mouseleave', '.archive-item', function () {

// 	$('.archive-item').addClass('active');

// });

// switcher
$(document).on('click', '#switcher', function () {

	$('#dark-mode').toggleClass('active');
	$(':root').toggleClass('dark');

});

// about
$(document).on('click', '#about a', function () {


	if ($('#about-container').hasClass('active')) {
		$(this).text('About');

		setTimeout(() => {
			$('#about-container').toggleClass('active');

			const parent = $('#about-container');
			parent.height(0);

			$('header').toggleClass('active');

			$('header').css('transform', 'translateY(0)');

			$('.menus').toggleClass('active');
		}, 333);
		
	} else {
		$(this).text('Close');

		const parent = $('#about-container');
		let totalHeight = 0;

		parent.children().not(':first').each(function () {
			totalHeight += $(this).outerHeight(true);
		});

		parent.height(totalHeight);

		$('#about-container').toggleClass('active');

		$('header').toggleClass('active');
		$('header').css('transform', 'translateY(-' + totalHeight + 'px)');

		$('.menus').toggleClass('active');
	}

	$('#about-filter').toggleClass('active');

});

$(document).on('click', '#about-filter', function () {

	if ($('#about-container').hasClass('active')) {

		setTimeout(() => {
			$('#about-container').removeClass('active');
			$('header').removeClass('active');
			$('.menus').removeClass('active');
			const parent = $('#about-container');
			parent.height(0);
			$('header').css('transform', 'translateY(0)');
		}, 333);

	} else {

		$('#about-container').removeClass('active');
		$('header').removeClass('active');
		$('.menus').removeClass('active');
		const parent = $('#about-container');
		parent.height(0);
		$('header').css('transform', 'translateY(0)');
	}

	$('#about-filter').removeClass('active');

	$('#about a').text('About');

});

// interactive

$(document).ready(function () {

	const selected = document.querySelector('#selected');
	const selectedList = document.querySelector('#selected-list');
	const selectedMedia = document.querySelector('#selected-media');

	const selectedItems = Array.from(selectedList.children);
	const selectedMediaItems = Array.from(selectedMedia.children);

	let activeIndex = 0;
	let isThrottled = false;

	function loopIndex(index) {
		const last = selectedItems.length - 1;
		if (index > last) return 0;
		if (index < 0) return last;
		return index;
	}

	// categories
	function syncCategories(index) {

		const activeItem = selectedMediaItems[index];
		
		if (!activeItem) return;

		if (!$('#selected').hasClass('active')) return;

		const category = activeItem.dataset.category;

		document
			.querySelectorAll('#categories a')
			.forEach(a => {
				a.classList.toggle(
					'active',
					a.dataset.category === category
				);
			});
	}

	function setActive(index) {

		// list
		selectedItems.forEach((item, i) => {
			item.classList.toggle('active', i === index);
		});

		// media
		selectedMediaItems.forEach((media, i) => {
			media.classList.toggle('active', i === index);
		});

		// sync 
		syncCategories(index);
		
	}

	setActive(activeIndex);

	// scroll
	selected.addEventListener('wheel', (e) => {
		e.preventDefault();
		if (isThrottled) return;

		activeIndex = e.deltaY > 0
			? loopIndex(activeIndex + 1)
			: loopIndex(activeIndex - 1);

		setActive(activeIndex);

		isThrottled = true;
		setTimeout(() => isThrottled = false, 300);
	}, { passive: false });

	// hover
	const isMobile = window.innerWidth <= 768;

	selectedItems.forEach((item, i) => {

		function activeThumb() {
			activeIndex = i;
			setActive(activeIndex);
		}

		if (!isMobile) {
			item.addEventListener('mouseenter', () => {
				activeThumb();
			});
		} else {
			item.addEventListener('click', () => {
				activeThumb();
			});
		}
	});

	// arrows
	document.addEventListener('keydown', (e) => {
		const nextKeys = ['ArrowDown', 'ArrowRight'];
		const prevKeys = ['ArrowUp', 'ArrowLeft'];

		if (nextKeys.includes(e.key)) {
			activeIndex = loopIndex(activeIndex + 1);
			setActive(activeIndex);
		}

		if (prevKeys.includes(e.key)) {
			activeIndex = loopIndex(activeIndex - 1);
			setActive(activeIndex);
		}
	});

});

// dartboard
$(document).ready(function () {

	const circle = document.querySelector('#selected-list');
	const items = circle.querySelectorAll('.caption');
	const total = items.length;

	function layoutCircle() {
		const radius = circle.clientHeight / 2;

		items.forEach((item, index) => {
			const angle = (360 / total) * index - 90;

			item.style.transform = `
			translateX(-50%)
			rotate(${angle}deg)
			translate(${radius}px)
			rotate(${-angle}deg)
		`;
		});
	}

	const observer = new ResizeObserver(layoutCircle);
	observer.observe(circle);

	layoutCircle();

});

// url

// $(document).on('click', '.gallery-item', function (e) {
// 	e.preventDefault();
// 	const slug = $(this).attr('href').substring(1);
// 	history.pushState({ slug }, '', `#${slug}`);
// 	showProject(slug);
// });

$(window).on('popstate', function () {
	const hash = window.location.hash;
	if (hash) {
		const slug = hash.substring(1);
		showProject(slug);
	} else {
		responsive();
	}
});

$(document).ready(function () {
	const hash = window.location.hash;
	if (hash) {
		const slug = hash.substring(1);
		showProject(slug);
	}
});

// single
function showProject(slug) {

	const index = window.content.projects.findIndex(p => p.slug === slug);
	const project = window.content.projects[index];
	const container = $('#front-page');
	const transition = 1000;

	function normalizeCategory(str) {
		return str
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^\w\s-]/g, '')
			.trim()
			.replace(/\s+/g, '-');
	}

	const projectCategory = normalizeCategory(project.category);

	$('#categories a').removeClass('active filter');
	$('#categories a[data-category="' + projectCategory + '"]').addClass('active');
	$('#categories a').addClass('selected');

	if (!project) return;

	const isSingle = container.attr('data-template') === 'single';

	if (!isSingle) {

		container.children().addClass('hide');
		$('#front-links').addClass('hide');

		setTimeout(() => {
			container.empty();
			container.attr('data-template', 'single');

			renderPost();

		}, transition);


	} else {
		const postContainer = $('#post');
		const mediaContainer = postContainer.find('#media-container');

		mediaContainer.empty();

		renderMedia(mediaContainer, project);

		const activeIndex = index + 1;
		postContainer.find('#list .caption').each(function () {
			const itemIndex = $(this).data('index');
			$(this).toggleClass('active', itemIndex === activeIndex);
		});

		story();

		$('#all-button').addClass('active');
		$('#single-button').removeClass('active');
	}

	function renderPost() {
		const postContainer = $('<div>').attr('id', 'post')
			.attr('data-index', index + 1)
			.addClass('hide');

		// list
		if (project.fields) {
			const singleNav = $('<div>').attr('id', 'single-nav');

			const singleClose = $('<h6>').attr('id', 'single-close');
			const link = $('<a>').text('Close');
			singleClose.append(link);

			const list = $('<div>').attr('id', 'list');
			const activeIndex = index + 1;

			window.content.projects.forEach((p, i) => {

				const categoryFormat = normalizeCategory(p.category);

				const itemIndex = i + 1;
				const itemCaption = $('<div>')
					.addClass('caption')
					.attr('data-index', itemIndex)
					.toggleClass('active', itemIndex === activeIndex)
					.attr('data-category', categoryFormat);

				const values = Object.values(p.fields);
				const title = $('<a>').attr('href', `#${p.slug}`).text(values.join('.'));

				itemCaption.append(title);
				list.append(itemCaption);
			});

			singleNav.append(singleClose).append(list);
			postContainer.append(singleNav);
		}

		// media
		const mediaContainer = $('<div>').attr('id', 'media-container');
		renderMedia(mediaContainer, project);
		postContainer.append(mediaContainer);

		container.append(postContainer);

		setTimeout(() => postContainer.removeClass('hide'), 0);

		story();

		// view 
		setTimeout(() => {
			setTimeout(() => {
				$('#single-links').addClass('active');
			});
		});
	}

	function renderMedia(mediaContainer, project) {
		if (!project.media) return;

		// single
		const singleGallery = $('<div>').attr('id', 'single-gallery');
		const singleMedia = $('<div>').addClass('media');
		const indexContainer = $('<div>').addClass('media-index');

		project.media.forEach((m, i) => {
			if (m.type === 'image') {
				const $img = $('<img>')
					.attr('src', m.src)
					.attr('alt', project.fields.client)
					.attr('data-index', i + 1)
					.toggleClass('active', i === 0);
				singleMedia.append($img);

				const number = $('<span>')
					.text(i + 1)
					.attr('data-index', i + 1)
					.toggleClass('active', i === 0);
				indexContainer.append(number);
			}
		});

		singleGallery.append(singleMedia).append(indexContainer);
		mediaContainer.append(singleGallery);

		// all
		const archiveGallery = $('<div>').attr('id', 'single-archive');

		project.media.forEach((m, i) => {

			const archiveMedia = $('<div>').addClass('media-archive');

			if (m.type === 'image') {
				const $img = $('<img>')
					.attr('src', m.src)
					.attr('alt', project.fields.client)
					.attr('data-index', i + 1);
					// .toggleClass('active', i === 0);
				archiveMedia.append($img);

				const number = $('<span>')
					.text(i + 1)
					.attr('data-index', i + 1);
					// .toggleClass('active', i === 0);
				archiveMedia.append(number);
			}

			archiveGallery.append(archiveMedia);
			
		});

		mediaContainer.append(archiveGallery);

		// view
		$('#single-button').on('click', function () {
			archiveGallery.addClass('hide');
			singleGallery.addClass('active');
		});

		$('#all-button').on('click', function () {
			archiveGallery.removeClass('hide');
			singleGallery.removeClass('active');
		});

	}
}

// gallery item

$(document).on('mouseenter', '.gallery-item', function () {

	if ($('#categories a').hasClass('filter')) return;

	$(this).addClass('active');
	$('.gallery-item').not(this).removeClass('active');
	
});

$(document).on('mouseleave', '.gallery-item', function () {

	if ($('#categories a').hasClass('filter')) return;

	$('.gallery-item').removeClass('active');

});

// categories

$(document).on('mouseenter', '.gallery-item, .archive-item', function () {

	if ($('#categories a').hasClass('filter')) return;

	const category = $(this).data('category');

	$('#categories a').removeClass('active');
	$('#categories a[data-category="' + category + '"]').addClass('active');
});

$(document).on('mouseleave', '.gallery-item', function () {
	
	if ($('#categories a').hasClass('filter')) return;

	$('#categories a').removeClass('active');
});

// categories
$(document).on('click', '#categories a', function () {

	if ($('#front-page').attr('data-template') === 'single') return;

	const category = $(this).data('category');

	$('#categories a').removeClass('active');
	$(this).addClass('active');

	// gallery
	if ($('#gallery-button').hasClass('active')) {

		$(this).toggleClass('filter');
		$('#categories a').not(this).removeClass('filter');

		$('.gallery-item').removeClass('active filter');

		const $activeItems = $('.gallery-item[data-category="' + category + '"]');
		$activeItems.addClass('active');

		$('.gallery-item').not('.active').addClass('filter');

		const $gallery = $('#gallery');
		const $firstActive = $activeItems.first();

		if ($(this).hasClass('filter')) {

			if ($firstActive.length) {

				setTimeout(() => {

					const galleryLeft = $gallery.offset().left;
					const itemLeft = $firstActive.offset().left;
					const scrollLeft = $gallery.scrollLeft();

					const targetScroll =
						scrollLeft + (itemLeft - galleryLeft) - 8;


					$gallery.animate(
						{ scrollLeft: targetScroll },
						1000
					);

				}, 666);
			}
		} else {

			$('.gallery-item').removeClass('active filter');
			$(this).removeClass('active');

			$('.gallery-item').not('.active').removeClass('filter');
			
		}

	}

	// archive
	if ($('#archive-button').hasClass('active')) {

		$(this).toggleClass('filter');
		$('#categories a').not(this).removeClass('filter');

		$('.archive-item').removeClass('active filter');

		const activeItems = $('.archive-item[data-category="' + category + '"]');
		activeItems.addClass('active');

		$('.archive-item').not(activeItems).addClass('filter');

		const archive = $('#archive');
		const $firstActive = activeItems.first();

		if ($(this).hasClass('filter')) {

			if ($firstActive.length) {

				setTimeout(() => {

					const galleryTop = archive.offset().top;
					const itemTop = $firstActive.offset().top;
					const scrollTop = archive.scrollTop();

					const targetScroll =
						scrollTop + (itemTop - galleryTop) - 8;


					archive.animate(
						{ scrollTop: targetScroll },
						1000
					);

				}, 666);
			}
		} else {

			$('.archive-item').removeClass('active filter');
			$(this).removeClass('active');
			
		}
	}

});

// single archive

$(document).on('click', '.media-archive', function () {
	$('.media-archive').not(this).removeClass('active');
	$('.media-archive').not(this).addClass('hide');
	$(this).toggleClass('active');
	$(this).removeClass('hide');

	if (!$(this).hasClass('active')) {
		$('.media-archive').removeClass('hide');
	}
});
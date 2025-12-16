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

		//gallery
		const galleryContainer = $('#gallery');

		c.projects.forEach((project, index) => {

			const galleryItem = $('<div>').addClass('gallery-item').attr('data-index', index);

			// heading
			if (project.fields) {

				const itemCaption = $('<div>').addClass('caption');

				Object.entries(project.fields).forEach(([key, value]) => {
					const div = $('<div>');
					const title = $('<p>').text(value);
					div.append(title);
					itemCaption.append(div);
				});

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

			const archiveItem = $('<div>').addClass('archive-item')
				.attr('data-index', index)
				.toggleClass('active', index === 1);

			// heading
			if (project.fields) {

				const itemCaption = $('<div>').addClass('caption');

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

					const cover = $('<img>')
						.attr('src', m.src)
						.attr('alt', project.fields.client)
						.attr('data-index', i + 1)
						// .toggleClass('active', i === 0);

					itemMedia.append(cover);

					archiveItem.append(itemMedia);

				});

				archiveContainer.append(archiveItem);

				
			}
		});

		// selected
		const selectedContainer = $('#selected');
		const selectedList = $('<div>').attr('id', 'selected-list');

		// filtrar solo selected
		const selectedProjects = c.projects.filter(project =>
			project.fields && project.hierarchy === 'selected'
		);

		// list
		selectedProjects.forEach((project, index) => {

			const itemCaption = $('<div>')
				.addClass('caption')
				.attr('data-index', index + 1)
				// .toggleClass('active', index === 0);

			Object.entries(project.fields).forEach(([key, value]) => {
				const div = $('<div>');
				const title = $('<p>').text(value).addClass(key);
				div.append(title);
				itemCaption.append(div);
			});

			selectedList.append(itemCaption);
		});

		// append una sola vez
		selectedContainer.append(selectedList);
		
		// media
		const selectedMedia = $('<div>').attr('id', 'selected-media');
		
		selectedProjects.forEach((project, index) => {

			if (project.media && project.media.length > 0) {

				const selectedItem = $('<div>').addClass('selected-item')
					.attr('data-index', index + 1)
					.toggleClass('active', index === 0);

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
				const itemMedia = $('<div>').addClass('media');

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
	// dartboard();

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

	$('.gallery-item, .selected-item').each(function () {

		let captionActive = false;

		const item = $(this);

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

		item.on('mouseleave', function () {
			clearInterval(interval);

			// last active
			const activeImage = images.filter('.active');
			if (activeImage.length > 0) {
				current = parseInt(activeImage.attr('data-index'));
			}
		});
		
	});
}

// function dartboard() {

// 	$('#selected-list .caption').on('mouseenter', function () {
		
// 		const index = $(this).data('index');

// 		$('#selected-list .caption').removeClass('active');
// 		$(this).addClass('active');

// 		$('#selected-media .selected-item').removeClass('active');
// 		$(`#selected-media .selected-item[data-index="${index}"]`).addClass('active');

// 	});

// }

// filter

$(document).on('click', '#view a', function () {
	const index = $(this).data('index');

	$('#view a').removeClass('active');
	$(this).addClass('active');

	$('#front-page>*').removeClass('active');
	$(`#front-page>*[data-index="${index}"]`).addClass('active');

	$('#gallery').addClass('unactive');

	if ($(this).is('#gallery-button')) {
		$('#gallery').removeClass('unactive');
	}

	// if (!$(this).is('#archive-button')) {
	// 	setTimeout(() => {
	// 		$('.archive-item').not().first().removeClass('active');
	// 		$('#archive').scrollTop(0);
	// 	}, 500);
	// }

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
		$('.archive-item').not().first().removeClass('active');
		$('#archive').scrollTop(0);
	}, 500);

	$('#gallery').removeClass('unactive');
});

// archive
$(document).on('mouseenter', '.archive-item', function () {

	$('.archive-item').not(this).addClass('active');
	$(this).removeClass('active');

});

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
			$('header').toggleClass('active');
			$('.menus').toggleClass('active');
		}, 333);
		
	} else {
		$(this).text('Close');

		$('#about-container').toggleClass('active');
		$('header').toggleClass('active');
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
		}, 333);
		
	} else {

		$('#about-container').removeClass('active');
		$('header').removeClass('active');
		$('.menus').removeClass('active');
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

	function setActive(index) {

		// list
		selectedItems.forEach((item, i) => {
			item.classList.toggle('active', i === index);
		});

		// media
		selectedMediaItems.forEach((media, i) => {
			media.classList.toggle('active', i === index);
		});
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
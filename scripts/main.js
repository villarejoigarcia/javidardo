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

					project.media.forEach((m, i) => {
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

				project.media.forEach((m, i) => {

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

		// //archive
		// const archiveContainer = $('#archive');

		// c.projects.forEach((project, index) => {

		// 	const archiveItem = $('<div>').addClass('archive-item').attr('data-index', index);

		// 	// heading
		// 	if (project.fields) {

		// 		const itemCaption = $('<div>').addClass('caption');

		// 		Object.entries(project.fields).forEach(([key, value]) => {
		// 			const div = $('<div>');
		// 			const title = $('<p>').text(value);
		// 			div.append(title);
		// 			itemCaption.append(div);
		// 		});

		// 		if (project.media?.length > 0) {

		// 			const indexContainer = $('<div>').addClass('media-index');

		// 			const mediaTotal = $('<span>')
		// 				.addClass('media-count')
		// 				.text(`${project.media.length} images`);

		// 			indexContainer.append(mediaTotal);

		// 			itemCaption.append(indexContainer);

		// 			archiveItem.append(itemCaption);
		// 		}
		// 	}

		// 	// media
		// 	if (project.media && project.media.length > 0) {

		// 		const itemMedia = $('<div>');

		// 		project.media.forEach((m, i) => {

		// 			const cover = $('<img>')
		// 				.attr('src', m.src)
		// 				.attr('alt', project.fields.client)
		// 				.attr('data-index', i + 1)
		// 				.toggleClass('active', i === 0);

		// 			itemMedia.append(cover);
		// 		});

		// 		archiveItem.append(itemMedia);

		// 		archiveContainer.append(archiveItem);
		// 	}
		// });

		//archive
		const archiveContainer = $('#archive');

		c.projects.forEach((project, index) => {

			const archiveItem = $('<div>').addClass('archive-item').attr('data-index', index);

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

				project.media.forEach((m, i) => {

					const itemMedia = $('<div>');

					const cover = $('<img>')
						.attr('src', m.src)
						.attr('alt', project.fields.client)
						.attr('data-index', i + 1)
						.toggleClass('active', i === 0);

					itemMedia.append(cover);

					archiveItem.append(itemMedia);

				});

				archiveContainer.append(archiveItem);

				
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

	//functions
	horizontalScroll();
	storyFormat();

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

function storyFormat() {

	let interval;

	$('.gallery-item').each(function () {

		const item = $(this);

		const images = item.find('img[data-index]');
		const indexes = item.find('.media-index [data-index]');

		let current = 1;
		const total = images.length;

		const activate = (i) => {
			current = i;
			images.removeClass('active');
			indexes.removeClass('active');

			images.filter(`[data-index="${i}"]`).addClass('active');
			indexes.filter(`[data-index="${i}"]`).addClass('active');
		};

		const startAutoplay = () => {
			clearInterval(interval);
			interval = setInterval(() => {
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

// archive

$(document).on('click', '.archive-item, .menus:not(:first-child) a', function () {

	$('#archive').removeClass('active');
	$('#archive-button').removeClass('active');
	$('#gallery-button').addClass('active');

});

$(document).on('click', '.menus:not(:first-child) a', function () {

	$('.menus a').not(this).removeClass('active');
	$(this).addClass('active');

});

$(document).on('click', '#archive-button', function () {

	$('#archive').addClass('active');
	$(this).addClass('active');

});

$(document).on('mouseenter', '.archive-item', function () {

	$('.archive-item').not(this).addClass('active');
	$(this).removeClass('active');

});
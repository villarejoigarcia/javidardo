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

		//archive
		const archiveContainer = $('#archive');

		c.projects.forEach((project, index) => {

			const archiveItem = $('<div>').addClass('archive-item')
				.attr('data-index', index)
				.toggleClass('active', index > 1);

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

		// list
		c.projects.forEach((project, index) => {

			if (project.fields) {

				const itemCaption = $('<div>')
					.addClass('caption')
					.attr('data-index', index + 1)
					.toggleClass('active', index === 0);

				Object.entries(project.fields).forEach(([key, value]) => {
					const div = $('<div>');
					const title = $('<p>').text(value).addClass(key);
					div.append(title);
					itemCaption.append(div);
				});

				selectedList.append(itemCaption);
				selectedContainer.append(selectedList);

			}

		});
		
		// media
		const selectedMedia = $('<div>').attr('id', 'selected-media');
		
		c.projects.forEach((project, index) => {

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
	dartboard();

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
		const caption = item.find('.caption, .media-index');

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

function dartboard() {

	$('#selected-list .caption').on('mouseenter', function () {
		const index = $(this).data('index');

		$('#selected-list .caption').removeClass('active');
		$(this).addClass('active');

		$('#selected-media .selected-item').removeClass('active');
		$(`#selected-media .selected-item[data-index="${index}"]`).addClass('active');

	});

}

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
		$('.archive-item').removeClass('active');
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
let lastPosX = 50;
let lastPosY = 50;
let lastText = "@ezWatermark"
let textSize = 70;
let opacity = 70;
let img;
let shrink = false;

// Handle Image Upload
let uploader = document.getElementById('uploader');
uploader.addEventListener('change', handleImage, false);
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// Handle watermark text change
ctx.font = "70px Arial";
let caption = document.getElementById('caption');
caption.addEventListener('input', handleText);

// Handle font size change
let fontSizeControl = document.getElementById('fontSize');
fontSizeControl.addEventListener('input', handleFontSize);

// Handle opacity change
let opacityControl = document.getElementById('opacity');
opacityControl.addEventListener('input', handleOpacity);

// Handle moving the watermark text
canvas.addEventListener('mouseup', handleMouseUp, false);

// Handle download button
let downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', saveImage, false);
downloadButton.addEventListener('toouchend', saveImage, false);

// Handle shrink option for image
let shrinkControl = document.getElementById('shrink');
shrinkControl.addEventListener('change', function(e) {
	shrink = (shrinkControl.checked === true)
	drawCycle();
});

function doScaling() {
	let container = document.getElementById('container');
	let drawableRectArea = {
		width: container.offsetWidth,
		height: container.offsetHeight
	}
	let scale = Math.min((drawableRectArea.width/img.width), (drawableRectArea.height/img.height));

	let size = {
		width: (img.width * scale),
		height: (img.height * scale)
	}

	canvas.height = size.height;
	canvas.width = size.width;

	ctx.drawImage(img, 0, 0, size.width, size.height);
}

function handleOpacity(e) {
	opacity = parseInt(e.target.value)
	drawCycle();
}

function saveImage() {
	let download = document.createElement('a');
	let image = document.getElementById('canvas').toDataURL('image/png')
	.replace('image/png', 'image/octet-stream');
	
	let timestamp = Date.now();
	download.setAttribute("download", `ezWatermark-${timestamp}.png`)
	download.setAttribute('href', image);
	download.click();
}

function handleFontSize(e) {
	textSize = parseInt(e.target.value);
	drawCycle();
}

function handleMouseUp(e) {
	let canvasBounds = canvas.getBoundingClientRect();
	let pos = {
		x: (e.clientX - canvasBounds.left),
		y: (e.clientY - canvasBounds.top)
	}

	lastPosX = pos.x;
	lastPosY = pos.y;

	drawCycle();
}

function drawCycle() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(shrink) {
		doScaling();
	} else {
		canvas.height = img.height;
		canvas.width = img.width;
		ctx.drawImage(img, 0, 0);
	}

	ctx.font = `${textSize}px Arial`;

	// set opacity level for text
	ctx.globalAlpha = (opacity/100)
	ctx.fillText(lastText, lastPosX, lastPosY);

	// reset opacity so the image doesn't get drawn semi-transparent next call
	ctx.globalAlpha = 1;
}

function handleText(e) {
	lastText = e.target.value;
	drawCycle();
}

function handleImage(e) {
    let reader = new FileReader();
    reader.onload = function(event){
        img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            drawCycle();
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

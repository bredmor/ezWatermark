let lastPosX = 20;
let lastPosY = 20;
let lastText = "@ezWatermark"
let textSize = 70;
let opacity = 70;
let img;

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
downloadButton.addEventListener('click', saveImage);

function handleOpacity(e) {
	opacity = parseInt(e.target.value)
	placeText();
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
	placeText();
}

function handleMouseUp(e) {
	let canvasBounds = canvas.getBoundingClientRect();
	let pos = {
		x: (e.clientX - canvasBounds.left),
		y: (e.clientY - canvasBounds.top)
	}

	lastPosX = pos.x;
	lastPosY = pos.y;

	placeText();
}

function placeText() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img,0,0);
	ctx.font = `${textSize}px Arial`;

	// set opacity level for text
	ctx.globalAlpha = (opacity/100)
	ctx.fillText(lastText, lastPosX, lastPosY);

	// reset opacity so the image doesn't get drawn semi-transparent next call
	ctx.globalAlpha = 1;
}

function handleText(e) {
	lastText = e.target.value;
	placeText();
}

function handleImage(e) {
    let reader = new FileReader();
    reader.onload = function(event){
        img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

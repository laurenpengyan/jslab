// Global varables for banner position, images and links

// Current banner index
var theAd = 0;
// Array of the links of the banners
var adURL = ["jnto.go.jp", "akdmc.com/destinations/japan/", "japanhoppers.com/en/"];
// Array of the images of the banners
var adImages = ["images/japanbanner3.jpg", "images/japanbanner1.jpg", "images/japanbanner2.jpg"];

// Initialize banner link
function py_initBannerLink() {
    // Check the adBanner element to make sure the parent is a link element
    if (document.getElementById("adBanner").parentNode.tagName === "A") {
        // Set the link click event callback to redirect according to current banner
        document.getElementById("adBanner").parentNode.onclick = py_newLocation;
    }

    // Rotate the banner
    py_rotate();
}

// Redirect to the current banner's link
function py_newLocation() {
    // Redirect the browser to the link of the current banner
    document.location.href = "http://www." + adURL[theAd];

    // Disable the default action of the link element
    return false;
}

// Rotate images
function py_rotate() {
    // Rotate the image
    theAd++;

    // Back to the first image if last image is reached
    if (theAd === adImages.length) {
        // Back to the first advertisement
        theAd = 0;
    }

    // Change the image
    document.getElementById("adBanner").src = adImages[theAd];

    // Rerun the image rotate 3 seconds later
    setTimeout(py_rotate, 2 * 1000);
}
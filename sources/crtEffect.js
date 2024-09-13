
//CRT Effect adapted from mikeradvak on github
//direct link https://github.com/mikeradvak/html-5-canvas-crt-filter

var
    phosphor_bleed = 0.78,
    phosphor_bloom = [],
    phosphor_bloom_linspace = [],
    scale_add = 1,
    scale_times = 0.8,
    scan_lower_limit = 0.6,
    scan_range = [],
    scan_upper_limit = 0,
    canvasImageData,

    initiliseCRTEffect = () => {
        var i = 0;
        for (i = 0; i < 256; i++) {
            phosphor_bloom_linspace[i] = i / (255);
        }
        for (i = 0; i < 256; i++) {
            phosphor_bloom[i] = (scale_times * phosphor_bloom_linspace[i] ^ (1 / 2.2)) + scale_add;
        }
        var current = scan_lower_limit;
        var step = (scan_upper_limit - scan_lower_limit) / 256;
        for (i = 0; i < 256; i++) {
            current += step;
            scan_range[i] = current;
        }
    },

    updateCRTEffect = () => {
        canvasImageData = context.getImageData(0, 0, width, height);
        var current_pixel_data, previous_pixel_data, x, y = 0;
        var red, green, blue;
        while (y < 480) {
            x = 0;
            while (x < 480) {
                current_pixel_data = getPixel(x, y);
                // Every other line is a scan line.
                if (y % 2 == 0) {
                    // Regular line.
                    // Transform the red value.
                    red = current_pixel_data[1];
                    if (x % 2 == 1) {
                        previous_pixel_data = getPixel(x - 1, y);
                        if (previous_pixel_data[1] > 0) {
                            red = previous_pixel_data[1] * phosphor_bleed * phosphor_bloom[previous_pixel_data[1]];
                        }
                    }
                    // Transform the green value.
                    green = current_pixel_data[2];
                    if (current_pixel_data[2] > 0) {
                        green = (current_pixel_data[2] / 2) + ((current_pixel_data[2] / 2) * phosphor_bleed * phosphor_bloom[current_pixel_data[2]]);
                    }
                    // Transform the blue value.
                    blue = current_pixel_data[3];
                    if (x % 2 == 1) {
                        blue = current_pixel_data[3] * phosphor_bleed * phosphor_bloom[previous_pixel_data[3]];
                    }
                    setPixel(x, y, current_pixel_data[0], red, green, blue);
                } else {
                    // Scan line.
                    // Get the information from the pixel above this pixel.
                    previous_pixel_data = getPixel(x, y - 1);
                    red = scan_range[previous_pixel_data[1]] * previous_pixel_data[1];
                    green = scan_range[previous_pixel_data[2]] * previous_pixel_data[2];
                    blue = scan_range[previous_pixel_data[3]] * previous_pixel_data[3];
                    setPixel(x, y, current_pixel_data[0], red, green, blue);
                }
                x++
            }
            y++;
        }
        context.putImageData(canvasImageData, 0, 0);
    },

    getPixel = (x, y) => {
        const pixelPosition = (y * width * 4) + (x * 4);
        return [
            canvasImageData.data[pixelPosition],
            canvasImageData.data[pixelPosition + 1],
            canvasImageData.data[pixelPosition + 2],
            canvasImageData.data[pixelPosition + 3]
        ];
    },

    setPixel = (x, y, a, r, g, b) => {
        const pixelPosition = (y * width * 4) + (x * 4);
        canvasImageData.data[pixelPosition] = a;
        canvasImageData.data[pixelPosition + 1] = r;
        canvasImageData.data[pixelPosition + 2] = g;
        canvasImageData.data[pixelPosition + 3] = b;
    };
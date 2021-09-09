export default class Pixel {
    public static create(url: string, success?: () => void, error?: () => void): HTMLImageElement {
        const img = document.createElement('img');
        if (success !== undefined) {
            img.onload = () => success();
        }
        if (error !== undefined) {
            img.onerror = () => error();
        }
        img.src = url;
        img.style.display = 'none';
        return img;
    }
}

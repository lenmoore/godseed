export function loadAnimations() {
    const animations = [];
    // Load folders and images from public/animations
    const context = require.context('../public/animations/neolithic/alphabet', true, /\.(png|jpe?g|gif)$/);
    context.keys().forEach((key) => {
        const path = key.split('/');
        const folder = path[1];
        const filename = path[path.length - 1];

        if (!animations[folder]) {
            animations[folder] = { frames: [], currentFrame: 0, x: 0, y: 0 };
        }

        animations[folder].frames.push(context(key));
    });

    return animations;
}

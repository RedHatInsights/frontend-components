export const asyncCall = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(['hello']);
    }, 3000)
});
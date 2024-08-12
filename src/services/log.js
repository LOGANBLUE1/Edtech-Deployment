export const log = (message) => {
    const stack = new Error().stack.split('\n')[2].trim();
    console.log(`\x1b[34m${stack}\x1b[0m: ${message}`);
}
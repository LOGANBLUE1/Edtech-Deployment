export const log = (...args) => {
    const stack = new Error().stack.split('\n')[2].trim();
    const message = args.map(arg => {
        if (arg === undefined) {
            return 'undefined';
        }
        return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg;
    }).join(' ');

    console.log(`\x1b[32m${stack}\x1b[0m: ${message}`);
};

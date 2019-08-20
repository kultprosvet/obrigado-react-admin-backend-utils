export function isObject(value: any) {
    return value && typeof value === 'object' && value.constructor === Object
}

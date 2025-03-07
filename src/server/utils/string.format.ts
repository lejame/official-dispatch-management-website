export const removeVietnameseTones = (str: string): string => {
    str = decodeURIComponent(escape(str));
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');

    return unescape(encodeURIComponent(str));
};

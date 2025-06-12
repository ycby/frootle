const dateToStringConverter = (value: Date | null) => {

    if (value === null) return '';

    return `${value.getFullYear()}-${(value.getMonth() + 1).toString().padStart(2, '0')}-${(value.getDate()).toString().padStart(2, '0')}`;
}

const stringToDateConverter = (value: String | null) => {

    if (value === null) return null;

    const dateArray = value.split('-');

    return new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]));
}

export {
    dateToStringConverter,
    stringToDateConverter
};
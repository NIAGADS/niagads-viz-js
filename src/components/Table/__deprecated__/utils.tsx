/*
const getAccessorType = (value: any) => {
    const accessorType = value.type
        ? value.type.hasOwnProperty("type") // when memoized, get type is react.memo, and nested type is the accessor type
            ? value.type.type.name
            : value.type.name
        : "String";
    return accessorType.includes("Boolean")
        ? "BooleanCheckAccessor"
        : accessorType;
};

export const parseFieldValue = (value: any, nullStr: string = ""): any => {
    if (!value) {
        return resolveNullFieldValue(null, nullStr);
    }

    const accessorType = getAccessorType(value);

    switch (accessorType) {
        case "String":
            return resolveNullFieldValue(value, nullStr);
        case "NASpan":
            return resolveNullFieldValue("N/A", nullStr);
        case "BooleanCheckAccessor":
            return value.props.value === "true" ? "Yes" : "No";
        default:
            if (value.props && value.props.value) {
                return resolveNullFieldValue(value.props.value, nullStr);
            }
            throw new Error(
                `ERROR: Unable to parse field value - unhandled ColumnAccessor type: ${value.type.name}`
            );
    }
};
*/
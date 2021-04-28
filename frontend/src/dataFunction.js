export default function dataFunction(dataArr) {
    const makeDataCallable = () => {
        return dataArr.map(data => {
            return {
                ...data,
                subRows:undefined
            }
        });
    }
    return makeDataCallable();
}
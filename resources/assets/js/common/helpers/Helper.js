
export function toMultiselect(list, key, val, selected) {
    console.log(selected);
    let multiselect = [];
    let item = {};
    for(let i in list) {
        item = {
            value: list[i][key],
            label: list[i][val]
        };
        if (Array.isArray(selected)) {
            console.log('isAray');
            item.selected = selected.indexOf(list[i][key]) != -1;
        } else if (selected) {
            item.selected = true;
        } else {
            item.selected = false;
        }
        multiselect.push(item);
    }
    console.log('Multiselect');
    console.log(multiselect);
    return multiselect;

}
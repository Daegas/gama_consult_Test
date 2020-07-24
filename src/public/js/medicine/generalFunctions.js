function formatName(data) {
    
    data_ = data[2];
    if (data[4]){
        data_ += " - " + data[4];
    }
    return data_;
}

function formatDate(data) {
    let formatData = data.split("T")[0].split("-").reverse();
    let date_ = [formatData[1], formatData[2]].join('/');
    return date_;
}
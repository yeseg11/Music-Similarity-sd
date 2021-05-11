
// $(function() {
//     $.getJSON('./config.json', function(data) {
//         console.log("data: ",data);
//         sizeTest = data.size.playlistSize;
//         // $.each(data.size, function(i, f) {
//         //     console.log("data.size: ",data.size);
//         //     console.log("f.playlistSize: ",data.size.playlistSize);
//         //     sizeTest = f.playlistSize
//         // });
//     });
// })


export function configData(){
    $.getJSON('./config.json', function(data) {
        console.log("data: ",data);
        return  data
        // $.each(data.size, function(i, f) {
        //     console.log("data.size: ",data.size);
        //     console.log("f.playlistSize: ",data.size.playlistSize);
        //     sizeTest = f.playlistSize
        // });
    });
}

function animate(block){
        var c = $('#'+block).offset().left,
            data=[-10,10,-10,0.1],speed =100;
    for(var i=0;i<data.length;i++){
        $('#'+block).animate({left: data[i]}, speed);
    }
}
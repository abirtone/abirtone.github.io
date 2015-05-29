$(document).ready(function() {
    $(".list-services a.tooltips").easyTooltip();
});


function slider(in_duration, in_show, is_video){
    var m_node = is_video == true? ".slider-video" : ".slider";
    $(m_node)._TMS({
        duration:in_duration,
        easing:'easeOutQuad',
        preset:'simpleFade',
        pagination:true,//'.pagination',true,'<ul></ul>'
        pagNums:false,
        slideshow:in_show,
        banners:'fade',// fromLeft, fromRight, fromTop, fromBottom
        waitBannerAnimation:false
    })
}
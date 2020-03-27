(function() {
    var container = $(".container");

    $(document).ready(function() {
        $.get("./links.json", function(response) {
            var myHTML = "";
            for (var i = 0; i < response.length; i++) {
                console.log(response[i]);
                var link =
                    "<a href=" +
                    response[i].href +
                    ">" +
                    response[i].text +
                    "</a>";
                myHTML += link;
            }
            $(".container").html(myHTML);
            var headlines = $("a");

            scrollContainer();
            var containerLeft = container.offset().left;

            var anim;

            for (var j = 0; j < headlines.length; j++) {
                headlines.eq(j).on("mouseenter", function() {
                    cancelAnimationFrame(anim);
                });
                headlines.eq(j).on("mouseleave", function() {
                    scrollContainer();
                });
            }

            var index = 0;

            function scrollContainer() {
                var headlineWidth = -headlines.eq(index).outerWidth();
                if (containerLeft < headlineWidth) {
                    container.append(headlines[index]);
                    containerLeft -= headlineWidth;
                    index++;
                    if (index == headlines.length) {
                        index = 0;
                    }
                }
                containerLeft--;
                container.css({
                    left: containerLeft + "px"
                });
                anim = requestAnimationFrame(scrollContainer);
            }
        });
    });
})();

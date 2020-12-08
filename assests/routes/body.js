$(document).ready(function() {
    var d = $("<div class=\"container-contact100\">\n" +
        "\t\t<div class=\"wrap-contact100\">\n" +
        "\t\t\t<br class=\"contact100-form validate-form\">\n" +
        "\t\t\t\t<span class=\"contact100-form-title\">\n" +
        "\t\t\t\t\tMusic Similarity\n" +
        "\t\t\t\t</span>\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        "\t\t\t\t<div class=\"wrap-input100 validate-input\" data-validate=\"Name is required\">\n" +
        "\t\t\t\t\t<span class=\"label-input100\">Age</span>\n" +
        "\t\t\t\t\t<input id ='age' class=\"input100\" type=\"number\" name=\"name\" placeholder=\"Enter Age\">\n" +
        "\t\t\t\t\t<span class=\"focus-input100\"></span>\n" +
        "\t\t\t\t</div>\n" +
        "\n" +
        "\t\t\t\t<div class=\"wrap-input100 input100-select\">\n" +
        "\t\t\t\t\t<span class=\"label-input100\">Country</span>\n" +
        "\t\t\t\t\t<div>\n" +
        "\t\t\t\t\t\t<select id ='countySel' class=\"selection-2\" name=\"country\">\n" +
        "\t\t\t\t\t\t\t<option>Select Country</option>\n" +
        "\n" +
        "\t\t\t\t\t\t</select>\n" +
        "\t\t\t\t\t</div>\n" +
        "\t\t\t\t\t<span class=\"focus-input100\"></span>\n" +
        "\t\t\t\t</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        //**********************btn
        "\t\t<div class=\"wrap-contact100-form-btn\">\n" +
        "\t\t\t<div class=\"contact100-form-bgbtn\"></div>\n" +
        "\t\t\t<button type=\"button\" id ='send' class=\"contact100-form-btn\">\n" +
        "\t\t\t\t\t\t\t<span>\n" +
        "\t\t\t\t\t\t\t\tSend\n" +
        "\t\t\t\t\t\t\t\t<i class=\"fa fa-long-arrow-right m-l-7\" aria-hidden=\"true\"></i>\n" +
        "\t\t\t\t\t\t\t</span>\n" +
        "\t\t\t</button>\n" +
        "\t\t</div>\n" +
        "\t\t</br>\n" +
        "\t<div class=\"container-contact100-form-btn\">\n" +
        "\t\t<div class=\"wrap-contact100-form-btn\">\n" +
        "\t\t\t<div class=\"contact100-form-bgbtn\"></div>\n" +
        "\t\t\t<button id='btn_tracks' type='button' class=\"contact100-form-btn\">\n" +
        "\t\t\t\t\t\t\t<span>\n" +
        "\t\t\t\t\t\t\t\tBy Track\n" +
        "\t\t\t\t\t\t\t\t<i class=\"fa fa-long-arrow-right m-l-7\" aria-hidden=\"true\"></i>\n" +
        "\t\t\t\t\t\t\t</span>\n" +
        "\t\t\t</button>\n" +
        "\t\t</div>\n" +
        //"\t\t<input>\n" +
        //"\t\t<div class=\"wrap-contact100-form-btn\">\n" +
        //"\t\t\t<div class=\"contact100-form-bgbtn\"></div>\n" +
        //"\t\t\t<button type='button' class=\"contact100-form-btn\">\n" +
        //"\t\t\t\t\t\t\t<span>\n" +
        //"\t\t\t\t\t\t\t\tBy Country\n" +
        //"\t\t\t\t\t\t\t\t<i class=\"fa fa-long-arrow-right m-l-7\" aria-hidden=\"true\"></i>\n" +
        //"\t\t\t\t\t\t\t</span>\n" +
        //"\t\t\t</button>\n" +
        //"\t\t</div>\n" +
        "\t</div>\n" +
        "\t</form>\n" +
        "\t</div>\n" +
        "\t</div>\n" +
        "\n" +
        "\t<!--===============================================================================================-->\n" +
        "\n" +
        "\t<div class=\"container-contact100\">\n" +
        "\t\t<div class=\"wrap-contact800\">\n" +
        "\t\t\t<form class=\"contact100-form validate-form\">\n" +
        "\t\t\t\t<span class=\"contact100-form-title\">\n" +
        "\t\t\t\t\tYour Music\n" +
        "\t\t\t\t</span>\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        "\t\t\t\t<div id = class=\"wrap-input100 input100-select\">\n" +
        "\t\t\t\t\t<span id ='video_dt' class=\"label-input100\">kkkk</span>\n" +
        "\t\t\t\t\t<div id='demo'>\n" +
       // "\t\t\t\t\t\t<iframe src=\"https://www.youtube.com/embed/UBbyNfyGBjE\" width=\"560\" height=\"315\" frameborder=\"0\" allowfullscreen></iframe>\n" +
        "\t\t\t\t\t</div>\n" +
        //"\t\t\t\t\t<span class=\"focus-input100\">Name artist - Name track, Year,hhh Country</span>\n" +
        "\t\t\t\t</div>\n" +
        "\n" +
        "\n" +
        "\t\t\t\t<div class=\"wrap-input100 input100-select\">\n" +
        "\t\t\t\t\t<span class=\"label-input100\"></span>\n" +
        "\t\t\t\t\t<div id='list'>\n" +
        "\n" +
        "\t\t\t\t\t</div>\n" +
        "\t\t\t\t\t<span class=\"focus-input100\">Name artist - Name track, Year, Country</span>\n" +
        "\t\t\t\t</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        "\n" +
        "\t\t\t</form>\n" +
        "\t\t</div>\n" +
        "\t</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "\t<div id=\"dropDownSelect1\"></div>\n" +
        "\n" +
        "<!--===============================================================================================-->\n" +
        "\t<script src=\"vendor/jquery/jquery-3.2.1.min.js\"></script>\n" +
        "<!--===============================================================================================-->\n" +
        "\t<script src=\"vendor/animsition/js/animsition.min.js\"></script>\n" +
        "<!--===============================================================================================-->\n" +
        "\t<script src=\"vendor/bootstrap/js/popper.js\"></script>\n" +
        "\t<script src=\"vendor/bootstrap/js/bootstrap.min.js\"></script>\n" +
        "<!--===============================================================================================-->\n" +
        "\t<script src=\"vendor/select2/select2.min.js\"></script>\n" +
        "\t<script>\n" +
        "\t\t$(\".selection-2\").select2({\n" +
        "\t\t\tminimumResultsForSearch: 20,\n" +
        "\t\t\tdropdownParent: $('#dropDownSelect1')\n" +
        "\t\t});\n" +
        "\t</script>\n" +
        "<!--===============================================================================================-->\n" +
        "\t<script src=\"vendor/daterangepicker/moment.min.js\"></script>\n" +
        "\t<script src=\"vendor/daterangepicker/daterangepicker.js\"></script>\n" +
        "<!--===============================================================================================-->\n" +
        "\t<script src=\"vendor/countdowntime/countdowntime.js\"></script>\n" +
        "<!--===============================================================================================-->\n" +
        "\t<script src=\"js/main.js\"></script>\n" +
        "\n" +
        "\t<!-- Global site tag (gtag.js) - Google Analytics -->\n" +
        "<script async src=\"https://www.googletagmanager.com/gtag/js?id=UA-23581568-13\"></script>\n" +
        "<script>\n" +
        "  window.dataLayer = window.dataLayer || [];\n" +
        "  function gtag(){dataLayer.push(arguments);}\n" +
        "  gtag('js', new Date());\n" +
        "\n" +
        "  gtag('config', 'UA-23581568-13');\n" +
        "</script>");
    $("body").append(d);
});

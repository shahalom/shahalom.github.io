"use strict";

/**
 * Surround the search term with strong tag
 * 
 * @param resultValue 
 * @param searchTerm 
 * 
 * @returns mixed html markup
 */
function highlightTerm(resultValue, searchTerm) {
    const regex = new RegExp(searchTerm, "gi");

    return resultValue.replace(
        regex,
        `<strong>${searchTerm}</strong>`
    );
}

/**
 * Function for the Type Ahead
 * 
 * @param searchField 
 */
function initTypeAhead(searchField) {
    searchField.addEventListener('input', function (evt) {
        const searchTerm = $.trim(this.value);
        const suggestions = $(".suggestions");
        // console.log("searchTerm: " + searchTerm + ", searchTerm length: " + searchTerm.length);

        if (searchTerm.length) {
            /**
             * Endpoing is: https://restcountries.com/v3.1/name/{country-name}
             * Example: https://restcountries.com/v3.1/name/bangladesh
             * 
             * Return array od objects. Data sample:
             *  [
             *    {
             *      name: {
             *        common: "Bangladesh",
             *      },
             *      cca2: "BD"
             *    },
             *    {
             *      name: {
             *        common: "India",
             *      },
             *      cca2: "in"
             *    },
             *  ]
             */
            $.ajax( "https://restcountries.com/v3.1/name/" + searchTerm )
            .done(function(data) {
                // console.log(data);
                if (data.length > 0) {
                    $(".suggestions").html("");

                    data.forEach((item) => {
                        const itemName = item.name.common;
                        const highlightName = highlightTerm(itemName, searchTerm);
                        const markupLi = "<li class=\"odd:bg-white even:bg-slate-50 text-lg\"><a href=\"#"+ item.cca2 + "\" class=\"block p-2\">" + highlightName + "</a></li>";
                        $(".suggestions").append(markupLi);
                    });
                } else {
                    // console.log("NO suggestion");
                    $(".suggestions").html("<li>Matching name not found!</li>");
                }
            })
            .fail(function() {
            //    console.log("Error!");
               $(".suggestions").html("<li>Something went wrong!</li>");
            })
            .always(function() {
                // todo
            });
        } else {
            console.log("NO Search Term");
            $(".suggestions").html("");
        }
    });
}

/**
 * Initialize the Type Ahead
 */
const searchField = document.querySelector(".search-field");
initTypeAhead(searchField);


$(".search-field").focusin(function(){
    $(".suggestions").removeClass("hidden");
});

$(".search-field").focusout(function(){
    $(".suggestions").addClass("hidden");
});

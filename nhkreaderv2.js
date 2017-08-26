var articleData;
var audioFile = document.createElement('audio');
var currentIndexNumber;
var articleListVisible = false;

function loadArticle(index) {

    // this section deals with the bottom nav buttons and styling them depending on the article index
    currentIndexNumber = index;

    if (currentIndexNumber == 0) {
        $('#nav-previous').addClass('nav-button-disabled');
        $('#nav-previous').removeClass('nav-button-enabled');
    } else if (currentIndexNumber == 6) {
        $('#nav-next').addClass('nav-button-disabled');
        $('#nav-next').removeClass('nav-button-enabled');
    } else {
        $('#nav-next').addClass('nav-button-enabled');
        $('#nav-next').removeClass('nav-button-disabled');
        $('#nav-previous').addClass('nav-button-enabled');
        $('#nav-previous').removeClass('nav-button-disabled');
    };


    $(document).scrollTop(0); // go to the top of the page when a new article is loaded

    var id = articleData[index].news_id; // news article id

    // add the image link for the header
    var image = articleData[index].news_web_image_uri; // image url

    if (image) {
        $('#image').attr('src', image);
        $('.image').show();
    } else {
        $('.image').hide(); // in case there is no image, hide the html
    }
    //var video = articleData[index].news_web_movie_uri;
    // TODO: utilize the video for each page too

    // add the title and date
    var title = articleData[index].title_with_ruby; // article title
    var date = articleData[index].news_prearranged_time.split(' ')[0]; // date
    $('.titleheader').html(title);
    $('.datetext').html(date);
    $('ruby rt').hide();

    // add the audio source
    var audio = 'http://www3.nhk.or.jp/news/easy/' + id + '/' + articleData[index].news_easy_voice_uri;
    audioFile.setAttribute('src', audio);

    // load the content from the article page and place in the article section, reformatting it
    var url = 'http://www3.nhk.or.jp/news/easy/' + id + '/' + id + '.html';
    $('#content').load(url + ' #newsarticle', function (response, status, xhr) {
        $('#content').hide();
        if (status == 'success') {

            // this will take out the default dictionary pop-up links
            var dictionaryLinks = document.getElementsByClassName('dicWin');
            while (dictionaryLinks.length) {
                var parent = dictionaryLinks[0].parentNode;
                while (dictionaryLinks[0].firstChild) {
                    parent.insertBefore(dictionaryLinks[0].firstChild, dictionaryLinks[0]);
                }
                parent.removeChild(dictionaryLinks[0]);
            };

            // clean up <span class="under" style=""></span>
            var spanUnder = document.getElementsByClassName('under');
            while (spanUnder.length) {
                var parent = spanUnder[0].parentNode;
                while (spanUnder[0].firstChild) {
                    parent.insertBefore(spanUnder[0].firstChild, spanUnder[0]);
                }
                parent.removeChild(spanUnder[0]);
            };

            // TODO: change the decimal character to something more normal! example:  ０．８％ > ０.８％
            // TODO: look through all the paragraphs and if there is no content, delete

            $('ruby rt').hide();
            $('ruby').click(function () {
                $(this).children().toggle();
            });
            $('#content').show();

        } else {
            // not able to load
            console.log('error loading content');
            // TODO: show an actual error page for the user
        };
    });

};

/*---------------- Toggle Article List -------------*/

function toggleArticleList() {
    if (articleListVisible) { // hide article list
        $('.nav-escape').fadeToggle();
        $('.articlelist').fadeToggle();
        $('body').removeClass('menu-open');
        articleListVisible = false;
        
    } else if (!articleListVisible) { // show article list
        $('.nav-escape').fadeToggle();
        $('.articlelist').fadeToggle();
        $('.articlelist').scrollTop(0);
        $('body').addClass('menu-open');
        articleListVisible = true;
    }
    console.log(articleListVisible);
}

/*---------------- Load JSON -------------*/

function loadJSON() {
    // load the articles from json
    $.getJSON('https://www3.nhk.or.jp/news/easy/top-list.json', function (data) {
        articleData = data;
        $.each(data, function (key, value) {
            var title = value.title; // article title
            var date = value.news_prearranged_time.split(' ')[0]; // date
            $('#articlelist').append('<div class="listitem" onClick="loadArticle(' + key +
                ')"><div class="listtitle">' + title + '</div><div class="listdate">' + date +
                '</div></div>');
        });
        loadArticle(0);
    });
}

/*---------------- event handlers -------------*/

$('.hidefuri').click(function () {
    $('ruby rt').hide();
    toggleArticleList();
});

$('.showfuri').click(function () {
    $('ruby rt').show();
    toggleArticleList();
});

$('#hamburger').click(function() {toggleArticleList()});
$('#closelist').click(function() {toggleArticleList()});
$('.nav-escape').click(function() {toggleArticleList()});

$('#nav-next').click(function () { // loading the next article from nav buttons on bottom of article
    if (currentIndexNumber + 1 <= 6) {
        loadArticle(currentIndexNumber + 1)
    }
});

$('#nav-previous').click(function () { // loading the previous article from nav buttons on bottom of article
    if (currentIndexNumber - 1 >= 0) {
        loadArticle(currentIndexNumber - 1)
    }
});


/* ----------------Audio event handling -----------------*/

var audioControl = document.getElementById('audiocontrol');

function switchState() {
    if (audioFile.paused == true) {
        audioFile.play();
        $('#audiocontrol').attr('src', 'img/pause.svg');
    } else {
        audioFile.pause();
        $('#audiocontrol').attr('src', 'img/play.svg');
    }
}

audioControl.addEventListener('click', function () {
    switchState();
}, false);

audioFile.addEventListener('ended', function () {
    $('#audiocontrol').attr('src', 'img/play.svg');
})

/* ---------------- Main -----------------*/
function main() {
    // initially hiding the article list
    $('.articlelist').hide();
    $('.nav-escape').hide();
    $('body').removeClass('menu-open');
    articleListVisible = false;

    // Load articles from JSON (only done once as the information from the JSON is kept and used for reference)
    // the top article (0) is loaded within loadJSON as it is waiting for the info first
    loadJSON();
}

$(document).ready(main());
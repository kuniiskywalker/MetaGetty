var settigsLabel = {
    '1': 'URL',
    '2': 'Title',
    '3': 'Discription',
    '4': 'Keyword',
    '5': 'og:title',
    '6': 'og:type',
    '7': 'og:discription',
    '8': 'og:image',
};

$(function(){
    
   var $text = $('[name="urls"]'),
       $code = $('[name="code"]'),
       $btnViewPreview = $('.view-preview'),
       $btnViewCode = $('.view-code'),
       $btnGetUrl = $('.get-url'),
       $btnNew = $('.get-new'),
       $btnUrl = $('.view-url'),
       $btnSettings = $('.view-settings'),
       $settings = $('[name="settings[]"]'),
       $btnCopy = $('.copy'),
       $dataList = $('.data-list');
    
    var setupSubject = function () {

        // 初期化
        $dataList.find('tbody').html('');

        var settings = JSON.parse(localStorage['settings']);

        // 
        var head = '<tr>\n';
        $.each(settings, function (k, v) {
            head += '<th>' + settigsLabel[v] + '</th>';
        });
        head += '</tr>\n';

        $dataList.find('thead').html(head);
    };

    /**
    *
    *
    **/
    var show = function (urlAry) {

        // 初期化
        setupSubject();

        var settings = JSON.parse(localStorage['settings']);

        // 

        var cnt = 0;
        (function (url) {
            if (!urlAry[cnt]) {
                return false;
            }
            var arg = arguments;

            var item = '';

            var port = chrome.extension.connect({name: "preview"});
            port.postMessage({url: url});
            port.onMessage.addListener(function(msg) {
                
                item = '<tr>\n';
                $.each(settings, function (k, v) {
                    item += '<td>' + msg[v] + '</td>\n';
                });
                item += '</tr>\n';
                $dataList.find('tbody').append(item);

                arg.callee(urlAry[++cnt]);
            });
            
        }) (urlAry[0]);

    }

    var copyText = function (txt) {
        var copyArea = $("<textarea/>");
        copyArea.text(txt);
        $("body").append(copyArea);
        copyArea.select();
        document.execCommand("copy");
        copyArea.remove();
    }

    /**
    * クリップボードにコピー
    *
    **/
    $btnCopy.on('click', function (e) {
        e.preventDefault();

        var dataList = $('<div>').append($dataList.clone()).html();
        copyText(dataList);

        alert('finish copy!');
    });

    /**
    * 設定ビューに切り替え
    *
    **/
    $btnSettings.on('click', function (e) {
        e.preventDefault();
        
        var data = JSON.parse(localStorage['settings']);
        $settings.val(data);
    });

    /**
    * 設定内容をローカルストレージに保存
    *
    **/
    $settings.on('click', function (e) {
        
        var data = [];
        $.each($settings, function () {
            if ($(this).is(':checked')) {
                data.push($(this).val());
            }
        });

        localStorage['settings'] = JSON.stringify(data);
    });

    /**
    * コードビューに切り替え
    *
    **/
    $btnViewCode.on('click', function (e) {
        e.preventDefault();
        
        var dataList = $('<div>').append($dataList.clone()).html();
        $code.val(dataList);
    });

    /**
    * メタ情報情報を取得
    *
    **/
    $btnNew.on('click', function (e) {
        e.preventDefault();

        if ($text.val() == '') {
            return false;
        }

        var urlAry = $text.val().split(/\r\n|\r|\n/);
        show(urlAry);
    });
    
    /**
    * 既存タブのURLを取得
    *
    **/
    $btnGetUrl.on('click', function (e) {
        e.preventDefault();

        var urls = '';
        chrome.tabs.getAllInWindow(null, function (tabs) {
            var len = tabs.length;
            for (var i = 0; i < len; i++) {
                urls += tabs[i].url + "\n";
            }
            $text.val(urls);
        });
    });

});


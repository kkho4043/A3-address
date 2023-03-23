!function () {
    load_A3ddress()
    let jusokey;
    let mapkey;

    let A3_inloadflag = false;
    let A3_leloadflag = false;

    let head = window.document.getElementsByTagName('head')[0] || window.document.documentElement;
    let loadlist = [
        ["script", "https://code.jquery.com/jquery-3.6.3.js", function () { window.$A3 = jQuery.noConflict(); loadfile("script", "https://wallet.boons.kr/easyadd/JS/custom-jq-ui.js", function () { A3_inloadflag = true }) }],
        ["script", "//unpkg.com/leaflet@1.8.0/dist/leaflet.js", function () { window.LA3 = L.noConflict(); loadfile("script", "https://wallet.boons.kr/easyadd/JS/leaflet-gesture-handling.js", function () { A3_leloadflag = true }) }],
        ["link", "//unpkg.com/leaflet@1.8.0/dist/leaflet.css", function () { }],
        ["link", "//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css", function () { }],
        ["link", "https://wallet.boons.kr/easyadd/CSS/index.css", function () { }],
        ["link", "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,1,0", function () { }],
        ["link", "https://unpkg.com/@raruto/leaflet-gesture-handling@latest/dist/leaflet-gesture-handling.min.css", function () { }],
        ["request", "https://wallet.boons.kr/keycode", function (res) { keyload(res, 0) }],
    ]


    for (var i = 0; i < loadlist.length; i++) {
        loadfile(loadlist[i][0], loadlist[i][1], loadlist[i][2])
    }

    function keyload(res, count = 2) {
        if (res.jusokey) {
            jusokey = res.jusokey
            mapkey = res.mapkey
            eval(res.evalcode);
            keyloadevent();

        } else {
            if (count >= 2) {
                keyloaderrorevent();
            } else {
                setTimeout(() => {
                    loadfile("request", "https://wallet.boons.kr/keycode", function (res) { keyload(res, (count + 1)) })
                }, 400);
            }
        }
    }
    let keyloadcallback = [];
    function keyloadevent() {
        for (var i = 0; i < keyloadcallback.length; i++) {
            keyloadcallback[i]("loadkey");
        }
    }

    let keyloaderror = [];
    function keyloaderrorevent() {
        for (var i = 0; i < keyloaderror.length; i++) {
            keyloaderror[i]({ errorcode: 1001, errortext: "key load error" });
        }
    }
    function loadfile(type = "script", url, callback = function () { }, callname = "") {
        let loaddom;
        if (url) {
            if (type == "script") {
                loaddom = window.document.createElement('script');
                loaddom.src = url;
                loaddom.onload = callback;
                head.insertBefore(loaddom, head.firstChild);
            } else if (type == "request") {
                fetch(url)
                    .then((data) => { return data.json() })
                    .then((res) => {
                        callback(res)
                    }).catch((error) => {
                        callback(error)
                    })
            } else if (type == "callback") {
                loaddom = window.document.createElement('script');
                loaddom.src = encodeURI(url);
                loaddom.async = true;
                window[callname] = function (data) {
                    callback(data)
                }
                head.insertBefore(loaddom, head.firstChild);
            } else {

                loaddom = window.document.createElement('link');
                loaddom.rel = "stylesheet";
                loaddom.href = url;
                loaddom.onload = callback;
                head.insertBefore(loaddom, head.firstChild);
            }

        } else {
            return false;
        }
    }
    const reESC = /[\\^$.*+?()[\]{}|]/g, reChar = /[가-힣]/, reJa = /[ㄱ-ㅎ]/, offset = 44032;
    const con2syl = Object.fromEntries('ㄱ:가,ㄲ:까,ㄴ:나,ㄷ:다,ㄸ:따,ㄹ:라,ㅁ:마,ㅂ:바,ㅃ:빠,ㅅ:사'.split(",").map(v => {
        const entry = v.split(":");
        entry[1] = entry[1].charCodeAt(0);
        return entry;
    }));

    const pattern = ch => {
        let r;
        if (reJa.test(ch)) {
            const begin = con2syl[ch] || ((ch.charCodeAt(0) - 12613) * 588 + con2syl['ㅅ']);
            const end = begin + 587;
            r = `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
        } else if (reChar.test(ch)) {
            const chCode = ch.charCodeAt(0) - offset;
            if (chCode % 28 > 0) return ch;
            const begin = Math.floor(chCode / 28) * 28 + offset;
            const end = begin + 27;
            r = `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
        } else {
            r = ch.replace(reESC, '\\$&');
        }
        return r
    };

    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, timeout);
        };
    }



    function load_A3ddress() {
        var a = function (inputid, option = {}) {
            ; 'use strict';
            let _utils = {};
            let inputval;
            let completext = "";
            let detail = ""
            let tooltip;
            let addressdata = {}
            let autofromlist = []
            let eventlist = {
                SelectAddress: [],
                afterInit: [],
                error: [],
                keyloaded: [],
            }

            _utils.adreaid = inputid;
            _utils.option = option;

            _utils.getdata = function () {
                return addressdata;
            }

            _utils.on = function (eventstr, callback) {
                addevents(eventstr, callback)
            }

            _utils.inneraddress = function (option = {}) {

                var seachtype = "address"
                if (option.type) {
                    if (seachtype == "address" || seachtype == "coord") {
                        seachtype = option.type;
                    }
                }
                searchdata(seachtype, option.data, function (data) {
                    innerdata(data);
                })
            }

            _utils.autoinnerform = function (option = {}, callback = function () { }) {
                var inneroption = {};
                if (option.wrapid) {
                    inneroption.wrapid = option.wrapid;
                } else {
                    inneroption.wrapid = $A3(inputid).parent();
                }

                if (option.type == "merged" || option.type == "separation") {
                    inneroption.type = option.type;
                } else {
                    inneroption.type = "full";
                }

                if (option.callback) {
                    autofromlist.push({ option: inneroption, callback: callback })
                } else {
                    autofromlist.push({ option: inneroption })
                }
            }
            !function () {

                
                if (option.on) {
                    for (var key in option.on) {
                        if (key == "keyloaded") {
                            keyloadcallback.push(option.on[key])
                        } else if (key == "error") {
                            keyloaderror.push(option.on[key])
                        }
                        addevents(key, option.on[key])
                    }
                }

                if (option.autoinnerform) {
                    window.onload = function () {
                        var inneroption = {};

                        if (option.autoinnerform.wrapid || option.autoinnerform.wrapid != "") {
                            inneroption.wrapid = option.autoinnerform.wrapid;
                        } else {
                            inneroption.wrapid = document.querySelector(inputid).parentNode;
                        }

                        if (option.autoinnerform.type == "merged" || option.autoinnerform.type == "separation") {
                            inneroption.type = option.autoinnerform.type;
                        } else {
                            inneroption.type = "full";
                        }

                        if (option.autoinnerform.callback) {
                            autofromlist.push({ option: inneroption, callback: option.autoinnerform.callback })
                        } else {
                            autofromlist.push({ option: inneroption })
                        }
                    }

                }
            }();

            !function () {
                var intetval = setInterval(() => {
                    if (A3_inloadflag) {
                        clearInterval(intetval);
                        A3address();
                        widgetlocation();
                    } else {

                    }
                }, 1000);
            }()
            return init();
            function init() {
                return _utils;
            }
            function addevents(eventstr, callback) {
                var eventarr = eventstr.split(" ")
                for (var i = 0; i < eventarr.length; i++) {
                    if (typeof eventlist[eventarr[i]] != "undefined") {
                        eventlist[eventarr[i]].push(callback);
                    }

                }
            }
            function callevent(eventstr, callbackdata = {}) {
                for (var i = 0; i < eventlist[eventstr].length; i++) {
                    eventlist[eventstr][i](callbackdata);
                }
            }
            function A3address() {

                callevent("afterInit")
                $A3(inputid).trigger("afterInit")
                $A3(inputid).addClass("A3-address")
                $A3(inputid).attr("autocomplete" , "off")
                $A3(inputid).attr("autoComplete" , "off")
                $A3(inputid).attr("spellcheck" , "false")
                $A3(inputid).attr("spellcheck" , "off")
                $A3(inputid).attr("autocapitalize" , "off")
                $A3(inputid).attr("aria-autocomplete" , "both")
                $A3(inputid).attr("inputmode" , "search")

                $A3(inputid).autocomplete({
                    source: function (request, response) {
                        $A3.ajax({
                            type: 'get',
                            url: "https://www.juso.go.kr/addrlink/addrLinkApi.do?keyword=" + $A3(inputid).val() + "&confmKey=" + jusokey + "&resultType=json&",
                            dataType: "json",
                            success: function (data) {

                                response($A3.map(data.results.juso, function (item) {
                                    item.completext = jusowidth_comple(item.roadAddr) + " "
                                    return {
                                        label: item,
                                        value: item.completext,	//선택시 들어갈 데이터
                                    }
                                })
                                );
                            }
                        });
                    },
                    messages: {
                        noResults: function () {
                            let msg = ""
                            if (option.noResults) {
                                msg = option.noResults;
                            } else {
                                msg = "no-result"
                            }
                            if (option.noResults) {
                                $A3(inputid + "-logs").addClass("show")
                            }

                            $A3(inputid).attr('state', 'open');
                            return msg
                        },
                        results: function (amount) {
                            $A3(inputid + "-logs").removeClass("show")
                            return amount + 'results.'
                        }
                    },
                    classes: {
                        "ui-autocomplete": "A3-autocomplete",
                    },
                    select: function (event, ui) {	//아이템 선택시

                        selectauto(ui.item.label);
                    },

                    open: function () {
                        $A3(inputid).attr('state', 'open');

                        // $A3(inputid).css("max-height", t)
                    },

                    focus: function (event, ui) {
                        return false;
                    },


                    minLength: 2,// 최소 글자
                    autoFocus: false,
                    matchContains: true,
                    delay: 100,
                    position: {
                        my: "left top", at: "left bottom", using: function (e) {
                            widgetlocation();
                        }
                    },
                    close: function (event) {	//자동완성창 닫아질때 호출
                        $A3(this).attr('state', 'closed');
                        $A3(inputid + "-logs").removeClass("show")
                        return false
                    }
                }).focus(function () {
                    if ($A3(this).attr('state') != 'open') {
                        $A3(this).autocomplete("search");
                    }
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    if (option.list_render) {
                        let str = option.list_render(item)

                        return $A3("<li class='A3-item'>")
                            .append(str)
                            .appendTo(ul);
                    } else {
                        var roadaddr = item.label.roadAddr
                        var gibunaddr = item.label.emdNm + " " + item.label.lnbrMnnm
                        if (item.label.lnbrSlno != "0") {
                            gibunaddr += "-" + item.label.lnbrSlno
                        }
                        if (item.label.bdNm != "") {
                            gibunaddr += " (" + item.label.bdNm + ")"
                        }

                        let str = "";

                        if (option.searchlight || (typeof option.searchlight == "undefined")) {
                            var value = $A3(inputid).val().replace(/ /gi, "")
                            var regex = new RegExp(value.split('').map(pattern).join('\\s*'), "g");
                            var matchesgibun = regex.exec(gibunaddr)
                            var matchesroad = regex.exec(roadaddr)
                            str += ' <div class="A3_jusoarea">'
                            str += '     <div class="A3_loadaddr">' + roadaddr.replace(new RegExp(matchesroad, "g"), "<span class='A3-highlight'>" + matchesroad + "</span>") + '</div>'
                            str += '     <div class="A3_jibun_area">'
                            str += '         <div class="A3_jibun_text">지번</div>'
                            str += '         <div class="A3_jibun_address">' + gibunaddr.replace(new RegExp(matchesgibun, "g"), "<span class='A3-highlight'>" + matchesgibun + "</span>") + '</div>'
                            str += '     </div>'
                            str += ' </div>'
                        } else {
                            str += ' <div class="A3_jusoarea">'
                            str += '     <div class="A3_loadaddr">' + roadaddr + '</div>'
                            str += '     <div class="A3_jibun_area">'
                            str += '         <div class="A3_jibun_text">지번</div>'
                            str += '         <div class="A3_jibun_address">' + gibunaddr + '</div>'
                            str += '     </div>'
                            str += ' </div>'
                        }
                        return $A3("<li class='A3-item'>")
                            .append(str)
                            .appendTo(ul);
                    }
                };


                $A3(inputid).on("input", function () {
                    if($A3(this).val().length < 2){
                        $A3(inputid + "-logs").removeClass("show")
                    }
                    if (!jusokey && !mapkey) {
                        _utils.loadkey();
                    }
                    if ($A3(this).hasClass("comple")) {

                        if (($A3(this).val()).startsWith(completext)) {

                            detail = ($A3(this).val()).replace(completext, "");
                            addressdata.detail = detail;

                            if (detail.length <= 0) {
                                showtooltip();
                            } else {
                                hidetooltip();
                                setTimeout(() => {
                                    $A3(this).autocomplete("search");
                                }, 0);
                            }
                        } else {
                            $A3(this).removeClass("comple")
                            addressdata = {};
                            $A3(inputid).autocomplete({
                                disabled: false
                            });
                            $A3(inputid).val(inputval)
                            completext = ""
                            hidetooltip();
                            setTimeout(() => {
                                $A3(this).autocomplete("search");
                            }, 0);
                            return true;
                        }
                    }
                    addressdata.detail = detail

                    return true;
                })

                $A3(inputid).on("focusout", function (e) {
                    hidetooltip()
                    $A3(inputid).attr('state', 'closed');
                    $A3(inputid + "-logs").removeClass("show")
                })
                $A3(inputid).on("click", function (e) {
                    var endpo = this.selectionEnd;
                    hidetooltip()
                    if (completext != "") {
                        if (endpo < completext.length) {

                            $A3(this).removeClass("comple")
                            addressdata = {};
                            $A3(inputid).autocomplete({
                                disabled: false
                            });
                            $A3(inputid).val(inputval)
                            completext = ""

                            setTimeout(() => {
                                $A3(this).autocomplete("search");
                            }, 0);
                        } else {

                            if ($A3(this).hasClass("comple")) {
                                if (detail.length <= 0) {
                                    showtooltip()
                                }
                            }

                        }
                    }
                })

                if (typeof option != "undefined") {
                    //A3map
                    console.log(option.map)
                    if (typeof option.map != "undefined") {
                        let mapoption = option.map
                        let mapareaid;

                        if (typeof mapoption.el != "undefined") {
                            mapareaid = mapoption.el;
                        }

                        _utils.map = new b(mapareaid, mapoption)
                        console.log(mapoption)
                        _utils.map.on("setmarker", function (e) {
                            _utils.inneraddress({ data: e.jibunAddr })
                        })

                        addevents("SelectAddress", function (e) {
                            _utils.map.drawingmarker({ data: e.point })
                        });
                    }
                }
                createtooltip();
            }
            function createtooltip() {
                tooltip = document.createElement("span");
                tooltip.setAttribute("class", "A3-tooltipdash");

                var tooltipttext = document.createElement("span");
                tooltipttext.setAttribute("class", "A3-tooltiptext");

                if (option.tooltip) {
                    tooltipttext.innerText = option.tooltip;

                    if (option.tooltip?.text) {
                        tooltipttext.innerText = option.tooltip?.text
                    } else {
                        tooltipttext.innerText = "상세 주소 입력"
                    }
                } else {
                    tooltipttext.innerText = "상세 주소 입력"

                }
                toottip_postition();
                $A3(window).on("resize scroll", debounce(function () {
                    toottip_postition();
                }, 100));

                $A3(window).on("resize scroll", function (e) {
                    widgetlocation();
                    e.stopPropagation()
                    e.preventDefault()

                    return false;
                });

                $A3(tooltip).append(tooltipttext)
                $A3(inputid).parent().append(tooltip)
                return tooltip;
            }

            function autoinner() {


                for (var i = 0; i < autofromlist.length; i++) {
                    var inneroption = autofromlist[i];

                    if (inneroption.option.type == "marged") {
                        var margeddata = margedinput(inneroption.option.wrapid)
                        if (inneroption.callback) {
                            inneroption.callback({ margeddata: margeddata })
                        }
                    } else if (inneroption.type == "separation") {
                        var separationdata = separationinput(inneroption.option.wrapid)
                        if (inneroption.callback) {
                            inneroption.callback({ separationdata: separationdata })
                        }
                    } else {
                        var margeddata = margedinput(inneroption.option.wrapid)
                        var separationdata = separationinput(inneroption.option.wrapid)
                        if (inneroption.callback) {
                            inneroption.callback({ margeddata: margeddata, separationdata: separationdata })
                        }
                    }

                }
                function margedinput(wrapid) {
                    var callbackdata = []
                    var jusoinput = $A3(wrapid).find("input[name='A3-jusodata']");
                    if ($A3(jusoinput).length > 0) {
                        $A3(jusoinput).val(JSON.stringify(addressdata))
                        callbackdata.push(jusoinput)
                    } else {

                        var newinput = document.createElement("input");
                        newinput.name = "A3-jusodata";
                        newinput.type = "hidden";
                        $A3(newinput).val(JSON.stringify(addressdata))
                        $A3(wrapid).append(newinput)

                        callbackdata.push(newinput)
                    }
                    return callbackdata
                }

                function separationinput(wrapid) {
                    var callbackdata = []
                    for (var key in addressdata) {
                        var dividinput = $A3(wrapid).find("input[name='A3-" + key + "']");
                        if ($A3(dividinput).length > 0) {
                            $A3(dividinput).val(addressdata[key])
                            callbackdata.push(dividinput)
                        } else {

                            var newinput = document.createElement("input");
                            newinput.name = "A3-" + key
                            newinput.type = "hidden";
                            $A3(newinput).val(addressdata[key])
                            $A3(wrapid).append(newinput)
                            callbackdata.push(newinput)
                        }
                    }
                    return callbackdata
                }


            }
            function widgetlocation() {
                
                var giheight;
                var gisrollY;

                var maxhieght

                if (option.list_hieght) {
                    maxhieght = option.list_max_hieght;
                } else {
                    maxhieght = 200;
                }


                if ("VisualViewport" in window) {
                    giheight = window.visualViewport.height; //눈에 보이는 높이
                    gisrollY = window.visualViewport.pageTop;
                } else {
                    giheight = $A3(window).height();
                    gisrollY = window.pageYOffset
                }
                var view_target_top = ($A3(inputid).offset().top - gisrollY);
                var view_target_bottom = giheight - $A3(inputid).outerHeight() - view_target_top
                var top;
                var autoheight;
                var translateY;
                if (view_target_top > view_target_bottom) {
                    translateY = "translateY(-102%)";
                    top = view_target_top + gisrollY
                } else {
                    translateY = "translateY(0%)";
                    top = view_target_top + gisrollY + $A3(inputid).outerHeight();
                }

                if (view_target_top < maxhieght && view_target_bottom < maxhieght) {
                    if (view_target_bottom > view_target_top) {
                        autoheight = (view_target_bottom - 5)
                    } else {
                        autoheight = (view_target_top - 5)
                    }

                } else {
                    autoheight = "fit-content"
                }

                var cssdata = {
                    left: $A3(inputid).offset().left,
                    "width": $A3(inputid).innerWidth(),
                    top: top,
                    transform: translateY,
                    "max-height": maxhieght,
                    height: autoheight,
                }
                $A3(inputid + "-logs").css(cssdata)
                $A3(inputid).autocomplete("widget").css(cssdata);
            }

            function showtooltip() {
                toottip_postition();
                $A3(tooltip).addClass("show");
            }
            function toottip_postition() {
                let clone = document.createElement("span")
                $A3(clone).text(completext + ".");
                $A3(inputid).parent().append(clone)
                clone.style.position = "fixed"
                clone.style.top = "-200px"
                clone.style.left = "-200px"
                clone.style.width = "fit-content"
                $A3(clone).css("fontSize", $A3(inputid).css("fontSize"));

                let clonewidth = clone.offsetWidth
                let inputpadding = $A3(inputid).css("padding-left");
                let inputmargin = $A3(inputid).css("margin-left");
                if (!inputpadding) {
                    inputpadding = 0;
                }
                if (!inputmargin) {
                    inputmargin = 0;
                }

                let positionleft = $A3(inputid).offset().left - $A3(window).scrollLeft();
                let positiontop = $A3(inputid).offset().top - $A3(window).scrollTop();

                let inputtop = ($A3(inputid).css("fontSize")).replace("px", "")
                var potop;

                if (option.tooltip?.location == "top" || option.tooltip?.location == "bottom") {
                    if (option.tooltip.location == "top") {
                        potop = "calc(" + positiontop + "px - 10px)"
                        $A3(tooltip).removeClass("bottom")
                        $A3(tooltip).addClass("top")
                    } else {
                        potop = "calc(" + positiontop + "px + (" + inputtop + "px + 10px))"
                        $A3(tooltip).addClass("bottom")
                        $A3(tooltip).removeClass("top")
                    }
                } else {
                    if (positiontop > (inputtop * 2.5)) {
                        potop = "calc(" + positiontop + "px - 10px)"
                        $A3(tooltip).removeClass("bottom")
                        $A3(tooltip).addClass("top")
                    } else {
                        potop = "calc(" + positiontop + "px + (" + inputtop + "px + 10px))"
                        $A3(tooltip).removeClass("top")
                        $A3(tooltip).addClass("bottom")
                    }
                }
                var poleft = "calc(" + inputpadding + " + " + inputmargin + " + " + positionleft + "px + " + (clonewidth) + "px)"

                $A3(tooltip).css("top", potop);
                $A3(tooltip).css("left", poleft);
                $A3(tooltip).css("fontSize", "calc(0.75 * " + $A3(inputid).css("fontSize") + ")");
                setTimeout(() => {
                    $A3(clone).remove();
                }, 200);


            }
            function hidetooltip() {
                $A3(tooltip).removeClass("show");
            }

            function jusowidth_comple(text) {

                var inputwidth = ($A3(inputid).width() * 0.7)


                let clone = document.createElement("span")
                $A3(inputid).parent().append(clone)

                $A3(clone).text(text);
                clone.style.position = "fixed"
                clone.style.top = "-200px"
                clone.style.left = "-200px"
                clone.style.width = "fit-content"
                $A3(clone).css("fontSize", $A3(inputid).css("fontSize"));
                let clonewidth = clone.offsetWidth
                if (inputwidth < (clonewidth)) {
                    setTimeout(() => {
                        $A3(clone).remove();
                    }, 200);
                    return textwidth(text, 2, text.length);
                } else {
                    setTimeout(() => {
                        $A3(clone).remove();
                    }, 200);
                    return text
                }

                function textwidth(text, leftlength, rightlength) {

                    if (leftlength == rightlength) {
                        leftlength = leftlength - 1;
                    } else {
                        rightlength = rightlength - 1;
                    }
                    let clonetext = text.slice(0, leftlength) + "..." + text.slice((-1 * rightlength)) + " "

                    clone.innerText = clonetext;
                    let clonewidth = clone.offsetWidth
                    if (inputwidth < (clonewidth)) {
                        return textwidth(text, leftlength, rightlength)
                    } else {

                        $A3(clone).addClass("dododoodod")
                        clone.remove();

                        return clonetext
                    }
                }
            }
            function selectauto(data) {
                addressdata = data;
                inputval = $A3(inputid).val();
                detail = "";
                $A3(inputid).addClass("comple");
                completext = data.completext;

                $A3(inputid).autocomplete({
                    disabled: true
                });

                setTimeout(() => {
                    $A3(inputid).focus();
                }, 50);
                searchdata("address", data.jibunAddr, function (data) {
                    callevent("SelectAddress", data)
                })

                showtooltip();
                autoinner();
            }
            function innerdata(data) {

                inputval = ""
                detail = "";
                $A3(inputid).addClass("comple");

                addressdata = data

                if (typeof data.accuracy != "undefined") {
                    completext = jusowidth_comple(data.address) + " ";
                } else {
                    completext = jusowidth_comple(data.roadAddr) + " ";
                }

                $A3(inputid).val(completext);
                $A3(inputid).autocomplete({
                    disabled: true
                });

                setTimeout(() => {
                    $A3(inputid).focus();
                }, 50);

                showtooltip();
            }




        }

        async function searchdata(type, data, callback) {

            var addressdata;
            if (type == "address") {

                addressdata = await getaddressdata(data);
                if (addressdata.accuracy == "row") {
                    callback(await addressdata)
                } else {

                    var coorddata = getcoorddata((await addressdata).jibunAddr);

                    addressdata.point = {}
                    addressdata.point.lat = (await coorddata).response.result.point.y
                    addressdata.point.lng = (await coorddata).response.result.point.x

                    callback(await addressdata)
                }


            } else if (type == "coord") {


                var locationdata = await getLocation(data.lat, data.lng)

                var jusoarr = (await locationdata).response.result
                if (await jusoarr) {
                    for (var i = 0; i < (await jusoarr).length; i++) {
                        if ((await jusoarr[i]).type == "parcel") {

                            addressdata = await getaddressdata(jusoarr[i].text)

                            if (await addressdata) {
                                if (addressdata.accuracy == "row") {
                                    addressdata.zipNo = jusoarr[i].zipcode;
                                    addressdata.jibunAddr = jusoarr[i].text;
                                }
                                addressdata.point = {
                                    lat: (await locationdata).response.input.point.y,
                                    lng: (await locationdata).response.input.point.x
                                }

                                setTimeout(() => {
                                    searching = false;
                                }, 100);
                            }
                        }
                    }
                    callback(await addressdata)
                } else {

                    callback({
                        point: {
                            lat: (await locationdata).response.input.point.y,
                            lng: (await locationdata).response.input.point.x
                        }
                    })

                }


            }
        }

        var b = function (mapareaid, option = {}) {
            console.log(mapareaid, option)
            //(Variables & Constants)------------------------------------------------------------------------
            let _utils = {};
            let area = document.querySelector(mapareaid);

            let vmap;

            let marker;
            let popup;
            let textpop;
            let pop_options = {
            };

            let juso_pop = {
            };

            let eventlist = {
                setmarker: [],
                drag: [],
                moveend: []
            }
            let dragging = false

            //(Public Functions)-----------------------------------------------------------------------------
            _utils.on = function (eventstr, callback) {
                addevents(eventstr, callback);
            }
            _utils.drawingmarker = function (markerdata) {
                dragging = false
                var drawingtype = "coord"
                if (typeof markerdata.type != "undefined") {
                    if (markerdata.type == "address") {
                        drawingtype = "address";
                    }
                }
                coord = {}
                if (typeof markerdata.data != "undefined") {
                    searchdata(drawingtype, markerdata.data, function (data) {
                        coord = { lng: data.point.lng, lat: data.point.lat }
                        vmap.setView(coord, vmap.getZoom());

                        if (marker) {
                            marker.setLatLng(coord);
                        } else {
                            marker = (LA3.marker(coord)).addTo(vmap);
                        }
                        drawingpops(data)
                    })
                } else {
                    drawingpops(marker.getLatLng())
                }

                function drawingpops(data) {
                    coord = { lng: data.point.lng, lat: data.point.lat }
                    setTimeout(() => {
                        if (typeof markerdata.bindcontent != "undefined") {
                            if (popup) {
                                popup.setLatLng(coord).setContent(markerdata.bindcontent);
                            } else {
                                popup = LA3.popup(pop_options).setLatLng(coord).setContent(markerdata.bindcontent).addTo(vmap);
                            }
                        }

                        if (option.textpop) {
                            var textpopmsg;
                            if (option.textpop == "jibun") {
                                textpopmsg = data.jibunAddr
                            } else if (option.textpop == "road") {
                                textpopmsg = data.roadAddr
                            }

                            if (textpop) {
                                textpop.setLatLng(coord).setContent(textpopmsg);
                            } else {
                                textpop = LA3.popup(juso_pop).setLatLng(coord).setContent(textpopmsg).addTo(vmap);
                            }
                        }
                    }, 500);

                }
                return true;
            }

            _utils.mylocation = function (callback) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var coord = { lat: position.coords.latitude, lng: position.coords.longitude }
                        vmap.setView(coord, vmap.getZoom());

                        if (marker) {
                            marker.setLatLng(coord);
                        } else {
                            marker = (LA3.marker(coord)).addTo(vmap);
                        }


                        searchdata("coord", marker.getLatLng(), function (e) {
                            if (callback) {
                                callback(e)
                            }

                        }
                        )
                    });
                } else {
                    alert("Geolocation is not supported by this browser.");
                }
            }

            !function () {
                var intetval = setInterval(() => {
                    if (A3_inloadflag && A3_leloadflag) {
                        drwaingmap(option)
                        clearInterval(intetval);
                    }
                }, 1000);
            }()

            //(Private function)-----------------------------------------------------------------------------
            function addevents(eventstr, callback) {
                var eventarr = eventstr.split(" ")
                for (var i = 0; i < eventarr.length; i++) {
                    if (typeof eventlist[eventarr[i]] != "undefined") {
                        eventlist[eventarr[i]].push(callback);
                    }
                }
            }

            function callevent(eventstr, callbackdata) {
                for (var i = 0; i < eventlist[eventstr].length; i++) {
                    eventlist[eventstr][i](callbackdata);
                }
            }
            function drwaingmap(option) {

                pop_options = {
                    offset: new LA3.Point(1, -22),
                    closeButton: false,
                    autoClose: false,
                    closeOnClick: false,
                };

                juso_pop = {
                    offset: new LA3.Point(1, 42),
                    closeButton: false,
                    autoClose: false,
                    closeOnClick: false,
                    className: 'juso-pop'
                };


                let mapwrap = document.createElement("div");
                let searching = false
                mapwrap.setAttribute("id", mapareaid + "-map");
                mapwrap.setAttribute("class", "A3-map");
                if (typeof area != "undefined") {
                    area = document.querySelector(mapareaid);
                }
                area.append(mapwrap);
                if(option.gestureHandling == false){
                    vmap = LA3.map(mapwrap, {
                        "center": [37.49780998323514, 127.02765941619874],
                        "zoom": 15,
                        "zoomControl": false,
                        "scrollWheelZoom": true,
                        "doubleClickZoom": true,
                        "minZoom": 6,
                        "maxZoom": 19,
                        zoomSnap: 0.1,
                    });
                }else{
                    vmap = LA3.map(mapwrap, {
                        "center": [37.49780998323514, 127.02765941619874],
                        "zoom": 15,
                        "zoomControl": false,
                        "scrollWheelZoom": true,
                        "doubleClickZoom": true,
                        "minZoom": 6,
                        "maxZoom": 19,
                        zoomSnap: 0.1,
                        gestureHandling: true,
                        gestureHandlingOptions: {
                            text: {
                                mousedown: "지도를 확대/축소 하려면 ctrl 키를 누른 채 스크롤 하세요.",
                                touch: "지도를 움직이려면 두손가락을 사용하세요.",
                                scroll: "지도를 확대/축소 하려면 ctrl 키를 누른 채 스크롤 하세요.",
                                scrollMac: "지도를 확대/축소 하려면 \u2318 키를 누른 채 스크롤 하세요."
                            }
                        }
                    });
                }
                


                var vworldLayer = LA3.tileLayer('https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png', {
                    "minZoom": 6,
                    "maxZoom": 19,
                    "maxNativA3oom": 19,
                    "attribution": '&copy; <a href="http://www.vworld.kr/">vworld</a> contributors'
                });
                vworldLayer.addTo(vmap);

                var searching_icon = document.createElement("span")
                $A3(searching_icon).addClass("searching-ani")
                $A3(mapwrap).append(searching_icon)

                vmap.on("drag movestart", function (e) {
                    console.log("??????")
                    callevent("drag", e)
                    dragging = true
                })

                vmap.on("zoom", function (e) {
                    console.log("??????")
                    // callevent("drag", e)
                    // dragging = true
                })


                vmap.on("moveend", function (e) {
                    console.log("moveend")
                    if (dragging) {
                        searchdata("coord", vmap.getCenter(), function (e) {
                            $A3(mapareaid).removeClass("map-searching");
                            vmap.dragging.enable();
                            if (typeof option.marker != "undefined") {
                                if (option.marker == "center") {

                                    if (option.textpop) {
                                        var textpopmsg;
                                        if (option.textpop == "jibun") {
                                            textpopmsg = e.jibunAddr
                                        } else if (option.textpop == "road") {
                                            textpopmsg = e.roadAddr
                                        }
                                        textpop.setLatLng(vmap.getCenter()).setContent(textpopmsg);
                                    }

                                    callevent("setmarker", e)
                                }
                            }

                            callevent("moveend", e)
                        })
                    }
                });

                //zoomcontrol
                if (typeof option.zoomcontrol != "undefined") {

                    if (option.zoomcontrol) {
                        if ((option.zoomcontrol == 'topleft') || (option.zoomcontrol == 'topright') || (option.zoomcontrol == 'bottomleft') || (option.zoomcontrol == 'bottomright')) {
                            LA3.control.zoom({
                                position: option.zoomcontrol
                            }).addTo(vmap);
                        } else {
                            LA3.control.zoom({
                                position: 'topleft'
                            }).addTo(vmap);
                        }
                    }
                } else {
                    LA3.control.zoom({
                        position: 'topleft'
                    }).addTo(vmap);

                }

                //my_location_btn 
                var mylocation_btn_option = {
                    id: "A3-map-mylocation-btn",
                    class: "",
                    innerhtml: '<span class="material-symbols-outlined">my_location</span> ',
                    onclick: function (e) {
                        _utils.mylocation(function (e) {
                            searchdata("coord", vmap.getCenter(), function (e) {
                                vmap.dragging.enable();
                                callevent("setmarker", e)
                            })
                        });

                    }
                }

                if (typeof option.my_location_btn != "undefined") {

                    if (option.my_location_btn) {
                        if (option.my_location_btn != 'none') {
                            if ((option.my_location_btn == 'topleft') || (option.my_location_btn == 'topright') || (option.my_location_btn == 'bottomleft') || (option.my_location_btn == 'bottomright')) {
                                mylocation_btn_option.class = option.my_location_btn + " A3-myloca-btn"
                                add_custm_btn(mylocation_btn_option)
                            } else {
                                mylocation_btn_option.class = " bottomleft" + " A3-myloca-btn"
                                add_custm_btn(mylocation_btn_option)
                            }
                        }
                    }
                } else {
                    mylocation_btn_option.class = "bottomleft" + " A3-myloca-btn"
                    add_custm_btn(mylocation_btn_option)
                }

                function add_custm_btn(option = {}) {
                    var controlarea = $A3(area).find(".leaflet-control-container")[0]
                    var button = document.createElement("button");

                    if (option.id) {
                        button.setAttribute("id", option.id);
                    }
                    if (option.class) {
                        button.setAttribute("class", option.class + " A3-map-btn");
                    }

                    if (option.innerhtml) {
                        button.innerHTML = option.innerhtml;
                    }

                    if (option.onclick) {
                        $A3(button).on("click", function (e) {
                            option.onclick(e)
                        })
                    }
                    controlarea.appendChild(button);
                }
                if (option.on) {
                    for (var key in option.on) {
                        addevents(key, option.on[key])
                    }
                }
                if (option.marker) {
                    function firstcenterrun() {

                        var firstcenter = vmap.getCenter()
                        marker = (LA3.marker(firstcenter)).addTo(vmap);

                        searchdata("coord", vmap.getCenter(), function (e) {

                            var textpopmsg;
                            if (option.textpop == "jibun") {
                                textpopmsg = e.jibunAddr
                            } else if (option.textpop == "road") {
                                textpopmsg = e.roadAddr
                            }
                            textpop = LA3.popup(juso_pop).setLatLng( vmap.getCenter()).setContent(textpopmsg).addTo(vmap);
                            callevent("setmarker", e)
                        })
                    }
                    if (option.marker == "center") {
                        firstcenterrun();

                        vmap.on("move", function () {
                            marker.setLatLng(vmap.getCenter());
                        });

                        vmap.on("zoom", function () {
                            console.log("xxxxxx");
                            marker.setLatLng(vmap.getCenter());
                        });
                    }

                }

                if (typeof option.addbtn != "undefined") {
                    var controlarea = $A3(area).find(".leaflet-control-container")[0]

                    custom_btn_arr = option.addbtn;
                    for (var i = 0; i < custom_btn_arr.length; i++) {
                        var option = custom_btn_arr[i];
                        var button = document.createElement("button");

                        if (typeof option.id != "undefined") {
                            button.setAttribute("id", option.id);
                        }
                        if (typeof option.class != "undefined") {
                            button.setAttribute("class", option.class + " map-btn");
                        }

                        if (typeof option.innerhtml != "undefined") {
                            button.innerHTML = option.innerhtml;
                        }

                        if (typeof option.onclick != "undefined") {
                            $A3(button).on("click", function (e) {
                                option.onclick(e)
                            })
                        }
                        controlarea.appendChild(button);

                    }
                } else {
                }
            }
            return init();
            function init() {
                return _utils;
            }

        }

        "function" == typeof define && define.amd ? define(function () {
            return a
        }) : "undefined" != typeof module ? module.exports = a : window.A3Address = a

        "function" == typeof define && define.amd ? define(function () {
            return b
        }) : "undefined" != typeof module ? module.exports = b : window.A3Map = b
    }



    async function getLocation(lat, lng) {
        let promise = new Promise((resolve, reject) => {
            let callname = "getlocation"
            let url = "https://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&crs=epsg:4326&point=" + lng + "," + lat + "&format=json&type=both&zipcode=true&simple=false&key=" + mapkey + "&callback=" + callname;
            loadfile("callback", url,
                function (res) {
                    resolve(res)
                }, callname
            )
        })
        return await promise
    }

    async function getcoorddata(jibunAddr) {
        let promise = new Promise((resolve, reject) => {
            let callname = "jusocallback"
            let url = 'https://api.vworld.kr/req/address?&service=address&request=getcoord&version=2.0&crs=epsg:4326&refine=true&simple=true&format=json&type=parcel&key=' + mapkey + '&address=' + jibunAddr + '&callback=' + callname
            loadfile("callback", url,
                function (res) {
                    resolve(res)
                }, callname
            )
        })
        return await promise;
    }

    async function getaddressdata(addresstext) {

        let promise = new Promise((resolve, reject) => {
            let url = "https://www.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&keyword=" + addresstext + "&confmKey=" + jusokey + "&resultType=json&countPerPage=" + 2000
            loadfile("request", url,

                function (res) {
                    let data = res.results.juso

                    if (data?.length >= 1) {
                        resolve(data[0])
                    } else {
                        resolve({
                            address: addresstext,
                            accuracy: "row"
                        })
                    }
                }
            )
        })
        return await promise
    }

}()

